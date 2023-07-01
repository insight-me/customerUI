import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TestType } from '../../../../shared/enums/product.id.type';
import { BTTest } from '../../../../shared/models/bt-test.model';
import { BicCategoryService } from '../../../../shared/services/bic-test/bic-category.service';
import { BtTestService } from '../../../../shared/services/bt-test/bt-test.service';
import { RespondentsService } from '../../bic-create/services/respondents.service';

@Injectable({
  providedIn: 'root',
})
export class BtStateService {
  public currentTest$: BehaviorSubject<BTTest> = new BehaviorSubject<BTTest>(
    null
  );
  public nextRoute$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public testId = '';
  public lang!: string;

  constructor(
    private btTestService: BtTestService,
    private respondentService: RespondentsService,
    private categoryService: BicCategoryService
  ) { }

  public getTest(testId: string): void {
    this.testId = testId;
    this.btTestService.getTestById(testId).subscribe((res) => {
      if (!res.respondentRequirements) {
        res.respondentRequirements =
          this.respondentService.setRespondentRequirements(
            res.respondentRequirements,
            TestType.BT
          );
      } else {
        this.respondentService.setRespondentRequirements(
          res.respondentRequirements,
          TestType.BT
        );
      }
      this.categoryService.setCategoryWhenInitTest(res.respondentRequirements);
      this.currentTest$.next(res);
    });
  }
}
