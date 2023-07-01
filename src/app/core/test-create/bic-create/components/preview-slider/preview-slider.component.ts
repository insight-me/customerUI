import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MAX_MARK_KPI } from '../../../../../../assets/consts/consts';
import { KPIMax, KPIMin, QuestionType } from '../../../../../shared/models/preview.model';
import { AppStateService } from '../../../../../shared/services/app-state/app-state.service';

@Component({
  selector: 'app-preview-slider',
  templateUrl: './preview-slider.component.html',
  styleUrls: ['./preview-slider.component.scss']
})
export class PreviewSliderComponent implements OnInit {
  @Input() public question: any = null;
  @Input() public questionNum: number;
  @Input() public questionNumMax: number;
  @Input() public type: string;
  @Input() public isConsumerInsight = false;
  public arr: number[] = [];
  public purchaseFrequencies: any[] = [];
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private appStateService: AppStateService) {
  }

  public ngOnInit(): void {
    this.setLegend();
    this.appStateService.respondentOptions$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.purchaseFrequencies = value.purchaseFrequencies;
    });
  }

  public getMinLabel(): string {
    return this.type === QuestionType[0] ? 'filter-step-3.is-low' : KPIMin[this.question?.enTitle];
  }

  public getMaxLabel(): string {
    return this.type === QuestionType[0] ? 'filter-step-3.is-hight' : KPIMax[this.question?.enTitle];
  }

  public getConsumerInsight(text: string): string[] {
    return text?.split('\n');
  }

  private setLegend(): void {
    (this.arr = Array.from(Array(MAX_MARK_KPI).keys()));
  }
}
