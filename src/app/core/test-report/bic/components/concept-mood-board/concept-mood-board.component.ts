import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ConsumerInsightModel } from '../../../../../shared/models/bic.test.report/consumer.insight.model';
import { MoodBoardItem } from '../../../../../shared/models/test.model';
import { AccumulatedLikes } from '../../../../../shared/models/bic.test.report/test.concept.result.model';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { TestReportUtils } from '../../../../../shared/utils/test.report.utils';

@Component({
  selector: 'app-concept-mood-board',
  templateUrl: './concept-mood-board.component.html',
  styleUrls: ['./concept-mood-board.component.scss'],
})
export class ConceptMoodBoardComponent implements OnChanges {
  @Input() public dataSet: ConsumerInsightModel;

  public data: MoodBoardItem[][] = [[], [], []];
  public IconsType = IconsType;

  constructor() {}

  public ngOnChanges(): void {
    this.data = [[], [], []];
    const { likedImages, dislikedImages }: AccumulatedLikes = this.dataSet.accumulatedLikes;
    /*Add likes and dislikes to each image model*/
    if (this.dataSet.concept.moodboard) {
      const items = [
        ...this.dataSet.concept.moodboard?.items?.map((moodBoardItem: MoodBoardItem) => {
          moodBoardItem.likes = likedImages[moodBoardItem.id] || 0;
          moodBoardItem.dislikes = dislikedImages[moodBoardItem.id] || 0;
          return moodBoardItem;
        }),
      ];
      /*divide initial data array to 3 arrays (for 3 columns)*/
      TestReportUtils.divideIntoColumns(items, this.data);
    }
  }
}
