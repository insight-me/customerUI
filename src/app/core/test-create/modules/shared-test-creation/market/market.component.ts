import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy, OnInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { isEmpty, orderBy } from 'lodash';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';
import { BicTestService } from 'src/app/shared/services/bic-test/bic-test.service';
import { DropdownDataType } from '../../../../../shared/enums/dropdown.type';
import { TestType } from '../../../../../shared/enums/product.id.type';
import { BTTest } from '../../../../../shared/models/bt-test.model';
import {
  Countries,
  RespondentRequirements,
  Subdivision,
  Test
} from '../../../../../shared/models/test.model';
import { AppStateService } from '../../../../../shared/services/app-state/app-state.service';
import { RespondentsService } from '../../../bic-create/services/respondents.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() typeTest: TestType;
  @Input() respondentRequirements: RespondentRequirements;


  public countries: Countries[] = [];
  public test: Test | BTTest;

  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private appStateService: AppStateService,
    private cdref: ChangeDetectorRef,
    private bicRespondentsService: RespondentsService,
    public bicTestService: BicTestService,
  ) { }

  public ngOnInit(): void {
    this._subscribeOnForm();

    this.market.value.country ?
      this._setLang(this.market.value) :
      localStorage.removeItem('previewLanguage');
  }

  public ngAfterViewInit(): void {
    this._getAllCountries();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public get market(): FormGroup {
    return this.bicRespondentsService.countryForm;
  }

  public get DropdownDataType(): typeof DropdownDataType {
    return DropdownDataType;
  }

  public controlHasError(control: string): boolean {
    const currentControl = this.market.controls[control] as FormControl;
    return currentControl.touched && currentControl.invalid;
  }

  public getRegions(): Subdivision[] {
    if (isEmpty(this.market.controls.country)) {
      return;
    }
    const regions = orderBy(
      this.market?.controls?.country?.value?.subdivisions,
      ['name'],
      ['asc']
    );
    regions.map((item) => {
      delete item.code;
    });
    return regions;
  }

  public onChangeCountry(country): void {
    this.market.controls.country.setValue(country);
    this.market.controls.subdivisions.setValue(country.subdivisions);
    this.bicRespondentsService.updateCountry();
  }

  public onChangeRegions(items): void {
    this.market.controls.subdivisions.setValue(items);
    this.bicRespondentsService.updateSubdivisions();
  }

  private _getAllCountries(): void {
    this.appStateService.countries
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter((countries) => !!countries.length)
      )
      .subscribe((countries) => {
        this.countries = countries;
        this.cdref.detectChanges();
      });
  }

  private _subscribeOnForm(): void {
    this.market.valueChanges.pipe(
      distinctUntilChanged((a, b) => a.country.countryCode === b.country.countryCode),
      tap((res) => this._setLang(res)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

  private _setLang(obj: Record<string, any>): void {
    const countryCode = obj.country.countryCode;
    if (!countryCode) {
      return;
    }

    const lang = countryCode.toUpperCase() === 'US' ? 'en' : (countryCode).toLowerCase();
    localStorage.setItem('previewLanguage', lang);
  }
}
