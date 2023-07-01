import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IconsType } from '../../../../shared/enums/icons.type';
import { AppStateService } from '../../../../shared/services/app-state/app-state.service';
import { TestDataService } from '../../test.data.service';

const testNames = {
  bic: 'report.Brand & Innovation Concept test',
  bt: 'report.Brand Tracking',
};

@Component({
  selector: 'app-report-container',
  templateUrl: './report-container.component.html',
  styleUrls: ['./report-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportContainerComponent implements OnInit {
  public reportTitle$: Observable<string>;
  public IconsType = IconsType;
  public testType: string;

  constructor(private appStateService: AppStateService, private activatedRoute: ActivatedRoute, public testDataService: TestDataService) { }

  public ngOnInit(): void {

    this.reportTitle$ = of(this.activatedRoute.snapshot.firstChild.url[0].path)
      .pipe(
        tap(path => this.testType = path),
        map((path: string) => testNames[path]),
      );
  }
}
