import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryScreeningType } from '../../enums/category-screening.type';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-predesign-must-engage',
  templateUrl: './predesign-must-engage.component.html',
  styleUrls: ['./predesign-must-engage.component.scss'],
})
export class PredesignMustEngageComponent {
  @Input() labels: { all: string; one: string } = {
    all: 'BIC.of the above sub-categories and selected frequencies to qualify for the survey',
    one: 'BIC.of the above sub-categories and selected frequencies to qualify for the survey',
  };
  @Input() set categoryScreeningType(data: CategoryScreeningType) {
    this.engageControl.setValue(data);
  }

  @Output() updateCategoryScreeningType = new EventEmitter();

  public engageControl: FormControl = new FormControl(
    CategoryScreeningType.All
  );

  public get CategoryScreeningType(): typeof CategoryScreeningType {
    return CategoryScreeningType;
  }

  public onUpdateEngage(): void {
    this.updateCategoryScreeningType.emit(this.engageControl.value);
  }
}
