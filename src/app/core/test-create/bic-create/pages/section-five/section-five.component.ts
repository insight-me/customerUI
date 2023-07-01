import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RespondentRequirements, TestSteps } from 'src/app/shared/models/test.model';
import { findLast } from 'lodash';
import { filter, takeUntil } from 'rxjs/operators';
import { DESKTOP_VERSION, MOBILE_VERSION } from 'src/assets/consts/consts';
import { BicContainerComponent } from '../../components/bic-container/bic-container.component';
import { RespondentOptions, Segment } from '../../../../../shared/models/test-creation.model';
import { Observable } from 'rxjs';
import { DESKTOP_ARROW_SHIFT, MOBILE_ARROW_SHIFT, NO_VALUE_GUIDE } from '../../../../../../assets/consts/test-creation.const';

@Component({
  selector: 'app-section-six',
  templateUrl: './section-five.component.html',
  styleUrls: [
    './section-five.component.scss',
    '../../components/bic-container/bic-container.component.scss',
  ],
})
export class SectionFiveComponent
  extends BicContainerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('section1') public section1: ElementRef;
  @ViewChild('section2') public section2: ElementRef;
  @ViewChild('section3') public section3: ElementRef;
  @ViewChild('section4') public section4: ElementRef;
  @ViewChild('section5') public section5: ElementRef;
  @ViewChild('section6') public section6: ElementRef;

  public respondentRequirements: RespondentRequirements = null;
  public selectedSection: ElementRef = null;
  public marketArrowShift = DESKTOP_ARROW_SHIFT;

  private _respondentOptions: RespondentOptions = null;
  private _defaultSegment: Segment = null;

  @HostListener('window:resize')
  private resize(): void {
    this._updateIsTablet();
  }

  public ngOnInit(): void {
    this._getRouterChanges();
    this._getRespondentOptions();
    this._getRespondentRequirements();
    this._updateIsTablet();
  }

  public ngAfterViewInit(): void {
    this.selectedSection = this.section1;
    this.unlistener = this.renderer.listen(window, 'scroll', ($event) => {
      this.selectedSection =
        findLast(
          [
            this.section1,
            this.section2,
            this.section3,
            this.section4,
            this.section5,
            this.section6,
          ],
          (item) => window.scrollY >= item.nativeElement.offsetTop - 123
        ) || this.section1;
      this.changeDetectionRef.detectChanges();
    });
    this.changeDetectionRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public get scrollY(): number {
    return window.scrollY > 50 ? 64 : window.scrollY;
  }

  public get respondentOptions(): RespondentOptions {
    return this._respondentOptions;
  }

  public isScrollOnStep(blockFirst: ElementRef): boolean {
    return (
      this.selectedSection?.nativeElement?.offsetTop ===
      blockFirst?.nativeElement?.offsetTop
    );
  }

  public navigateToSection(block: string): void {
    let cells = document.querySelectorAll('div.c-test-create__nav > a.disabled');
    if (block === '#section1') {
      document
        .querySelector('body')
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      if (!((block === '#section3' || block === '#section4' || block === '#section5' || block === '#section6') && cells.length)) {
        const element = document.querySelector(block);
        const y = element.getBoundingClientRect().top + window.pageYOffset - 50;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }

  public goTo(route: string): void {
    if (!this.sessionStorageService.get(TestSteps.Five)) {
      this.sessionStorageService.set(TestSteps.Five);
    }
    if (this.respondentRequirements.countries.length) {
      this.bicRespondentsService.checkCategoryIr();
      this.bicRespondentsService.setPopulation();
    }
    this.bicTestService
      .updateTest({
        ...this.createTestService.currentTest$.getValue(),
        respondentRequirements: this.respondentRequirements,
      })
      .subscribe((res) => {
        this.createTestService.currentTest$.next(res);
        this.navigateTo(route);
      });
  }

  private _getRouterChanges(): void {
    this.currentRoute = this.route.snapshot.routeConfig.path;
    this.createTestService.nextRoute
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((route) => {
        if (
          route &&
          route !== this.currentRoute &&
          this.respondentRequirements
        ) {
          this.goTo(route);
        }
      });
  }

  private _getRespondentOptions(): void {
    this.appStateService.respondentOptions$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter((options) => !!options)
      )
      .subscribe((options) => {
        this._respondentOptions = options;
        this._defaultSegment = this._respondentOptions.segments.find(
          (segment) => segment.isDefault
        );
      });
  }

  private _getRespondentRequirements(): void {
    this.bicRespondentsService.respondentRequirements$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter((options) => !!options)
      )
      .subscribe({
        next: (respondentRequirements) => {
          if (this._isFirstAssignmentAndNeedToMarkForm) {
            this._markAsTouchedForm();
          }
          this.respondentRequirements = respondentRequirements;
        },
      });
  }

  private get _isFirstAssignmentAndNeedToMarkForm(): boolean {
    return !!(
      !this.respondentRequirements &&
      this.sessionStorageService.get(TestSteps.Five)
    );
  }

  private _markAsTouchedForm(): void {
    this.bicRespondentsService.markControlsAsTouched();
    this.categoryService.markAsTouchedCustomSubcategoriesControl();
    this.categoryService.markAsTouchedCategory();
    if (this.categoryService.categoryForm.controls.category.value !== NO_VALUE_GUIDE) {
      this.categoryService.markAsTouchedSubCategory();
    }
  }

  private _updateIsTablet(): void {
    this.marketArrowShift =
      window.innerWidth < MOBILE_VERSION
        ? MOBILE_ARROW_SHIFT
        : DESKTOP_ARROW_SHIFT;
    this.changeDetectionRef.detectChanges();
  }
}
