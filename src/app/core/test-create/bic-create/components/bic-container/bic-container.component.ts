import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { omit, pickBy } from 'lodash';
import { DialogService } from 'primeng/dynamicdialog';
import { identity, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { TestType } from 'src/app/shared/enums/product.id.type';
import { CustomTranslateService } from 'src/app/shared/services/custom-translate.service';
import { InfoDialogComponent } from '../../../../../shared/dialogs/info-dialog/info-dialog.component';
import { ListItem, Test, TestConcept } from '../../../../../shared/models/test.model';
import { AppStateService } from '../../../../../shared/services/app-state/app-state.service';
import { SessionStorageService } from '../../../../../shared/services/app-state/session-storage.service';
import { BicCategoryService } from '../../../../../shared/services/bic-test/bic-category.service';
import { BicTestService } from '../../../../../shared/services/bic-test/bic-test.service';
import { BtTestCreateService } from '../../../../../shared/services/bt-test/bt-test-create.service';
import { CalcTimeService } from '../../../../../shared/services/calc-time/calc-time.service';
import { DialogFactoryService } from '../../../../../shared/services/dialog/dialog-factory.service';
import { TagsService } from '../../../../../shared/services/tags/tags.service';
import { TestService } from '../../../../../shared/services/test/test.service';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { BIC_NAVIGATION_ITEMS } from '../../consts/bic-create-consts';
import { BICSections } from '../../enums/bic-create.enums';
import { PreviewComponent } from '../../preview/preview/preview.component';
import { BicCreateService } from '../../services/bic-create.service';
import { RespondentRequirements } from './../../../../../shared/models/test.model';
import { MAX_BIC_TIME } from '../../../../../../assets/consts/test-creation.const';
import { RespondentsService } from '../../services/respondents.service';

@Component({
  selector: 'app-bic-container',
  templateUrl: './bic-container.component.html',
  styleUrls: ['./bic-container.component.scss'],
  providers: [DialogService, BicCreateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BicContainerComponent implements OnInit, OnDestroy {
  public currentTest: Test = null;
  public navItems = [];
  public testConcept = new FormControl();
  public currentConcept: TestConcept;
  public testId = '';
  public currentRoute = '';
  public initTest: Test = null;

  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  public unlistener: () => void = () => {};

  constructor(
    public route: ActivatedRoute,
    public createTestService: BicCreateService,
    public fb: FormBuilder,
    public testService: TestService,
    public dialogService: DialogService,
    public router: Router,
    public appStateService: AppStateService,
    public sessionStorageService: SessionStorageService,
    public dialogFactoryService: DialogFactoryService,
    public tagsService: TagsService,
    public renderer: Renderer2,
    public changeDetectionRef: ChangeDetectorRef,
    public toastService: ToastService,
    public translateService: TranslateService,
    public bicTestService: BicTestService,
    public btTestCreateService: BtTestCreateService,
    public calcTimeService: CalcTimeService,
    public categoryService: BicCategoryService,
    public bicRespondentsService: RespondentsService,
    private _customTranslateService: CustomTranslateService,
    @Inject(DOCUMENT) public document: Document
  ) {}

  public ngOnInit(): void {
    this._doInitActions();
  }

  public ngOnDestroy(): void {
    this.createTestService.nextRoute.next(BICSections.Section1);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    localStorage.removeItem('previewLanguage');
    this.unlistener();
  }

  get translatedRespondentRequirements$(): Observable<RespondentRequirements> {
    return this._customTranslateService.translatedRespondentRequirements$;
  }

  get respondentRequirements$(): Observable<RespondentRequirements> {
    return this.bicRespondentsService.respondentRequirements$;
  }

  get translations(): Record<string, any> {
    return this._customTranslateService.translations;
  }

  public get TestType(): typeof TestType {
    return TestType;
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public isExceedTimeLimit(time: number): boolean {
    if (time > MAX_BIC_TIME && !this.calcTimeService.isShowedPopup) {
      this._openTimeDialog();
    }
    return time > MAX_BIC_TIME;
  }

  public removeNullOrEmpty(list: ListItem[]): ListItem[] {
    return list.map(item => omit(pickBy(item, identity), ['isSaved']));
  }

  public onChangeCurrentConcept(id: string): void {
    const concept = this.currentTest.concepts.find(item => item.id === id);
    this.createTestService.currentConcept.next(concept);
  }

  public onDeleteConcept(id: string): void {
    if (this.currentTest.concepts.length === 1) {
      return;
    }
    this.bicTestService.deleteConcept(id).subscribe(res => {
      this.createTestService.currentTest$.next(res);
      this.calcTimeService.calcTestBICTime(this.currentTest);
    });
  }

  public onChangeRoute(route: string): void {
    this.createTestService.nextRoute.next(route);
  }

  public goToPreview(): void {
    if (!this.dialogService.dialogComponentRefMap.size) {
      const previewLang = localStorage.getItem('previewLanguage') ?? 'en';

      this._updateTranslates(previewLang && previewLang.toUpperCase());
      const ref = this.dialogService.open(PreviewComponent, {
        showHeader: false,
        height: '100%',
        data: {
          concept: this.currentConcept,
          test: this.currentTest,
        },
      });
      ref.onClose.subscribe();
      this.dialogFactoryService.openDynamicDialogRefs.push(ref);
    }
  }

  public navigateTo(route: string): void {
    this.router.navigate(['personal-area/create-test/bic', this.createTestService.testId, route]);
  }

  private _doInitActions(): void {
    this.createTestService.initForm();
    // this.appStateService.getRespondentOptions();
    this.appStateService.getCustomSegmentation();
    this._getCalculateTimeSubscription();
    this._getTestData();
    this._getRouterSubscription();
    this._initTabGroup();
    this._getCurrentTest();
    this._getCurrentConcept();
  }

  private _getCalculateTimeSubscription(): void {
    this.bicRespondentsService.needToCalcTime.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: respondentRequirements => {
        if (this.currentTest) {
          this.calcTimeService.calcTestBICTime({
            ...this.currentTest,
            respondentRequirements,
          });
        }
      },
    });
  }

  private _getTestData(): void {
    this.currentRoute = this.route.snapshot.firstChild.routeConfig.path;
    this.testId = this.route.snapshot.params.id;
    this.createTestService.testId = this.testId;
    this.createTestService.getTest(this.testId);
  }

  private _getRouterSubscription(): void {
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.currentRoute = this.route.snapshot.firstChild.routeConfig.path;
        if (this.testId !== this.route.snapshot.params.id) {
          this.testId = this.route.snapshot.params.id;
          this.createTestService.testId = this.testId;
          this.createTestService.initForm();
          this.createTestService.getTest(this.testId);
          this._initTabGroup();
        }
      }
    });
  }

  private _initTabGroup(): void {
    this.navItems = BIC_NAVIGATION_ITEMS;
    this.changeDetectionRef.detectChanges();
  }

  private _getCurrentTest(): void {
    this.createTestService.test
      .pipe(
        filter(test => test),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(test => {
        this.currentTest = test;
        this.calcTimeService.calcTestBICTime(this.currentTest);
        const concept = test.concepts.find(item => item.id === this.currentConcept?.id) || test.concepts[test.concepts.length - 1];
        if (concept) {
          this.testConcept.patchValue(concept);
          setTimeout(() => {
            this.createTestService.currentConcept.next(concept);
          }, 0);
        }
        this.changeDetectionRef.detectChanges();
      });
  }

  private _getCurrentConcept(): void {
    this.createTestService.currentConcept
      .pipe(
        filter(concept => concept),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(concept => {
        this.currentConcept = concept;
        this.testConcept.patchValue(concept);
        this.changeDetectionRef.detectChanges();
      });
  }

  private _updateTranslates(lang: string): void {

    this.testService.getRespondentOptions(this.currentTest.sv, lang).pipe(tap((res) => {
      this._customTranslateService.translatedRespondentOptions$.next(res);
    }),
      switchMap(() => this._customTranslateService.updateInvolvementCategoryTranslate(lang))
    ).subscribe();
  }

  private _openTimeDialog(): void {
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService.open(InfoDialogComponent, {
        showHeader: false,
        width: '360px',
        data: {
          text: this.translateService.instant('BIC.Your test exceeds allowed limits!'),
          adviceFirst: this.translateService.instant('BIC.To secure qualitative data please remove some questions or delete concept(s).'),
          adviceSecond: this.translateService.instant(
            'BIC.You can also split your test into multiple tests. Please note that you can always copy your test in your library.'
          ),
          btn: 'KPI.cancel',
        },
      });
      ref.onClose.subscribe(() => {
        this.calcTimeService.isShowedPopup = true;
      });
      this.dialogFactoryService.openDynamicDialogRefs.push(ref);
    }
  }
}
