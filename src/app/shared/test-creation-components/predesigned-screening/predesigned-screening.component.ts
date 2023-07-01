import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Involment, RespondentRequirements } from '../../models/test.model';
import { BicCategoryService } from '../../services/bic-test/bic-category.service';
import { AppStateService } from '../../services/app-state/app-state.service';
import { RespondentsService } from 'src/app/core/test-create/bic-create/services/respondents.service';
import { CategoryScreeningType } from '../../enums/category-screening.type';
import { TestCreationUtils } from '../../utils/test.creation.utils';
import { orderBy } from 'lodash';

@Component({
  selector: 'app-predesigned-screening',
  templateUrl: './predesigned-screening.component.html',
  styleUrls: ['./predesigned-screening.component.scss'],
})
export class PredesignedScreeningComponent implements OnInit {
  @Input() set respondentRequirements(
    respondentRequirements: RespondentRequirements
  ) {
    this.respRequirements = respondentRequirements;
    setTimeout(() => this.cdr.detectChanges(), 500);
  }

  public respRequirements: RespondentRequirements = null;

  constructor(
    public appStateService: AppStateService,
    public categoryService: BicCategoryService,
    public bicRespondentsService: RespondentsService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {}

  public getAllSubcategories(subcategories): Involment[] {
    return orderBy(
      this.respRequirements.involvements
        .map((inv) => {
          inv.value = TestCreationUtils.getSubcategoryName(inv, subcategories);
          return inv;
        })
        .concat(
          this.respRequirements.customInvolvements.filter((item) =>
            TestCreationUtils.getValuesNotInvalid(
              this.categoryService.customSubcategoriesControl
            )
              .map((elem) => elem.subcategory)
              .includes(item.value)
          )
        ),
      (name) => name.value.toLowerCase()
    );
  }

  public onUpdatePurchaseFrequancies(
    category: Involment,
    value: string[]
  ): void {
    this.bicRespondentsService.updatePurchaseFrequancies(category, value);
  }

  public onUpdateCategoryScreeningType(type: CategoryScreeningType): void {
    this.bicRespondentsService.updateCategoryScreeningType(type);
  }
}
