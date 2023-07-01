import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ConsumerInsightModel } from '../../../../../shared/models/bic.test.report/consumer.insight.model';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { delay, filter, tap } from 'rxjs/operators';
import { ListItem } from '../../../../../shared/models/test.model';

@Component({
  selector: 'app-consumer-insight-textarea',
  templateUrl: './consumer-insight-textarea.component.html',
  styleUrls: ['../consumer-insight.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsumerInsightTextareaComponent implements OnInit, OnDestroy {
  @Input() public dataSet$: BehaviorSubject<ConsumerInsightModel[]> = null;
  @Input() public likeConfig = null;
  @ViewChildren('textArea') private textArea: any;
  private subscriptions: Subscription = new Subscription();

  constructor(public sanitizer: DomSanitizer, private translate: TranslateService) {
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.dataSet$
        .asObservable()
        .pipe(
          filter(val => !!val),
          delay(1000),
          tap((consumerInsightData: ConsumerInsightModel[]) => {
            this.textArea._results.forEach((textArea: ElementRef) => {
              const { accumulatedLikes } = consumerInsightData.find(el => el.concept.id === textArea.nativeElement.attr);
              const { likedWords, dislikedWords } = accumulatedLikes;
              const toHighlight: string[] = Object.keys({ ...likedWords, ...dislikedWords });
              toHighlight.forEach(el => {
                const containers = textArea.nativeElement.querySelectorAll(`span[data-attr='appDataAttr${el}']`);
                const likes: number = likedWords[el] || 0;
                const dislikes: number = dislikedWords[el] || 0;
                containers.forEach(container => {
                  container.innerHTML = container.innerHTML + this.tooltip(likes, dislikes);
                });
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

  public getHtml(model: ConsumerInsightModel, html: string = ''): string {
    const { likedWords, dislikedWords } = model.accumulatedLikes;
    const toHighlight: string[] = Object.keys({ ...likedWords, ...dislikedWords });
    //let html = ` ${model.concept?.consumerInsight || ''} `;
    /*Add paragraphs*/
    html = html.replace(new RegExp('\n', 'gi'), '<br>');

    toHighlight.sort((a, b) => {
      if (a < b) {
        return 1;
      }
      if (a > b) {
        return -1;
      }
      return 0;
    });

    toHighlight.forEach((word: string) => {
      const likes: number = likedWords[word] || 0;
      const dislikes: number = dislikedWords[word] || 0;
      const className: string = likes >= dislikes ? 'appConsumerInsightContainerValueLike' : 'appConsumerInsightContainerValueDislike';
      const pattern = `\\b(${word})\\b`;
      const regExp = new RegExp(pattern, 'gi');
      const replacer = (match, p1, offset, string) => {
        /*prevent duplicates*/
        if (string.slice(offset, offset + match.length + 10).includes('</span>')) {
          return match;
        }
        return `<span class="${className}" data-attr="appDataAttr${word}"> ${match} </span>`;
      };
      html = html.replace(regExp, replacer);
    });
    return html;
  }

  private tooltip(likes: number, dislikes: number): string {
    return this.likeConfig.like && this.likeConfig.dislike ? `<div class="appConsumerInsightTooltip">
              <div class="appConsumerInsightTooltipContent">

                <div class="appConsumerInsightTooltipContentValues">
                  <span><i class="appConsumerInsightTooltipLikesIcon"></i>${this.translate.instant('report.likes').toUpperCase()}:</span>
                  <span class="appConsumerInsightTooltipLikesValue">${likes}</span>
                </div>

                <div class="appConsumerInsightTooltipContentDivider"></div>

                <div class="appConsumerInsightTooltipContentValues">
                  <span><i class="appConsumerInsightTooltipDislikesIcon"></i>${this.translate
      .instant('report.dislikes')
      .toUpperCase()}:</span>
                  <span class="appConsumerInsightTooltipDislikesValue">${dislikes}</span>
                </div>
              </div>
              <div class="appConsumerInsightTooltipArrow"></div>
            </div>` : this.likeConfig.like ? `<div class="appConsumerInsightTooltip">
              <div class="appConsumerInsightTooltipContent">
                <div class="appConsumerInsightTooltipContentValues">
                  <span><i class="appConsumerInsightTooltipLikesIcon"></i>${this.translate.instant('report.likes').toUpperCase()}:</span>
                  <span class="appConsumerInsightTooltipLikesValue">${likes}</span>
                </div>
              </div>
              <div class="appConsumerInsightTooltipArrow"></div>
            </div>` : `<div class="appConsumerInsightTooltip">
              <div class="appConsumerInsightTooltipContent">
                <div class="appConsumerInsightTooltipContentValues">
                  <span><i class="appConsumerInsightTooltipDislikesIcon"></i>${this.translate
      .instant('report.dislikes')
      .toUpperCase()}:</span>
                  <span class="appConsumerInsightTooltipDislikesValue">${dislikes}</span>
                </div>
              </div>
              <div class="appConsumerInsightTooltipArrow"></div>
            </div>`;
  }

  public getBenefits(benefits: ListItem[]): string {
    return benefits.map(({ value }) => value).join('. ');
  }

  public getReasons(reasons: ListItem[]): string {
    return reasons.map(({ value }) => value).join('\n');
  }
}
