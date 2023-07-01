import { ChangeDetectorRef, Component, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { format, getISOWeek, isAfter } from 'date-fns';
import { isEqual } from 'lodash';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { asyncScheduler, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { BtReportStateService } from 'src/app/core/test-report/bt/bt.report.state.service';
import { GlobalFilterService } from 'src/app/core/test-report/bt/components/global-filter.service';
import { QuarterPickerComponent } from 'src/app/core/test-report/bt/components/quarter-picker/quarter-picker.component';
import { timeInterval } from 'src/app/shared/configs/timeInterval.config';
import { TestType } from 'src/app/shared/enums/product.id.type';
import { ListItem, Subdivision, Test } from 'src/app/shared/models/test.model';
import { populationOptions } from '../configs/poplulation.config';
import { NzCalendarMode } from '../enums/nz-range.type';
import { TimeInternal } from '../enums/period.enum';
import { TestResultModel } from '../models/bic.test.report/test.result.model';
import { BTTest } from '../models/bt-test.model';
import { BtTestResultModel } from '../models/bt.test.report/bt.test.result.model';
import { Countries, Involment } from '../models/test.model';
import { AppStateService } from '../services/app-state/app-state.service';
import {
  getFirstDayOfMonth,
  getFirstDayOfQuarter,
  getFirstDayOfWeek,
  getFirstDayOfYear,
  getLastDayOfMonth,
  getLastDayOfQuarter,
  getLastDayOfWeek,
  getLastDayOfYear
} from '../utils/date.utils';
import { BicReportStateService } from './../../core/test-report/bic/bic.report.state.service';

@UntilDestroy()
@Component({
  template: ''
})

export abstract class AbstractGlobalFiltersComponent implements OnInit {
  @ViewChildren('picker') public picker: QueryList<NzDatePickerComponent>;
  @ViewChildren('quarterPicker') public quarterPicker: QueryList<QuarterPickerComponent>;
  public testType: TestType;
  public form: FormGroup;
  public isOpened = true;
  public subCategory: Involment[] = [];
  public regions: Subdivision[] = [];
  public countries$: Observable<Countries[]>;
  public gender$: Observable<ListItem[]>;
  public purchaseFrequencies$: Observable<ListItem[]>;
  public readonly timeInternal = timeInterval;
  public readonly timeInternalEnum = TimeInternal;
  public readonly populationOptions = populationOptions;
  public previousFormValue: Record<string, any>;
  public populationValue: string;
  public calendarMode = NzCalendarMode.Week;
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();
  protected firstLoad = true;
  protected dataService: BicReportStateService | BtReportStateService;
  protected allOption = { id: 'All', value: 'All' };
  public purchaseFrequencies: ListItem[];
  public genders: ListItem[];

  get test(): BTTest | Test {
    return this.dataService.test
  }

  get isBIC(): boolean {
    return this.testType === TestType.BIC;
  }

  get testStartDate(): Date {
    return new Date(this.test.startDate);
  }

  get endTestDate(): Date {
    return new Date(this.test.endDate);
  }

  get hasSegments(): boolean {
    return this.test.respondentRequirements.isSegmentation || this.test.respondentRequirements.isCustomSegmentation;
  }

  get regionsValue(): Subdivision[] | null {
    return this.form.get('regions').value;
  }

  get countryValue(): string {
    return this.form.get('countryIds').value;
  }

  get periodValue(): TimeInternal {
    return this.form.get('period').value.value;
  }

  get countriesList(): Countries[] {
    return this.globalFiltersService.countryList;
  }

  /**
   * Event listener for keyboard events to handle the 'Enter' key press.
   * It stops the propagation and prevents the default behavior of the 'Enter' key press event.
   *
   * @param {KeyboardEvent} event - The keyboard event object.
   * @returns {void}
   */

  @HostListener('document:keypress', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  constructor(
    protected fb: FormBuilder,
    protected globalFiltersService: GlobalFilterService,
    protected appStateService: AppStateService,
    protected cdRef: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.setService();
    this.subCategory = [...this.test.respondentRequirements.involvements, ...this.test.respondentRequirements.customInvolvements];

    this.createForm();
    this.setObservables();
    this.getCountriesFromState();
    this.subscribeOnControl();

    if (!this.isBIC) {
      this.globalFiltersService.calendarMode = this.calendarMode;
      this.disableAutoComplete();
    }

  }

  public disableAutoComplete(): void {
    setTimeout(() => {
      this.picker.forEach(picker => picker.pickerInput.nativeElement.autocomplete = 'off');
    }, 0);
  }

  public show(): void {
    this.isOpened = !this.isOpened;
  }


  public resetForm(): void {
    this.form.get('population').patchValue(this.populationOptions[0]);
    this.form.get('purchase').patchValue(this.allOption);
    this.form.get('gender').patchValue(this.allOption);
    this.form.get('movingAverage').patchValue(true);
    this.form.get('category').patchValue(this.subCategory[0]);
    this.form.get('fromAge').patchValue(this.test.respondentRequirements.minAge);
    this.form.get('toAge').patchValue(this.test.respondentRequirements.maxAge);
    this.calendarMode = NzCalendarMode.Week;
    this.resetCountry();
    this.prepareCountry(this.countriesList, true);

    if (!this.isBIC) {
      this.form.get('period').patchValue(this.timeInternal[0]);
      this.form.get('startDate').setValue(this.getCurrentAndPreviousMonthDate()[0]);
      this.form.get('endDate').setValue(this.getCurrentAndPreviousMonthDate()[1]);
    }
  }

  /**
   * Calculates the number of weeks between two dates.
   * If the second date is not provided, the current date is used as the default value.
   * It calculates the absolute difference in milliseconds between the two dates.
   * Then it calculates the number of weeks by dividing the difference in milliseconds by the number of milliseconds in a week.
   * The result is rounded down to the nearest whole number.
   *
   * @param {Date} date1 - The first date.
   * @param {Date} date2 - The second date (optional, default is the current date).
   * @returns {number} - The number of weeks between the two dates.
   * @protected
   */

  protected weeksBetweenDates(date1: Date, date2: Date = new Date()): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  }

  /**
   * Retrieves the current and previous month dates.
   * It calculates the range of weeks between the test's start date and the current date.
   * If the range is less than or equal to 3 weeks, it returns an array with the start date and the current date.
   * Otherwise, it calculates the previous month's date based on the current date and returns an array with the previous month's date and the current date.
   *
   * @returns {Date[]} - An array containing the previous month's date and the current date.
   * @protected
   */

  protected getCurrentAndPreviousMonthDate(): Date[] {
    const startDate = new Date(this.test.startDate);
    const range = this.weeksBetweenDates(startDate);
    if (range <= 3) {
      return [startDate, new Date()];
    }

    const today = new Date();
    const currentMonthDay = today.getDate();
    const previousMonth = today.getMonth() - 1;
    const previousMonthYear = previousMonth < 0 ? today.getFullYear() - 1 : today.getFullYear();
    const daysInPreviousMonth = new Date(previousMonthYear, previousMonth + 1, 0).getDate();
    const previousMonthDay = Math.min(currentMonthDay, daysInPreviousMonth);
    const currentDate = new Date(today.getFullYear(), today.getMonth(), currentMonthDay);
    const previousMonthDate = new Date(previousMonthYear, previousMonth, previousMonthDay);
    return [previousMonthDate, currentDate];
  }



  public isArray(arr: unknown): boolean {
    return Array.isArray(arr);
  }

  public nzDisabledDate = (current: Date): boolean => {
    const testStartStamp = this.testStartDate.getTime();
    // ! Don't remove
    // const testEndStamp = this.endTestDate.getTime();
    const endTimeStamp = new Date().getTime();
    const currentStamp = current.getTime();
    return !(currentStamp < endTimeStamp && currentStamp > testStartStamp);
  }

  public open(): void {
    this.isOpened = !this.isOpened;
    this.globalFiltersService.isOpened$.next(true);
  }

  /**
   * Sets the calendar mode based on the selected period value.
   * The calendar mode determines the display mode of the calendar component.
   * The globalFiltersService is also updated with the selected calendar mode.
   *
   * @returns {void}
   * @public
   */

  public setCalendarMode(): void {
    switch (this.periodValue) {
      case TimeInternal.Weekly:
      default:
        this.calendarMode = NzCalendarMode.Week;
        this.globalFiltersService.calendarMode = NzCalendarMode.Week;
        break;
      case TimeInternal.Monthly:
        this.calendarMode = NzCalendarMode.Month;
        this.globalFiltersService.calendarMode = NzCalendarMode.Month;
        break;
      case TimeInternal.Quarterly:
        this.calendarMode = NzCalendarMode.Quarter;
        this.globalFiltersService.calendarMode = NzCalendarMode.Quarter;
        break;
      case TimeInternal.Yearly:
        this.calendarMode = NzCalendarMode.Year;
        this.globalFiltersService.calendarMode = NzCalendarMode.Year;
        break;
    }
  }

  /**
   * Fixes the input placeholder for a picker identified by the given pickerId.
   * If the picker with the specified pickerId is found, it updates the input placeholder based on the  calendar mode and the selected date.
   * If the calendar mode is NzCalendarMode.Week and a date is selected
   * it sets the input value to the year and week number of the selected date.
   * It also triggers change detection for the picker component to update the view.
   *
   * @param {string} pickerId - The identifier of the picker.
   *
   * @returns {void}
   */

  public fixInputPlaceholder(pickerId: string): void {
    const picker = Array.from(this.picker).find(item => item.nzId === pickerId);
    const date = this.form.get(pickerId).value;

    if (!picker) {
      return;
    }

    if (this.calendarMode === NzCalendarMode.Week && date) {
      const weekNumber = getISOWeek(date);
      const yearNumber = format(date, 'yyyy');
      picker.inputValue = `${yearNumber}-${weekNumber}`;

      (picker as NzDatePickerComponent & { cdr: ChangeDetectorRef }).cdr.detectChanges();
    }
  }

  protected abstract createForm(): void;

  protected resetCountry(): void {
    const countryFromTest = this.test.respondentRequirements.countries[0];
    const country = this.countriesList.find(item => countryFromTest.id === item.id);
    this.regions = country.subdivisions;
  }

  protected prepareCountry(countries: Countries[], isReset?: boolean): void {
    const countryFromTestId = this.test.respondentRequirements.countries[0].id;
    const country = countries.find((item) => item.id === countryFromTestId);
    this.form.get('countryIds').patchValue(country);

    if (!isReset) {
      this.regions = country.subdivisions;
    }
    this.form.get('regions').patchValue(this.regions);
  }

  protected getCountriesFromState(): void {
    this.globalFiltersService.getCountries()
      .pipe(tap(res => this.prepareCountry(res)))
      .subscribe();
  }

  /**
   * Subscribes to value changes of the form controls and performs various actions based on the changes.
   * Actions include fixing input placeholders, checking age, patching end date, preparing filters, setting calendar mode,
   * marking for change detection, and updating regions based on country selection.
   *
   * @returns {void}
   * @protected
   */

  protected subscribeOnControl(): void {
    // let prevCountry: ListItem = null;
    Object.keys(this.form.controls).forEach((name) => {
      this.form.get(name).valueChanges
        .pipe(
          tap(() => {
            if (isEqual(this.previousFormValue, this.form.getRawValue())) {
              return;
            }
            this.fixInputPlaceholder(name);
          }),
          debounceTime(400),
          distinctUntilChanged((a, b) => isEqual(a, b)),
          tap((res) => {
            if (!this.isBIC && name === 'movingAverage') {
              this.globalFiltersService.movingAverage$.next(this.form.get('movingAverage').value);
            }

            this.checkAge();

            if (isEqual(this.previousFormValue, this.form.getRawValue())) {
              return;
            }


            if (name === 'startDate' || name === 'endDate') {
              this.patchEndDate(name);
            }


            this.previousFormValue = this.form.getRawValue();

            asyncScheduler.schedule(() => {
              this.prepareFilters();
            }, 0);
            if (name === 'population') {
              this.populationValue = res.value;
            }

            if (name === 'period') {
              this.setCalendarMode();
            }


            this.cdRef.markForCheck();
            // ! Don't remove
            // if (name === 'countryIds') {
            //   if (res && !isEqual(res, prevCountry)) {
            //     this.regions = res.subdivisions;
            //     prevCountry = res;
            //   }
            //   this.form.get('regions').reset();
            // }
          }),
          untilDestroyed(this)
        )
        .subscribe();
    });
  }

  /**
   * Updates the 'endDate' control value based on the 'startDate' control value in the form.
   * Ensures that the 'endDate' is not set to a date earlier than the 'startDate'.
   *
   * @protected
   * @returns {void}
   */

  protected patchEndDate(controlName: string): void {
    const startDateControl = this.form.get('startDate');
    const endDateControl = this.form.get('endDate');
    const startAfter = isAfter(startDateControl.value, endDateControl.value);

    if (startAfter) {
      controlName === 'controlName' ?
        endDateControl.patchValue(this.form.get('startDate').value)
        : startDateControl.patchValue(this.form.get('endDate').value);
    }
  }

  /**
   * Checks the age range values and updates them if necessary.
   * If either the "fromAge" or "toAge" control is dirty, it compares the values with the minimum and maximum age requirements.
   * If the "fromAge" value is less than the minimum age, it patches the control with the minimum age.
   * If the "toAge" value is greater than the maximum age, it patches the control with the maximum age.
   * If the "fromAge" value is greater than the "toAge" value, it patches both controls with the minimum and maximum age respectively.
   *
   * @returns {void}
   * @protected
   */

  protected checkAge(): void {
    const fromAgeControl = this.form.get('fromAge');
    const toAgeControl = this.form.get('toAge');
    const { minAge, maxAge } = this.test.respondentRequirements;

    if (fromAgeControl.dirty || toAgeControl.dirty) {
      if (fromAgeControl.value < minAge) {
        fromAgeControl.patchValue(minAge);
      }

      if (toAgeControl.value > maxAge) {
        toAgeControl.patchValue(maxAge);
      }

      if (fromAgeControl.value > toAgeControl.value) {
        fromAgeControl.patchValue(minAge);
        toAgeControl.patchValue(maxAge);
      }
    }
  }

  protected setObservables(): void {
    this.countries$ = this.appStateService.countries.asObservable().pipe();
    this.gender$ = this.dataService.genderOptions.asObservable().pipe(
      tap((res) => this.genders = res),
      map((res) => [this.allOption, ...res]),
    );
    this.purchaseFrequencies$ = this.dataService.purchaseFrequenciesOptions.asObservable()
      .pipe(
        tap((res) => this.purchaseFrequencies = res),
        map((res) => [this.allOption, ...res]),
      );
  }

  protected getPurchaseFrequencyIds(): string[] {
    const formValue = this.form.get('purchase').value?.id;
    return formValue === 'All' ? this.purchaseFrequencies?.map(item => item.id) : [formValue];
  }

  protected getGenderIds(): string[] {
    const formValue = this.form.get('gender').value?.id;
    return formValue === 'All' ? this.genders.map(item => item.id) : [formValue];
  }

  protected getFirstDateValue(): string {
    const periodValue = Array.from(this.picker).find(item => item.nzId === 'startDate')?.inputValue;
    const quarterPeriodValue = Array.from(this.quarterPicker).find(item => item.controlName === 'startDate')?.inputValue;

    this.globalFiltersService.datesMap.set('startDate', periodValue ?? quarterPeriodValue);

    switch (this.calendarMode) {
      case NzCalendarMode.Week:
      default: return getFirstDayOfWeek(periodValue);
      case NzCalendarMode.Month: return getFirstDayOfMonth(periodValue);
      case NzCalendarMode.Quarter: return getFirstDayOfQuarter(quarterPeriodValue);
      case NzCalendarMode.Year: return getFirstDayOfYear(periodValue);
    }
  }

  /**
   * Retrieves the last date value based on the selected calendar mode.
   * It retrieves the period value from the picker or quarterPicker based on the calendar mode.
   * The retrieved period value is stored in the globalFiltersService's inputValue property.
   * The last date value is determined based on the calendar mode (week, month, quarter, or year) and the period value.
   *
   * @returns {string} - The last date value in string format.
   * @protected
   */
  protected getLastDateValue(): string {
    const periodValue = Array.from(this.picker).find(item => item.nzId === 'endDate')?.inputValue;
    const quarterPeriodValue = Array.from(this.quarterPicker).find(item => item.controlName === 'endDate')?.inputValue;
    this.globalFiltersService.datesMap.set('endDate', periodValue ?? quarterPeriodValue);

    switch (this.calendarMode) {
      case NzCalendarMode.Week:
      default: return getLastDayOfWeek(periodValue);
      case NzCalendarMode.Month: return getLastDayOfMonth(periodValue);
      case NzCalendarMode.Quarter: return getLastDayOfQuarter(quarterPeriodValue);
      case NzCalendarMode.Year: return getLastDayOfYear(periodValue);
    }
  }

  /**
   * Prepares the filters based on the form values and sends a request to retrieve report data using the generated filters.
   * The generated filters include moving average, regions, country IDs, gender IDs, time interval
   * purchase frequency IDs, start date, end date, category ID, and age range.
   * The retrieved report data is subscribed to as an observable.
   *
   * @returns {void}
   * @protected
   */

  protected prepareFilters(): void {
    const formValues = this.form.getRawValue();
    const filters = {
      ...(formValues.movingAverage !== null && { movingAverageOn: formValues.movingAverage }),
      ...(formValues.regions && { regions: formValues.regions.map((region) => region.id) }),
      ...(formValues.countryIds && { countryIds: [formValues.countryIds.id] }),
      ...(formValues.gender && { genderIds: this.getGenderIds() }),
      ...(formValues.period && { timeInterval: formValues.period.value }),
      ...(formValues.purchase && { purchaseFrequencyIds: this.getPurchaseFrequencyIds() }),
      ...(formValues.startDate && { startDate: this.getFirstDateValue() }),
      ...(formValues.endDate && { endDate: this.getLastDateValue() }),
      ...(formValues.category && { subCategoryId: formValues.category.id }),
      ...(formValues.fromAge && formValues.toAge && {
        age: [{
          ...(formValues.fromAge && { min: formValues.fromAge }),
          ...(formValues.toAge && { max: formValues.toAge })
        }]
      })
    };
    (this.dataService.getReportData(filters) as Observable<TestResultModel | BtTestResultModel>).subscribe();
  }

  protected abstract setService(): void;
}
