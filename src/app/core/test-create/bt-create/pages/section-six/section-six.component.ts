import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { BaseSectionComponent } from '../base-section/base-section.component';
import { FormControl } from '@angular/forms';
import { TestType } from 'src/app/shared/enums/product.id.type';
import { CustomQuestions } from '../../../../../shared/models/bic.test/bic.custom.questions.model';
import { findLast } from 'lodash';
import { DESKTOP_ARROW_SHIFT, MOBILE_ARROW_SHIFT } from '../../../../../../assets/consts/test-creation.const';
import { DESKTOP_VERSION, MOBILE_MINI_VERSION, MOBILE_VERSION } from '../../../../../../assets/consts/consts';

const MOB_ARROW_SHIFT = 90;

@Component({
  selector: 'app-section-six',
  templateUrl: './section-six.component.html',
  styleUrls: [
    './section-six.component.scss',
    '../../../components/test-create-container/test-create-container.component.scss',
    '../section-two/section-two.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionSixComponent extends BaseSectionComponent implements AfterViewInit {
  @ViewChild('asection1') public section1: ElementRef;
  @ViewChild('asection2') public section2: ElementRef;
  @ViewChild('asection3') public section3: ElementRef;
  public selectedSection: ElementRef;
  public currentSection = 'section-6';
  public isPromptOpen = true;
  public activeElement = '';
  public formControl = new FormControl(true);
  public recomendationFormControl = new FormControl(false);
  public marketArrowShift = DESKTOP_ARROW_SHIFT;
  public marketArrowShiftCustom = 41;
  public isTabletVersion = false;

  @HostListener('window:resize')
  private resize(): void {
    this._updateIsTablet();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.selectedSection = this.section1;
      this.activeElement = '#section1';
      this.unlistener = this.renderer.listen(window, 'scroll', () => {
        this.selectedSection =
          findLast([this.section1, this.section2, this.section3], item => window.scrollY >= item.nativeElement.offsetTop - 123) ||
          this.section1;
        this.resetActiveElement();
      });
      this._updateIsTablet();
      this.cdr.detectChanges();
    }, 100);
  }

  public get TestType(): typeof TestType {
    return TestType;
  }

  public get checkIfHaveChanges(): boolean {
    return this._compareTest();
  }

  public get scrollY(): number {
    if (this.isPromptOpen) {
      return window.scrollY > 1 ? 15 : window.scrollY;
    } else {
      return window.scrollY > 32 ? 30 : window.scrollY;
    }
  }

  public navigateToSection(block: string): void {
    if (block === '#section1') {
      document.querySelector('body').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const element = document.querySelector(block);
      const y = element.getBoundingClientRect().top + window.pageYOffset - 50;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    this.activeElement = block;
  }

  public isScrollOnStep(blockFirst: ElementRef): boolean {
    return this.selectedSection?.nativeElement.offsetTop === blockFirst?.nativeElement.offsetTop;
  }

  public updateRecognition(): void {
    this.test.isAdvertizing = this.formControl.value;
  }

  public updateRecommendation(): void {
    this.test.isRecommendation = this.recomendationFormControl.value;
  }

  public setInitActions(): void {
    this.formControl.setValue(this.test.isAdvertizing);
    this.recomendationFormControl.setValue(this.test.isRecommendation);
    this._checkFirstEnter();
  }

  public toggleIsPromptOpen(event: boolean): void {
    this.isPromptOpen = event;
  }

  public onSkipStep(): void {
    this.btStateService.nextRoute$.next('section-7');
  }

  public updateCustomQuestions(question: CustomQuestions): void {
    this.test.customQuestions.push(question);
    this._saveQuestions();
  }

  public deleteCustomQuestion(i: number): void {
    this.test.customQuestions.splice(i, 1);
    // this.calcTimeService.calcTestBICTime(this.test);
  }

  private _checkFirstEnter(): void {
    if (!this.test.isEnterAdditionalQuestionStep) {
      this.test.isEnterAdditionalQuestionStep = true;
    }
  }

  private _compareTest(): boolean {
    return (
      this.initTest.isAdvertizing !== this.test.isAdvertizing ||
      !this.initTest.isEnterAdditionalQuestionStep ||
      this.initTest.isRecommendation !== this.test.isRecommendation
    );
  }

  private _saveQuestions(): void {
    this.saveTest();
  }

  private _updateIsTablet(): void {
    this.isTabletVersion = window.innerWidth <= DESKTOP_VERSION;
    this.marketArrowShift = window.innerWidth < MOBILE_VERSION ? MOBILE_ARROW_SHIFT : DESKTOP_ARROW_SHIFT;
    this.marketArrowShiftCustom = window.innerWidth < MOBILE_MINI_VERSION ? MOB_ARROW_SHIFT : DESKTOP_ARROW_SHIFT;
    this.cdr.detectChanges();
  }
}
