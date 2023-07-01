import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { BicLocalFiltersComponent } from '../bic-local-filters/bic-local-filters.component';
import { BehaviorSubject } from 'rxjs';
import { WORDS_LIKES_LOCAL_FILTER } from '../../../../../../assets/consts/bic.report.local-filters.consts';
import { cloneDeep } from 'lodash';
import { LocalFiltersUtils } from '../../../../../shared/utils/test.report.local-filters.utils';
import { ConsumerInsightsTapType } from 'src/app/shared/enums/consumer.insights.tap.type';
import { ConsumerInsightModel } from '../../../../../shared/models/bic.test.report/consumer.insight.model';

@Component({
  selector: 'app-words-likes-dislikes',
  templateUrl: './words-likes-dislikes.component.html',
  styleUrls: ['../concept-definitions/concept-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordsLikesDislikesComponent extends BicLocalFiltersComponent<ConsumerInsightModel> implements OnInit {
  public dataSet$: BehaviorSubject<ConsumerInsightModel[]> = new BehaviorSubject<ConsumerInsightModel[]>(null);
  public likesConfig: { like: boolean; dislike: boolean } = {
    like: true,
    dislike: true,
  };
  public ConsumerInsightsTapType = ConsumerInsightsTapType;

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    this.initFilterModel(WORDS_LIKES_LOCAL_FILTER);
  }

  public setInitialValues(): void {
    super.setInitialValues();
    this._setInitialLikes();
  }

  public applyFilters(): void {
    const { concepts, likes } = this.filterForm.getRawValue();
    this.likesConfig = likes;
    if (this.dataSet) {
      this.dataSet$.next(
        cloneDeep(this.dataSet)
          .filter(item => item.concept.id === concepts)
          .map(concept => {
            return {
              concept: { ...concept.concept },
              accumulatedLikes: {
                ...concept.accumulatedLikes,
                likedWords: this.likesConfig.like ? { ...concept.accumulatedLikes.likedWords } : {},
                dislikedWords: this.likesConfig.dislike ? { ...concept.accumulatedLikes.dislikedWords } : {},
              },
            };
          })
      );
    }
    this.cdr.markForCheck();
  }

  private _setInitialLikes(): void {
    const likeItem = this.filterModel.find(item => item.formControlName === 'likes');
    this.filterForm.controls.likes?.setValue(LocalFiltersUtils.getAllItemsSelected(likeItem.options));
  }
}
