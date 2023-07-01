import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { asyncScheduler } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { penetrationTitle } from 'src/app/shared/helpers/penetration-title';
import { BTBrand, BTTest } from 'src/app/shared/models/bt-test.model';
import { CustomTranslateService } from 'src/app/shared/services/custom-translate.service';
import { mockPeriodBtTestKPI } from '../../../../../shared/mock/products.mock';

@UntilDestroy()
@Component({
  selector: 'app-preview-step',
  templateUrl: './preview-step.component.html',
  styleUrls: ['../../../bt-create/preview/bt-preview-input-brand/bt-preview-input-brand.component.scss',
    '../../../bic-create/preview/preview-feedback/preview-feedback.component.scss',
    '../../../bic-create/components/preview-slider/preview-slider.component.scss'],
})
export class PreviewStepComponent implements AfterViewInit {
  @Input() brands: BTBrand[];
  @Input() step: number;
  @Input() category: string;
  @Input() test: BTTest;
  public randomBrands: BTBrand[] = [];
  public options: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  public periodKpi = mockPeriodBtTestKPI;
  public penetrationItem = 1;
  public penetrationTitleFn = penetrationTitle;
  public penetrationTitle: string;
  public translatedSelectedSubcategories: string;

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _customTranslateService: CustomTranslateService,
    private _ts: TranslateService
  ) { }

  public ngAfterViewInit(): void {
    this._customTranslateService.translationsLoaded$.pipe(
      filter(res => !!res),
      tap(() => {
        asyncScheduler.schedule(() => {
          this.translatedSelectedSubcategories = this._customTranslateService.isTranslatedSelectedSubcategories();
          const penetrationInMonthes = this.test?.penetrationInMonthes;
          const matchingItem = this.periodKpi.find(item => item.count === penetrationInMonthes);
          if (matchingItem) {
            this.penetrationItem = matchingItem.count;
            this.penetrationTitle = this.penetrationTitleFn(this.penetrationItem, this._ts);
          }
          this._cdRef.markForCheck();
        });
      }),
      untilDestroyed(this)
    ).subscribe();


  }

}
