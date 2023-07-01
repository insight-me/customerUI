import {Component, Injector} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import { ActiveFilterType } from 'src/app/shared/enums/active.filter.type';
import {filter, map, shareReplay, switchMap} from "rxjs/operators";
import {ActivatedRoute, Params} from "@angular/router";
import {BtReportStateService} from "../../bt/bt.report.state.service";
import {BicReportStateService} from "../../bic/bic.report.state.service";
import {TestDataService} from "../../test.data.service";
import { BTTest } from '../../../../shared/models/bt-test.model';
import { Test } from '../../../../shared/models/test.model';

@Component({
  selector: 'app-base-report',
  template: '',
})
export class BaseReportComponent<T> {
  public test$: Observable<T>;
  public activeFilter: BehaviorSubject<ActiveFilterType> = new BehaviorSubject<ActiveFilterType>(ActiveFilterType.None);
  public ActiveFilterType = ActiveFilterType;
  protected activatedRoute: ActivatedRoute;
  private testDataService: TestDataService;

  constructor(
    protected injector: Injector,
  ) {
    this.activatedRoute = injector.get(ActivatedRoute);
    this.testDataService = injector.get(TestDataService);
  }

  public toggleFilter(type: ActiveFilterType): void {
    const current = this.activeFilter.getValue();
    this.activeFilter.next(current === type ? ActiveFilterType.None : type);
  }

  public getTest(service: BtReportStateService | BicReportStateService): Observable<Test | BTTest> {
    const test$ = this.activatedRoute.params
      .pipe(
        map(({id}: Params) => id),
        filter((id: string) => !!id),
        switchMap((id: string) => service.getTestById(id)),
        shareReplay()
      );

    this.testDataService.testName$ = test$
      .pipe(
        map(({testName}) => testName)
      );

    return test$;
  }

}
