import {
  AfterViewInit,

  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { TestType } from 'src/app/shared/enums/product.id.type';
import { TestService } from 'src/app/shared/services/test/test.service';
import { SwiperOptions } from 'swiper';
import { SUBHEADER_SWIPER_CONFIG } from '../../../../../../assets/consts/swiper.consts';
import {
  BT_NAV_ITEMS
} from '../../../../../../assets/consts/test-creation.const';
import { BTTest } from '../../../../../shared/models/bt-test.model';
import { SubheaderElement } from '../../../../../shared/models/test-creation.model';
import { RespondentRequirements } from '../../../../../shared/models/test.model';
import { DialogFactoryService } from '../../../../../shared/services/dialog/dialog-factory.service';
import { TestProgressService } from '../../../../../shared/services/test-progress/test-progress.service';
import { BtPreviewComponent } from '../../preview/bt-preview/bt-preview.component';
import { BtStateService } from '../../services/bt-state.service';
import { CustomTranslateService } from './../../../../../shared/services/custom-translate.service';


@Component({
  selector: 'app-subheader-bt',
  templateUrl: './subheader-bt.component.html',
  styleUrls: [
    './subheader-bt.component.scss',
    '../../../bic-create/components/subheader-element/subheader-element.component.scss',
  ],
  providers: [DialogService],
})
export class SubheaderBtComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public test: BTTest = null;
  @Input() public respondentRequirements: RespondentRequirements = null;
  public navItems: SubheaderElement[] = BT_NAV_ITEMS;
  public config: SwiperOptions = SUBHEADER_SWIPER_CONFIG;
  public category: string;
  public currentRoute = '';
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private btStateService: BtStateService,
    private route: ActivatedRoute,
    private router: Router,
    private testProgressService: TestProgressService,
    private testService: TestService,
    private dialogService: DialogService,
    private dialogFactoryService: DialogFactoryService,
    private _customTranslateService: CustomTranslateService
  ) { }

  public ngOnInit(): void {
    this._getCurrentRoute();
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this._getCurrentRoute();
    });
  }

  public ngAfterViewInit(): void { }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public get TestType(): typeof TestType {
    return TestType;
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public getWidthForProgress(title: string): number {
    return this.testProgressService.getWidthForProgressBT(
      title,
      this.test as BTTest,
      this.respondentRequirements
    ).width;
  }

  public goToPreview(): void {

    if (!this.dialogService.dialogComponentRefMap.size) {
      const previewLang = localStorage.getItem('previewLanguage');
      this._updateTranslates(previewLang && previewLang.toUpperCase());

      const ref = this.dialogService.open(
        BtPreviewComponent,
        {
          showHeader: false,
          height: '100%',
          data: {
            test: this.test,
            category: this.category,
          },
        }
      );
      ref.onClose.subscribe();
      this.dialogFactoryService.openDynamicDialogRefs.push(ref);
    }
  }

  public onNavigate(route: string): void {
    this.btStateService.nextRoute$.next(route);
  }

  private _updateTranslates(lang: string): void {

    this.testService.getRespondentOptions(this.test.sv, lang).pipe(tap((res) => {
      this._customTranslateService.translatedRespondentOptions$.next(res);
    }),
      switchMap(() => this._customTranslateService.updateInvolvementCategoryTranslate(lang))
    ).subscribe();
  }

  private _getCurrentRoute(): void {
    this.currentRoute = this.route.snapshot.firstChild.routeConfig.path;
  }

  private getCategory(): void {
    //   if (this.test?.respondentRequirements?.involvementCategoryId) {
    //     this.btTestService.getInvolvement(this.test.respondentRequirements.involvementCategoryId)
    //       .pipe(takeUntil(this.ngUnsubscribe))
    //       .subscribe((categories) => {
    //         const category = categories
    //           .filter((cat) => cat.id === this.test.respondentRequirements?.involvementId)[0];
    //         this.category = category ? category.name.toLowerCase().trim() : `<SELECTED PRODUCT CATEGORY>`;
    //       });
    //   } else {
    //     this.category = `<SELECTED PRODUCT CATEGORY>`;
    //   }
  }
}
