import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { asyncScheduler, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RespondentsService } from 'src/app/core/test-create/bic-create/services/respondents.service';
import { clearBodyLocks } from 'tua-body-scroll-lock';
import { CategoryScreening } from '../enums/category-screening.type';
import { RespondentRequirements } from '../models/test.model';
import { CustomTranslateService } from '../services/custom-translate.service';
import { PreviewStateService } from '../services/preview-state-service/preview-state.service';

@Component({
  template: '',
})
export abstract class AbstractPreviewComponent implements OnInit, OnDestroy {
  @Input() public test: any = null;
  protected currentRoute: string;

  get translatedRespondentRequirements$(): Observable<RespondentRequirements> {
    return this.customTranslateService.translatedRespondentRequirements$;
  }

  get translations(): Record<string, any> {
    return this.customTranslateService.translations;
  }

  constructor(
    public route: ActivatedRoute,
    public renderer: Renderer2,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public bicRespondentsService: RespondentsService,
    protected cdRef: ChangeDetectorRef,
    protected customTranslateService: CustomTranslateService,
    private _previewStateService: PreviewStateService
  ) { }


  public ngOnInit(): void {
    this._previewStateService.isModalOpened = true;
    this.currentRoute = this.route.snapshot.firstChild.routeConfig.path;
    this.test = this.config.data.test;
    this._loadTranslations();
  }


  public ngOnDestroy(): void {
    this.customTranslateService.translations = null;
    this.customTranslateService.translatedRespondentRequirements$.next(null);
    this._previewStateService.isModalOpened = false;
    clearBodyLocks();
  }

  public isScreening(respondentRequirements: RespondentRequirements): boolean {
    if (!respondentRequirements) {
      return false;
    }

    const { categoryScreening, customCategoryScreens, involvements, customInvolvements } = respondentRequirements;

    if (categoryScreening === CategoryScreening.Customized) {
      return customCategoryScreens.length > 0;
    }

    if (categoryScreening === CategoryScreening.Predesigned) {
      return involvements.length > 0 || customInvolvements.length > 0;
    }

    return false;
  }

  public close(): void {
    this.ref.close();
  }

  protected abstract navigateToElement(): void;

  public _loadTranslations(): void {
    const testLang: string = this.test.respondentRequirements?.countries.length ? this.test.respondentRequirements?.countries[0]?.code : 'en';
    const langFromTest: string = testLang?.toLowerCase() === 'us' ? 'en' : testLang?.toLowerCase();
    const lang = localStorage.getItem('previewLanguage') ?? langFromTest;
    localStorage.setItem('previewLanguage', lang);
    this.customTranslateService.getTranslates(lang)
      .pipe(tap(() => {
        asyncScheduler.schedule(() => {
          this.navigateToElement();
        }, 0);
      })).subscribe();
  }


}
