import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { cloneDeep, differenceBy, findLast, omit } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { Test } from 'src/app/shared/models/test.model';
import { DESKTOP_VERSION, MIDDLE_VERSION, MOBILE_MINI_VERSION, MOBILE_VERSION } from '../../../../../../assets/consts/consts';
import { CustomQuestions } from '../../../../../shared/models/bic.test/bic.custom.questions.model';
import { BicContainerComponent } from '../../components/bic-container/bic-container.component';

const DESKTOP_ARROW_SHIFT = 42;
const MOBILE_ARROW_SHIFT = 85;
const MIDDLE_ARROW_SHIFT = 50;
const CUSTOM_ARROW_SHIFT = 55;

@Component({
  selector: 'app-section-six-bt',
  templateUrl: './section-four.component.html',
  styleUrls: [
    './section-four.component.scss',
    '../../components/bic-container/bic-container.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionFourComponent
  extends BicContainerComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public test: Test = null;
  @ViewChild('section1') public section1: ElementRef;
  @ViewChild('section2') public section2: ElementRef;
  @ViewChild('section3') public section3: ElementRef;
  @ViewChild('section4') public section4: ElementRef;
  @ViewChild('section5') public section5: ElementRef;
  public selectedSection: ElementRef;
  public isPromptOpen = true;
  public relevance = new FormControl();
  public activeElement = '';
  public respondentRequirements: any;
  public isTabletVersion = false;
  public marketArrowShift = 41;
  public marketArrowShiftMiddle = 41;
  public marketArrowShiftCustom = 41;
  public marketArrowShiftBetween = 41;

  @HostListener('window:resize')
  private resize(): void {
    this._updateIsTablet();
  }

  public ngOnInit(): void {
    this._updateIsTablet();
    this.currentRoute = this.route.snapshot.routeConfig.path;
    this.createTestService.nextRoute
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((route) => {
        if (route && route !== this.currentRoute && this.test) {
          this.goTo(route);
        }
      });
    this.getTest();
    this.createTestService.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        const formValue = this.form.getRawValue();
        this.test = Object.assign(this.test, formValue);
        this.calcTimeService.calcTestBICTime(this.test);
      });
    this.appStateService.respondentOptions$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        this.respondentRequirements = value;
      });
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
          ],
          (item) => window.scrollY >= item.nativeElement.offsetTop - 250
        ) || this.section1;
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
          this.changeDetectionRef?.detectChanges();
        }
      }, 500);
      this.changeDetectionRef?.detectChanges();
    });
    this.changeDetectionRef.detectChanges();
  }

  public ngOnDestroy(): void {
    if (this.compareTest()) {
      this.bicTestService
        .updateTest(omit(this.test, ['respondentRequirements', 'concepts']))
        .subscribe((res) => {
          this.createTestService.currentTest$.next(res);
        });
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public get scrollY(): number {
    if (this.isPromptOpen) {
      return window.scrollY > 1 ? 15 : window.scrollY;
    } else {
      return window.scrollY > 32 ? 30 : window.scrollY;
    }
  }

  public isScrollOnStep(blockFirst: ElementRef): boolean {
    return (
      this.selectedSection?.nativeElement.offsetTop ===
      blockFirst?.nativeElement.offsetTop
    );
  }

  public toggleIsPromptOpen(event: boolean): void {
    this.isPromptOpen = event;
  }

  public get form(): FormGroup {
    return this.createTestService.form;
  }

  public get isDisabledImagesLikes(): boolean {
    return !this.test?.concepts.filter(
      (concept) => concept.moodboard?.items.length
    ).length;
  }

  public navigateToSection(block: string): void {
    if (block === '#section1') {
      document
        .querySelector('body')
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const element = document.querySelector(block);
      const y = element.getBoundingClientRect().top + window.pageYOffset - 50;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    this.activeElement = block;
  }

  public getTest(): void {
    this.createTestService.test
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((test) => {
        if (test) {
          this.test = test;
          this.initTest = cloneDeep(test);
          this.createTestService.form.patchValue(test);
          this.checkFirstEnter();
        }
      });
  }

  public goTo(route: string): void {
    const formValue = this.form.getRawValue();
    this.test = Object.assign(this.test, formValue);
    if (this.compareTest()) {
      this.bicTestService
        .updateTest(omit(this.test, ['respondentRequirements', 'concepts']))
        .subscribe((res) => {
          this.createTestService.currentTest$.next(res);
          this.router.navigate([
            'personal-area/create-test/bic',
            this.createTestService.testId,
            route,
          ]);
        });
    } else {
      this.router.navigate([
        'personal-area/create-test/bic',
        this.createTestService.testId,
        route,
      ]);
    }
  }

  public updateCustomQuestions(question: CustomQuestions): void {
    this.test.customQuestions.push(question);
    this.saveQuestions();
  }

  public deleteCustomQuestion(i: number): void {
    this.test.customQuestions.splice(i, 1);
    this.calcTimeService.calcTestBICTime(this.test);
  }

  private saveQuestions(): void {
    const formValue = this.form.getRawValue();
    this.test = Object.assign(this.test, formValue);
    this.bicTestService
      .updateTest(omit(this.test, ['respondentRequirements', 'concepts']))
      .subscribe((res) => {
        this.createTestService.currentTest$.next(res);
        this.calcTimeService.calcTestBICTime(this.test);
      });
  }

  private compareTest(): boolean {
    const res =
      !this.test.isEnterAdditionalQuestionStep ===
      this.initTest.isEnterAdditionalQuestionStep ||
      !this.test.purchaseFrequencyEnabled ===
      this.initTest.purchaseFrequencyEnabled ||
      !this.test.wordsLikesEnabled === this.initTest.wordsLikesEnabled ||
      !this.test.imageLikesEnabled === this.initTest.imageLikesEnabled ||
      !this.test.feedbackLike === this.initTest.feedbackLike ||
      !this.test.feedbackThink === this.initTest.feedbackThink ||
      !this.test.testConceptRelevance === this.initTest.testConceptRelevance ||
      differenceBy(
        this.test.customQuestions,
        this.initTest.customQuestions,
        'value'
      ).length ||
      differenceBy(
        this.initTest.customQuestions,
        this.test.customQuestions,
        'value'
      ).length;
    return res;
  }

  private checkFirstEnter(): void {
    if (!this.test.isEnterAdditionalQuestionStep) {
      this.test.isEnterAdditionalQuestionStep = true;
    }
  }

  private _updateIsTablet(): void {
    this.isTabletVersion = window.innerWidth <= DESKTOP_VERSION;
    this.marketArrowShiftMiddle =
      window.innerWidth < MOBILE_VERSION
        ? MIDDLE_ARROW_SHIFT
        : DESKTOP_ARROW_SHIFT;
    this.marketArrowShiftCustom =
      window.innerWidth < MOBILE_VERSION
        ? CUSTOM_ARROW_SHIFT
        : DESKTOP_ARROW_SHIFT;
    this.marketArrowShift =
      window.innerWidth < MIDDLE_VERSION
        ? MOBILE_ARROW_SHIFT
        : DESKTOP_ARROW_SHIFT;
    this.marketArrowShiftBetween =
      window.innerWidth < MOBILE_MINI_VERSION
        ? MOBILE_ARROW_SHIFT
        : DESKTOP_ARROW_SHIFT;
    this.changeDetectionRef.detectChanges();
  }
}
