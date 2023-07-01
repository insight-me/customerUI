import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isEqual } from 'lodash';

@Component({
  selector: 'app-select-scale',
  templateUrl: './select-scale.component.html',
  styleUrls: ['./select-scale.component.scss', '../create-segmentation/create-segmentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectScaleComponent implements OnInit {
  @ViewChildren('radioItem') public radioList: QueryList<ElementRef>;
  @Input() public isEditMode: boolean;
  @Input() public initValues: number[];
  @Output() public goToNext = new EventEmitter<number[]>();
  @Output() public cancelChanges = new EventEmitter();

  public form: FormGroup;
  public currentValue = [1, 5];
  public radioHash = new Map([
    ['first_range', true],
    ['second_range', false],
    ['third_range', false],
  ]);

  public valuesHash = new Map([
    ['first_range', [1, 5]],
    ['second_range', [1, 7]],
    ['third_range', [1, 10]],
  ]);

  public ngOnInit(): void {
    this.initComponent();
  }

  public initComponent(): void {
    if (this.initValues.includes(0)) return;

    this.currentValue = this.initValues;

    for (let [key, value] of this.valuesHash) {
      if (!isEqual(value, this.initValues)) continue;

      for (let radioKey of this.radioHash.keys()) {
        this.radioHash.set(radioKey, radioKey === key);
      }
    }

  }

  public switch(id: string, values: number[]): void {
    this.radioHash.forEach((value, key) => {
      this.radioHash.set(key, key === id ? true : false);
    });
    this.currentValue = values;
  }

  public nextStep(): void {
    this.goToNext.emit(this.currentValue);
  }

}
