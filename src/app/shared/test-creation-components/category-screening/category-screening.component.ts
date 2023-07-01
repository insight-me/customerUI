import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RespondentsService } from 'src/app/core/test-create/bic-create/services/respondents.service';
import { CategoryScreening } from '../../enums/category-screening.type';
import { RespondentRequirements, Test } from '../../models/test.model';
import { TestType } from '../../enums/product.id.type';

const CATEGORY_SCREENING_ELEMENTS = [
  {
    title: 'Predesigned screening',
    id: CategoryScreening.Predesigned,
  },
  {
    title: 'Customized screening',
    id: CategoryScreening.Customized,
  },
  {
    title: 'Category screening is not applicable',
    id: CategoryScreening.NotApplicable,
  },
];

@Component({
  selector: 'app-category-screening',
  templateUrl: './category-screening.component.html',
  styleUrls: ['./category-screening.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryScreeningComponent {
  @Input() set respondentRequirements(
    respondentRequirements: RespondentRequirements
  ) {
    this._initFormControl(respondentRequirements);
  }

  @Input() testType: TestType;

  public categoryScreeningElements = CATEGORY_SCREENING_ELEMENTS;
  public categoryScreeningFormControl = new FormControl(null, [
    Validators.required,
  ]);

  constructor(public bicRespondentsService: RespondentsService) {}

  public get CategoryScreening(): typeof CategoryScreening {
    return CategoryScreening;
  }

  public onChangeCategoryScreening(): void {
    this.bicRespondentsService.updateCategoryScreening(
      this.categoryScreeningFormControl.value
    );
  }

  private _initFormControl(
    respondentRequirements: RespondentRequirements
  ): void {
    if (respondentRequirements.categoryScreening) {
      this.categoryScreeningFormControl.setValue(
        respondentRequirements.categoryScreening
      );
    }
  }
}
