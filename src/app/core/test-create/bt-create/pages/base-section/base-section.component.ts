import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep, omit } from 'lodash';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { TestType } from 'src/app/shared/enums/product.id.type';
import { SCROLL_DEBOUNCE } from '../../../../../../assets/consts/consts';
import { TWO_SESSIONS } from '../../../../../../assets/consts/errors.const';
import { BTTest } from '../../../../../shared/models/bt-test.model';
import { RespondentRequirements } from '../../../../../shared/models/test.model';
import { AppStateService } from '../../../../../shared/services/app-state/app-state.service';
import { SessionStorageService } from '../../../../../shared/services/app-state/session-storage.service';
import { BicCategoryService } from '../../../../../shared/services/bic-test/bic-category.service';
import { BtTestService } from '../../../../../shared/services/bt-test/bt-test.service';
import { DialogFactoryService } from '../../../../../shared/services/dialog/dialog-factory.service';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { RespondentsService } from '../../../bic-create/services/respondents.service';
import { BtStateService } from '../../services/bt-state.service';

@Component({
  selector: 'app-base-section',
  templateUrl: './base-section.component.html',
  styleUrls: ['./base-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseSectionComponent implements OnInit, OnDestroy {
  public test: BTTest = null;
  public initTest: BTTest = null;
  public respondentRequirements: RespondentRequirements = null;
  public currentSection = '';
  public marketArrowShift = 41;
  public activeElement = '';
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();
  public unlistener: () => void = () => { };

  constructor(
    public btStateService: BtStateService,
    public translateService: TranslateService,
    public toastService: ToastService,
    public sessionStorageService: SessionStorageService,
    public dialogService: DialogService,
    public dialogFactoryService: DialogFactoryService,
    public appStateService: AppStateService,
    public btTestService: BtTestService,
    public cdr: ChangeDetectorRef,
    public renderer: Renderer2,
    public bicRespondentsService: RespondentsService,
    public categoryService: BicCategoryService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this._getRouterSubscription();
    this._getTest();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.unlistener();
  }

  public get TestType(): typeof TestType {
    return TestType;
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public get checkIfHaveChanges(): boolean {
    return false;
  }

  public setInitActions(): void { }

  public saveTest(): void {
    this.btTestService.updateTest(this.test).subscribe(res => {
      this.btStateService.currentTest$.next(res);
    });
  }

  public resetActiveElement(): void {
    setTimeout(() => {
      if (
        Math.round(window.innerHeight + window.pageYOffset + 1) <
        Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight,
          document.body.clientHeight,
          document.documentElement.clientHeight
        )
      ) {
        this.activeElement = '';
        this.cdr.detectChanges();
      }
    }, SCROLL_DEBOUNCE);
    this.cdr.detectChanges();
  }

  private _getTest(): void {
    this.btStateService.currentTest$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(test => !!test)
      )
      .subscribe(test => {
        this.initTest = cloneDeep(test);
        this.test = test;

        if (this.test.startDate === '0001-01-01T00:00:00') {
          this.test.startDate = null;
        }
        this.setInitActions();
        this.cdr.detectChanges();
      });
  }

  private _getRouterSubscription(): void {
    this.btStateService.nextRoute$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(route => {
      if (route && route !== this.currentSection && this.test) {
        this._goTo(route);
      }
    });
  }

  private _goTo(route: string): void {
    if (this.checkIfHaveChanges) {
      this._saveTest(route);
    } else {
      this._navigateTo(route);
    }
  }

  private _navigateTo(route: string): void {
    this.router.navigate(['personal-area/create-test/bt', this.btStateService.testId, route]);
  }

  private _saveTest(route: string): void {
    const testForUpdate = this.test;
    this.btTestService.updateTest(testForUpdate).subscribe(
      res => {
        this.btStateService.currentTest$.next(res);
        this._navigateTo(route);
      },
      err => {
        if (err.status === TWO_SESSIONS) {
          this.toastService.showMessage(
            'warn',
            this.translateService.instant('t-toast.Failed'),
            this.translateService.instant('BT-brands.Warning! There is a newer version of the test. Your changes will not be saved.')
          );
          this.test.brands = err.error.brands;
          this.btTestService.updateTest(omit(this.test, 'respondentRequirements')).subscribe(res => {
            this.btStateService.currentTest$.next(res);
            this._navigateTo(route);
          });
        }
      }
    );
  }
}
