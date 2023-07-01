import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ListItem } from '../../../../shared/models/test.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TreeMultiselectOptionsModel } from '../../../../shared/models/tree.multiselect.options.model';
import { filter, first, map, startWith, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AGE_GROUPS_FOR_REPORT } from '../../../../../assets/consts/consts';
import { AgeGroup } from '../../../../shared/models/bic.test.report/test.result.filter.model';
import { omit } from 'lodash';
import { DropdownDataType } from 'src/app/shared/enums/dropdown.type';

@Component({
  selector: 'app-demography-filter',
  templateUrl: './demography-filter.component.html',
  styleUrls: ['./demography-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemographyFilterComponent implements OnInit, AfterViewInit {
  @Input() public min = 18;
  @Input() public max = 75;
  @Input() public form: FormGroup;
  @Input() public genderOptions: ListItem[];
  @Input() public filterSource: Subject<void>;
  @Input() public marketOptions: TreeMultiselectOptionsModel[];
  @Input() public segmentOptions: ListItem[];
  @Input() public purchaseFrequenciesOptions: ListItem[];
  @Input() public purchaseInvolvementsOptions: ListItem[];
  @Input() public purchaseFrequencyCategoryId: string;

  private segmentChangeState: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public marketsDefaultLabel$: Observable<string>;
  public segmentsDefaultLabel$: Observable<string>;
  public selectedAgeGroups = AGE_GROUPS_FOR_REPORT;

  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    const markets = this.marketOptions.reduce(
      (accumulator, currentValue) => accumulator + currentValue.items.length,
      0
    );
    this.marketsDefaultLabel$ = this.markets.valueChanges.pipe(
      startWith(this.markets.value as string[]),
      map((value) => {
        const length = value ? value.length : 0;
        if (length === markets) {
          return this.translateService.instant('report.All markets');
        } else {
          return this.translateService.instant(
            'report.{{value}} region(s) selected',
            { value: length }
          );
        }
      })
    );
    this.segmentsDefaultLabel$ = this.segments.valueChanges.pipe(
      startWith(this.segments.value as []),
      map((value) => {
        const length = value ? value.length : 0;
        if (length === this.segmentOptions.length) {
          return this.translateService.instant('report.All segments');
        } else {
          return this.translateService.instant(
            'report.{{value}} segment(s) selected',
            { value: length }
          );
        }
      })
    );
  }

  public ngAfterViewInit(): void {
    this.selectedAgeGroups = this.getAgeGroups();
    this.cdr.detectChanges();
  }

  public get age(): FormControl {
    return this.form.get('age') as FormControl;
  }

  // public get minAge(): FormControl {
  //   return this.form.get('minAge') as FormControl;
  // }
  //
  // public get maxAge(): FormControl {
  //   return this.form.get('maxAge') as FormControl;
  // }

  public get genders(): FormControl {
    return this.form.get('genders') as FormControl;
  }

  public get markets(): FormControl {
    return this.form.get('markets') as FormControl;
  }

  public get segments(): FormControl {
    return this.form.get('segments') as FormControl;
  }

  public get purchaseFrequencies(): FormControl {
    return this.form.get('purchaseFrequencies') as FormControl;
  }

  public get purchaseInvolvements(): FormControl {
    return this.form.get('purchaseInvolvements') as FormControl;
  }

  public get DropdownDataType(): typeof DropdownDataType {
    return DropdownDataType;
  }

  public onSegmentChange(): void {
    this.segmentChangeState.next(true);
  }

  public getAgeGroups(): AgeGroup[] {
    return AGE_GROUPS_FOR_REPORT.filter(
      (item) =>
        (item.min >= this.min && item.min <= this.max) ||
        (item.min <= this.min && item.max >= this.min)
    );
  }

  public onPanelHide(): void {
    this.segmentChangeState
      .asObservable()
      .pipe(
        first(),
        filter((val) => !!val),
        tap(() => {
          this.filterSource.next();
          this.segmentChangeState.next(false);
        })
      )
      .subscribe();
  }

  public onChangeAgeGroups(ageGroups: AgeGroup[]): void {
    this.selectedAgeGroups = ageGroups;
    this.age.setValue(ageGroups.map(item => omit(item, ['name', 'id'])));
  }
}
