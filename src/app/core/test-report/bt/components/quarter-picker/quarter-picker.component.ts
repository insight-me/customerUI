import { ChangeDetectorRef, Component, ElementRef, forwardRef, Input, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { quarters } from 'src/app/shared/configs/quarters.config';
import { parseQuarter, reverseParseQuarter } from 'src/app/shared/helpers/parse-quarter';
import { getLastCompletedQuarter } from 'src/app/shared/utils/date.utils';
import { BTTest } from './../../../../../shared/models/bt-test.model';
export const QUARTER_PICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => QuarterPickerComponent),
  multi: true
};
@Component({
  selector: 'app-quarter-picker',
  templateUrl: './quarter-picker.component.html',
  styleUrls: ['./quarter-picker.component.scss'],
  providers: [QUARTER_PICKER_VALUE_ACCESSOR]
})
export class QuarterPickerComponent implements OnInit, ControlValueAccessor {
  @ViewChildren('quarterItem') public quarterItems: QueryList<ElementRef>;
  @ViewChild('input') public input: ElementRef;
  @Input() public controlValue: Date;
  @Input() public controlName: string;
  @Input() public disabled: Date;
  @Input() public test: BTTest;
  public isOpened = false;
  public isAnimating!: boolean;
  public quarters = quarters;
  public form!: FormGroup;
  public year = new Date().getFullYear();
  public inputId: string;
  public inputValue: string;
  public pickerId: string;
  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };


  get selectedQuarter(): string {
    return this.form.get('date').value;
  }

  constructor(private _cdRef: ChangeDetectorRef, private fb: FormBuilder, private _renderer2: Renderer2) { }

  public writeValue(value: any): void {
    if (!value) {
      this.form.reset();
      this._cdRef.detectChanges();
      return;
    }


    const readyValue = typeof value === 'string' ? (parseQuarter(value)) : value;

    this.onChange(readyValue);

  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void { }

  public ngOnInit(): void {
    this._createForm();
    this._createHashId();
    this._patchForm();
    this._cdRef.detectChanges();
    this.pickerId = this.controlName;
    this.inputValue = reverseParseQuarter(this.controlValue);
  }

  public handleContainerClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  /**
   * Updates the input value based on the selected quarter.
   * If the currentQuarter is already equal to the inputValue, it returns without making any changes.
   * It filters the quarterItems to get only the disabled items.
   * It iterates through the quarterItems and checks if the parsed quarter value of the inputValue is greater than or equal to the parsed quarter value of the item's id.
   * If the condition is met, it sets the form control's value to either getLastCompletedQuarter() or the inputValue, based on the controlName.
   * If the condition is met, it sets the isReturn flag to true.
   * If the isReturn flag is true, it returns without making any further changes.
   * If the isReturn flag is false, it checks if the selectedQuarter has the correct format using the checkFormat() method.
   * If the selectedQuarter format is incorrect, it sets the form control's value to the inputValue without emitting an event or affecting only the self.
   * If the selectedQuarter format is correct, it calls the selectQuarter() method with the selectedQuarter and false as arguments.
   *
   * @public
   * @returns {void}
   */


  public patchInput(): void {
    const currentQuarter = this.selectedQuarter;
    let isReturn = false;

    if (currentQuarter === this.inputValue) {
      return;
    }


    const quarterItems = Array.from(document.querySelectorAll('.quarter-item')).filter(item => item.classList.contains('disabled'));

    quarterItems.forEach(item => {
      if (parseQuarter(this.inputValue) >= parseQuarter(item.id)) {
        const value = this.controlName === 'endDate' ? getLastCompletedQuarter() : this.inputValue;
        this.form.get('date').patchValue(value);
        isReturn = true;
      }
    });

    if (isReturn) {
      return;
    }

    !this.checkFormat(this.selectedQuarter) ?
      this.form.get('date').patchValue(this.inputValue, { emitEvent: false, onlySelf: true }) :
      this.selectQuarter(this.selectedQuarter, false);
  }


  public disable(item: string): boolean {
    const pickers = document.querySelectorAll('app-quarter-picker');
    const picker = pickers[0];
    const input = picker.querySelector('input');

    const testQuarter = reverseParseQuarter(new Date(this.test.startDate));
    const parsedItem = parseQuarter(item);
    const parsedTestQuarter = parseQuarter(testQuarter);
    const firstInputValue = parseQuarter(input.value);

    const currentDate = new Date();
    const currentQuarter = parseQuarter(reverseParseQuarter(currentDate));

    return parsedItem < parsedTestQuarter || parsedItem > currentQuarter || (input.id !== this.inputId && parsedItem < firstInputValue);
  }


  public checkFormat(str: string): boolean {
    const regex = /^Q[1-4]\d{4}$/;
    return regex.test(str);
  }


  public incrementYear(): void {
    this.year = this.year + 1;
    this._changeClass();
  }

  public decrementYear(): void {
    this.year = this.year - 1;
    this._changeClass();
  }

  public valueChanged(): void { }

  public selectQuarter(item: string, disabled: boolean): void {
    if (disabled) {
      return;
    }
    this.isOpened = false;
    this.inputValue = item;
    this.form.get('date').patchValue(item);
    this.writeValue(item);
    this._cdRef.detectChanges();
  }

  public close(): void {
    this.isOpened = false;
  }

  private _createForm(): void {
    this.form = this.fb.group({
      date: this.fb.control(null),
    });
  }

  private _patchForm(): void {
    const quarter = reverseParseQuarter(this.controlValue);
    this.form.get('date').patchValue(quarter);
  }

  /**
   * Creates a random hash ID consisting of alphanumeric characters.
   * It generates a random hash by selecting characters from the provided character set.
   * The length of the hash is determined by the value of hashLength.
   * The generated hash is assigned to the inputId property.
   *
   * @private
   * @returns {void}
   */

  private _createHashId(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let hash = '';
    const hashLength = 10;

    for (let i = 0; i < hashLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      hash += characters[randomIndex];
    }
    this.inputId = hash;
  }

  /**
   * Changes the class of the quarter items based on the selectedQuarter value.
   * It iterates through each quarter item and adds or removes the 'selected-quarter' class based on whether the item's id matches the selectedQuarter value.
   * After updating the class, it triggers change detection to apply the changes.
   *
   * @private
   * @returns {void}
   */

  private _changeClass(): void {
    this.quarterItems.forEach((item) => {
      const elem = item.nativeElement;
      elem.id === this.selectedQuarter ?
        this._renderer2.addClass(elem, 'selected-quarter') :
        this._renderer2.removeClass(elem, 'selected-quarter');
      this._cdRef.detectChanges();
    }
    );
  }
}
