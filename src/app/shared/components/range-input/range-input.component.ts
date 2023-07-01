import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-range-input',
  templateUrl: './range-input.component.html',
  styleUrls: ['./range-input.component.scss'],
})
export class RangeInputComponent {
  @Input() items = [];
  @Input() purchaseFrequancies = [];
  @Output() updatePurchaseFrequancies: EventEmitter<string[]> =
    new EventEmitter<string[]>();

  constructor() {}

  public get purchaseFrequanciesValue(): number {
    return this.purchaseFrequancies?.length;
  }

  public set purchaseFrequanciesValue(value: number) {
    this.onOptionClickPurchaseFrequencies(value);
  }

  public getTrackRange(num: number): number[] {
    return Array.from(Array(num - 1).keys());
  }

  public onOptionClickPurchaseFrequencies(value: number): void {
    const arraySelected: string[] = [];
    this.items.forEach((item, i) => {
      if (i <= value - 1) {
        arraySelected.push(item.id);
      }
    });
    this.updatePurchaseFrequancies.emit(arraySelected);
  }
}
