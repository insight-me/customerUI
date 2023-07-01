import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { findLast } from 'lodash';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DESKTOP_VERSION, MOBILE_VERSION } from '../../../../../../assets/consts/consts';
import { DESKTOP_ARROW_SHIFT, MOBILE_ARROW_SHIFT, NO_VALUE_GUIDE } from '../../../../../../assets/consts/test-creation.const';
import { RespondentOptions, Segment } from '../../../../../shared/models/test-creation.model';
import { TestSteps } from '../../../../../shared/models/test.model';
import { BaseSectionComponent } from '../base-section/base-section.component';
import { TestCreationUtils } from '../../../../../shared/utils/test.creation.utils';

@Component({
  selector: 'app-section-two',
  templateUrl: './section-two.component.html',
  styleUrls: [
    './section-two.component.scss',
    '../../../components/test-create-container/test-create-container.component.scss',
    '../../../bic-create/components/bic-container/bic-container.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTwoComponent extends BaseSectionComponent implements OnInit, AfterViewInit {
  @ViewChild('section1') public section1: ElementRef;
  @ViewChild('section2') public section2: ElementRef;
  @ViewChild('section3') public section3: ElementRef;
  @ViewChild('section4') public section4: ElementRef;
  @ViewChild('section5') public section5: ElementRef;

  public currentSection = 'section-2';
  public selectedSection: ElementRef = null;
  public isTabletVersion = false;
  public marketArrowShift = DESKTOP_ARROW_SHIFT;
  private _respondentOptions: RespondentOptions = null;
  private _defaultSegment: Segment = null;

  @HostListener('window:resize')
  private resize(): void {
    this._updateIsTablet();
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this._getRespondentOptions();
    this._getRespondentRequirements();
    this._updateIsTablet();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.selectedSection = this.section1;
      this.activeElement = '#section1';
      this.unlistener = this.renderer.listen(window, 'scroll', $event => {
        this.selectedSection =
          findLast(
            [this.section1, this.section2, this.section3, this.section4, this.section5],
            item => window.scrollY >= item.nativeElement.offsetTop - 123
          ) || this.section1;
        this.resetActiveElement();
      });
      this.cdr.markForCheck();
    }, 100);
  }

  public get scrollY(): number {
    return window.scrollY > 50 ? 64 : window.scrollY;
  }

  public get populationCount$(): Observable<number> {
    return this.bicRespondentsService.populationCount$;
  }

  public get respondentOptions(): RespondentOptions {
    return this._respondentOptions;
  }

  public isScrollOnStep(blockFirst: ElementRef): boolean {
    return this.selectedSection?.nativeElement?.offsetTop === blockFirst?.nativeElement?.offsetTop;
  }

  public setInitActions(): void {
    const firstEnter = TestCreationUtils.getSessionStorageFirstEnterTestKey(this.test.id);
    if (firstEnter?.respondent) {
      if (firstEnter?.date) {
        sessionStorage.setItem(
          `first-${this.test.id}`,
          JSON.stringify({
            respondent: false,
            date: firstEnter.date,
          })
        );
      } else {
        sessionStorage.removeItem(`first-${this.test.id}`);
      }
    } else {
      this._markAsTouchedForm();
    }
  }

  public navigateToSection(block: string): void {
    const cells = document.querySelectorAll('div.c-test-create__nav > a.disabled');
    if (block === '#section1') {
      document.querySelector('body').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      if (!((block === '#section5' || block === '#section6') && cells.length)) {
        const element = document.querySelector(block);
        const y = element.getBoundingClientRect().top + window.pageYOffset - 50;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    this.activeElement = block;
    this.cdr.detectChanges();
  }

  public get checkIfHaveChanges(): boolean {
    if (!this.sessionStorageService.get(TestSteps.Five)) {
      this.sessionStorageService.set(TestSteps.Five);
    }
    if (this.respondentRequirements.countries.length) {
      this.bicRespondentsService.checkCategoryIr();
      this.bicRespondentsService.setPopulation();
    }
    this.test.respondentRequirements = this.respondentRequirements;
    return true;
  }

  private _getRespondentOptions(): void {
    this.appStateService.respondentOptions$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(options => !!options)
      )
      .subscribe(options => {
        this._respondentOptions = options;
        this._defaultSegment = this._respondentOptions.segments.find(segment => segment.isDefault);
      });
  }

  private _getRespondentRequirements(): void {
    this.bicRespondentsService.respondentRequirements$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(options => !!options)
      )
      .subscribe({
        next: respondentRequirements => {
          this.respondentRequirements = respondentRequirements;
        },
      });
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
    this.isTabletVersion = window.innerWidth <= DESKTOP_VERSION;
    this.marketArrowShift = window.innerWidth < MOBILE_VERSION ? MOBILE_ARROW_SHIFT : DESKTOP_ARROW_SHIFT;
    this.cdr.detectChanges();
  }
}
