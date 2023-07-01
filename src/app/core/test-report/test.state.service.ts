import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { TestResultService } from '../../shared/services/test/test.result.service';
import { KPIModel, KPITitle } from '../../shared/models/bic.test.report/KPIModel';
import { ListItem, Test } from '../../shared/models/test.model';
import { TreeMultiselectOptionsModel } from '../../shared/models/tree.multiselect.options.model';
import { TestService } from '../../shared/services/test/test.service';
import { TranslateService } from '@ngx-translate/core';
import { ReportCustomQuestionsService } from './report.custom-questions.service';
import { BTTest } from '../../shared/models/bt-test.model';

@Injectable()
export class TestStateService<T extends Test | BTTest> {
  public formBuilder: FormBuilder;
  public testResultService: TestResultService;
  public testService: TestService;
  public translateService: TranslateService;
  public reportCustomQuestionsService: ReportCustomQuestionsService<T>;

  public dashboardExpandedCharts: Set<number> = new Set<number>();
  public test: T;
  public kpiMap: BehaviorSubject<Map<KPITitle, KPIModel>> = new BehaviorSubject<Map<KPITitle, KPIModel>>(null);

  public min: number = 18;
  public max: number = 75;
  public genderOptions: BehaviorSubject<ListItem[]> = new BehaviorSubject<ListItem[]>(null);
  public marketOptions: BehaviorSubject<TreeMultiselectOptionsModel[]> =
    new BehaviorSubject<TreeMultiselectOptionsModel[]>(null);
  public segmentOptions: BehaviorSubject<ListItem[]> = new BehaviorSubject<ListItem[]>(null);
  public purchaseFrequenciesOptions: BehaviorSubject<ListItem[]> =
    new BehaviorSubject<ListItem[]>(null);
  public purchaseInvolvementsOptions: BehaviorSubject<ListItem[]> =
    new BehaviorSubject<ListItem[]>(null);

  constructor(protected injector: Injector) {
    this.formBuilder = injector.get(FormBuilder);
    this.testResultService = injector.get(TestResultService);
    this.testService = injector.get(TestService);
    this.translateService = injector.get(TranslateService);
    this.reportCustomQuestionsService = injector.get(
      ReportCustomQuestionsService
    );
  }
}
