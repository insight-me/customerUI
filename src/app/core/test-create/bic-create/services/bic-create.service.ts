import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestService } from '../../../../shared/services/test/test.service';
import { BicTestService } from '../../../../shared/services/bic-test/bic-test.service';
import { BicCategoryService } from '../../../../shared/services/bic-test/bic-category.service';
import { RespondentsService } from './respondents.service';
import { Test } from '../../../../shared/models/test.model';
import { CalcTimeService } from '../../../../shared/services/calc-time/calc-time.service';
import { TestType } from '../../../../shared/enums/product.id.type';

@Injectable({
  providedIn: 'root',
})
export class BicCreateService {
  public currentTest$: BehaviorSubject<Test> = new BehaviorSubject<Test>(null);
  public testOnServer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public nextRoute: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentConcept: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public form: FormGroup;
  private currentTestId: string;

  constructor(
    private testService: TestService,
    private bicTestService: BicTestService,
    private fb: FormBuilder,
    private categoryService: BicCategoryService,
    private bicRespondentsService: RespondentsService,
    private calcTimeService: CalcTimeService
  ) {}

  public get test(): Observable<any> {
    return this.currentTest$.asObservable();
  }

  public get testId(): string {
    return this.currentTestId;
  }

  public set testId(data: string) {
    this.currentTestId = data;
  }

  public getTest(testId: string): void {
    this.bicTestService.getTestById(testId).subscribe((res) => {
      if (!res.respondentRequirements) {
        res.respondentRequirements =
          this.bicRespondentsService.setRespondentRequirements(
            res.respondentRequirements,
            TestType.BIC
          );
      } else {
        this.bicRespondentsService.setRespondentRequirements(
          res.respondentRequirements,
          TestType.BIC
        );
      }
      this.currentTest$.next(res);
      this.testOnServer.next(res);
      this.categoryService.setCategoryWhenInitTest(res.respondentRequirements);
    });
  }

  public initForm(): void {
    this.currentTest$.next(null);
    this.form = this.fb.group({
      testConcepts: new FormArray([]),
      customAssociations: [[], Validators.required],
      customQuestions: [[]],
      wordsLikesEnabled: [false],
      feedbackLike: [false],
      feedbackThink: [false],
      imageLikesEnabled: [false],
      testConceptRelevance: [false],
      purchaseFrequencyEnabled: [false],
    });
  }
}
