import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BicTestService } from 'src/app/shared/services/bic-test/bic-test.service';
import { Test } from '../../../../../shared/models/test.model';


@Component({
  selector: 'app-preview-two',
  templateUrl: './preview-two.component.html',
  styleUrls: ['./preview-two.component.scss']
})
export class PreviewTwoComponent implements AfterViewInit, OnDestroy {
  @Input() test: Test;
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private bicTestService: BicTestService) {
  }


  public ngAfterViewInit(): void {
    const lang = JSON.parse(localStorage.getItem('language'));
    if (lang !== 'EN') {
      this.bicTestService.getStatements(localStorage.getItem('previewLanguage') ?? undefined)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {
          const allStatements = res;
          const KPI = [];
          this.test.testKPIs.forEach((kpi) => {
            const swedenKPI = allStatements.filter((item) => item.id === kpi.id)[0];
            KPI.push(swedenKPI);
          });
          this.test.testKPIs = KPI;
        });
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
