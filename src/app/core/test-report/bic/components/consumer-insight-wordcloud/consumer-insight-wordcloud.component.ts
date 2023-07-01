import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { BicReportStateService } from '../../bic.report.state.service';
import { TranslateService } from '@ngx-translate/core';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { ConsumerInsightModel } from '../../../../../shared/models/bic.test.report/consumer.insight.model';
import { AccumulatedLikes } from '../../../../../shared/models/bic.test.report/test.concept.result.model';
import { TestReportUtils } from '../../../../../shared/utils/test.report.utils';
import { debounceTime, delay, filter, map, tap } from 'rxjs/operators';
import { BehaviorSubject, merge, Observable, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-consumer-insight-wordcloud',
  templateUrl: './consumer-insight-wordcloud.component.html',
  styleUrls: ['../consumer-insight.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ConsumerInsightWordcloudComponent implements OnInit, OnDestroy {
  @Input() public dataSet$: BehaviorSubject<ConsumerInsightModel[]> = null;
  @Input() public likeConfig: { like: boolean; dislike: boolean } = {
    like: true,
    dislike: true,
  };
  @ViewChildren('cloudContainerRef') private cloudContainerRefs: any;

  public options: CloudOptions = {
    width: 1,
    height: 450,
    overflow: false,
    realignOnResize: true,
    font: 'normal normal 11px "GT Walsheim Pro Regular"',
  };

  private subscriptions: Subscription = new Subscription();

  public resizeSubject: Subject<void> = new Subject<void>();

  @HostListener('window:resize')
  private windowResize(): void {
    this.resizeSubject.next();
  }

  constructor(private translate: TranslateService) {}

  public ngOnInit(): void {
    const resize$: Observable<ConsumerInsightModel[]> = this.resizeSubject.asObservable().pipe(
      debounceTime(2000),
      map(() => this.dataSet$.getValue())
    );
    /*Add tooltip to span elements when data received or screen resized*/
    this.subscriptions.add(
      merge(this.dataSet$.asObservable(), resize$)
        .pipe(
          filter(val => !!val),
          delay(2000), // let animation finished
          tap((consumerInsightData: ConsumerInsightModel[]) => {
            /*For each cloud*/
            this.cloudContainerRefs._results.forEach((cloudElementRef: ElementRef, cloudIndex: number) => {
              const elements = Array.from(cloudElementRef.nativeElement.firstChild.children);
              const conceptId = cloudElementRef.nativeElement.attr;
              const { likedWords, dislikedWords }: AccumulatedLikes = consumerInsightData.find(
                ({ concept }) => concept.id === conceptId
              ).accumulatedLikes;
              /*For each element in cloud*/
              elements.forEach((element: any) => {
                const word = element.innerHTML;
                const likes = likedWords[word] || 0;
                const dislikes = dislikedWords[word] || 0;
                element.innerHTML = this.tooltip(likes, dislikes) + word;
              });
            });
          })
        )
        .subscribe()
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public getData(accumulatedLikes: AccumulatedLikes): CloudData[] {
    return TestReportUtils.angularTagCloudData(accumulatedLikes);
  }

  private tooltip(likes: number, dislikes: number): string {
    return this.likeConfig.like && this.likeConfig.dislike
      ? `<div class="app-consumer-insight-tooltip">
              <div class="app-consumer-insight-tooltip-content">
                <!--Likes-->
                <div class="app-consumer-insight-tooltip-content-values">
                  <span><i class="likes-icon"></i>${this.translate.instant('report.likes').toUpperCase()}:</span>
                  <span class="likes-value">${likes}</span>
                </div>

                <div class="app-consumer-insight-tooltip-content-divider"></div>
                <!--Dislikes-->
                <div class="app-consumer-insight-tooltip-content-values">
                  <span><i class="dislikes-icon"></i>${this.translate.instant('report.dislikes').toUpperCase()}:</span>
                  <span class="dislikes-value">${dislikes}</span>
                </div>
              </div>
              <div class="app-consumer-insight-tooltip-arrow"></div>
            </div>`
      : this.likeConfig.like
      ? `<div class="app-consumer-insight-tooltip">
              <div class="app-consumer-insight-tooltip-content">
                <!--Likes-->
                <div class="app-consumer-insight-tooltip-content-values">
                  <span><i class="likes-icon"></i>${this.translate.instant('report.likes').toUpperCase()}:</span>
                  <span class="likes-value">${likes}</span>
                </div>
              </div>
              <div class="app-consumer-insight-tooltip-arrow"></div>
            </div>`
      : `<div class="app-consumer-insight-tooltip">
              <div class="app-consumer-insight-tooltip-content">
                <!--Dislikes-->
                <div class="app-consumer-insight-tooltip-content-values">
                  <span><i class="dislikes-icon"></i>${this.translate.instant('report.dislikes').toUpperCase()}:</span>
                  <span class="dislikes-value">${dislikes}</span>
                </div>
              </div>
              <div class="app-consumer-insight-tooltip-arrow"></div>
            </div>`;
  }
}
