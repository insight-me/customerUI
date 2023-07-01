import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,

  ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { GlobalFilterService } from 'src/app/core/test-report/bt/components/global-filter.service';
import {
  ConceptScorePerSegmentModel,
  SegmentKpis
} from '../../../../../shared/models/bic.test.report/concept.score.per.segment.model';
import {
  KPIModel,
  KPITitle
} from '../../../../../shared/models/bic.test.report/KPIModel';
import { BicReportStateService } from '../../bic.report.state.service';

@Component({
  selector: 'app-score-per-segment',
  templateUrl: './score-per-segment.component.html',
  styleUrls: ['./score-per-segment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScorePerSegmentComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public dataSet: ConceptScorePerSegmentModel;
  @Input() public pdfVersion = false;
  @Input() public kpi: Map<KPITitle, KPIModel>;
  public isOpened = true;
  private readonly notifier: Subject<void> = new Subject<void>();
  private columns = 1;
  public data: SegmentKpis[][] = [];
  public tableRows: KPITitle[] = [
    KPITitle.Likeability,
    KPITitle.PurchaseIntent,
    KPITitle.PurchaseFrequency,
    KPITitle.CurrentBrandLikeability,
    KPITitle.Uniqueness,
    KPITitle.Relevance,
    KPITitle.Trustworthiness,
    KPITitle.Brandfit,
  ];

  @ViewChild('contentRef') private contentRef: ElementRef;
  @ViewChild('tableRef') private tableRef: any;

  get isSmallDesktop(): boolean {
    return window.innerWidth < 1100;
  }

  constructor(private cdr: ChangeDetectorRef,
    private bicRSS: BicReportStateService,
    private _globalFilterService: GlobalFilterService
  ) { }

  public ngOnInit(): void {
    this.columns = this.dataSet.segments.length;
    this.tableRows = this.tableRows.filter((el) => this.kpi.has(el));
    this._globalFilterService.isOpened$
      .pipe(
        tap((res) => {
          this.isOpened = res;
          this.cdr.markForCheck();
        }),
        takeUntil(this.notifier)
      )
      .subscribe();
  }

  public ngAfterViewInit(): void {
    this.buildTable();
  }

  public ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }


  public get selectedSegments(): string[] {
    return this.bicRSS.segments.value.map((el) => el.value);
  }

  private buildTable(): void {
    const data = [];
    data.push(this.dataSet.segments);
    this.data = data;
    this.cdr.detectChanges();
  }

  public tableStyle(columnsPerRow: number): { [key: string]: string } {
    return {
      'grid-template-columns': `2fr repeat(${2 + (this.selectedSegments.length)}, 1fr)`,
    };
  }
}
