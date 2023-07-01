import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cloneDeep, findLast, isEmpty, merge, omit } from 'lodash';
import { Observable, of } from 'rxjs';
import { debounceTime, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ListItem, MoodBoard, Test, TestConcept } from 'src/app/shared/models/test.model';
import { checkExist } from 'src/app/shared/validators/check-exist.validator';
import {
  MAX_BENEFITS_AND_REASONS,
  MAX_CONCEPT_NAME_LENGTH,
  MIN_CONCEPT_NAME_LENGTH,
  MIN_CONSUMER_INSIGHT_LENGTH,
  NO_SPACE_PATTERN,
} from 'src/assets/consts/consts';
import { BicContainerComponent } from '../../components/bic-container/bic-container.component';
import { HighlightedTag } from '../../models/highlitedTags.model';
import { wordCountValidator } from '../../../../../shared/validators/word.count.validator';
import { MAX_CONSUMER_INSIGHT_WORDS, MIN_CONSUMER_INSIGHT_WORDS } from '../../../../../../assets/consts/test-creation.const';

@Component({
  selector: 'app-section-one',
  templateUrl: './section-one.component.html',
  styleUrls: ['./section-one.component.scss', '../../components/bic-container/bic-container.component.scss'],
})
export class SectionOneComponent extends BicContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('section1') public section1: ElementRef;
  @ViewChild('section2') public section2: ElementRef;
  @ViewChild('section3') public section3: ElementRef;
  @ViewChild('section4') public section4: ElementRef;
  @ViewChild('section5') public section5: ElementRef;

  public maxListLength: number = MAX_BENEFITS_AND_REASONS;
  public moodBoard: MoodBoard = null;
  public highlightTexts: HighlightedTag[] = [];
  public conceptForm: FormGroup;
  public tooltipText = {
    consumerInsight: 'test-concept.consumer-insight-help-body',
    benefits: 'test-concept.benefit-help-body',
    RTB: 'test-concept.reason-to-believe-help-body',
  };

  private _selectedSection: ElementRef;
  private _isHasSubscriptions = false;
  private _isDisabledAddConcept = false;
  private _newConcept: TestConcept = null;
  private _conceptsForMarks: string[] = [];
  private _conceptsName: string[] = [];

  public ngOnInit(): void {
    this._getRouterChanges();
    this._getSessionStorageSubscription();
    this._getTest();
    this._getConceptNamesWithoutCurrent();
  }

  public ngAfterViewInit(): void {
    this._selectedSection = this.section1;
    this.unlistener = this.renderer.listen(window, 'scroll', $event => {
      this._selectedSection =
        findLast(
          [this.section1, this.section2, this.section3, this.section4, this.section5],
          item => window.scrollY >= item?.nativeElement.offsetTop - 119
        ) || this.section1;
    });
    this.changeDetectionRef.detectChanges();
  }

  public ngOnDestroy(): void {
    if (this._compareTest()) {
      this._saveTestBeforeNavigate(undefined, true);
    } else {
      this._setInSessionStorage();
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
  }

  public get scrollY(): number {
    return window.scrollY > 50 ? 32 : window.scrollY;
  }

  public get isDisabledAddConcept(): boolean {
    return !this.currentConcept?.id || this._isDisabledAddConcept || this.currentTest?.concepts?.length > 9;
  }

  public isScrollOnStep(blockFirst: ElementRef): boolean {
    return this._selectedSection?.nativeElement?.offsetTop === blockFirst?.nativeElement?.offsetTop;
  }

  public onOpenHint(event): void {
    event.preventDefault();
  }

  public controlHasError(control: string): boolean {
    const currentControl = this.conceptForm.controls[control] as FormControl;
    return currentControl.touched && currentControl.invalid;
  }

  public trimValue(controlName: string): void {
    (this.conceptForm.controls[controlName] as FormControl).setValue((this.conceptForm.controls[controlName] as FormControl).value.trim());
  }

  public disabledButton(control: string): boolean {
    const currentControl = this.conceptForm.controls[control] as FormControl;
    if (control === 'conceptName') {
      return (
        currentControl.invalid ||
        currentControl.value === '' ||
        Boolean(this.currentTest.concepts.find(concept => concept.conceptName === currentControl.value)?.id)
      );
    }
    return currentControl.invalid || currentControl.value === (this.currentConcept ? this.currentConcept[control] : '');
  }

  public saveTest(): void {
    // this._updateMoodboardWithConcept();
    this._updateTestOnServer()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(test => {
        this.createTestService.currentTest$.next(test);
        this.currentConcept.consumerInsight = this.conceptForm.value.consumerInsight;
      });
  }

  public saveConcept(): void {
    this.bicTestService
      .createConcept({
        testId: this.currentTest.id,
        conceptName: this.conceptForm.value.conceptName,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (!this.currentConcept) {
          this.currentConcept = res;
        } else {
          this.currentConcept.id = res.id;
          this.currentConcept.conceptName = res.conceptName;
        }
        this.currentTest.concepts.push(this.currentConcept);
        this.createTestService.currentTest$.next(this.currentTest);
        this.calcTimeService.calcTestBICTime(this.currentTest);
        this.changeDetectionRef.detectChanges();
      });
  }

  public updateBenefits(list: ListItem[]): void {
    this.conceptForm.controls.benefits.patchValue(this.removeNullOrEmpty(list));
    this._updateTest();
  }

  public updateReasons(list: ListItem[]): void {
    this.conceptForm.controls.reasons.patchValue(this.removeNullOrEmpty(list));
    this._updateTest();
  }

  public isLimitExceeded(list: ListItem[]): boolean {
    return list?.length === this.maxListLength;
  }

  public updateMoodBoard(moodBoard: MoodBoard): void {
    this.moodBoard.items = moodBoard.items.map((image, index) => {
      image.position = index;
      return image;
    });
    const concept = this.currentTest.concepts?.find(item => item.id === this.currentConcept?.id);
    concept.moodboard = this.moodBoard;
    if (!this.currentTest?.concepts.filter(conc => conc.moodboard?.items.length).length) {
      this.currentTest.imageLikesEnabled = false;
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
  }

  public onAddConcept(): void {
    this._isDisabledAddConcept = true;
    const count = this._getConceptNumber();
    const concept = {
      benefits: [],
      conceptName: `${this.translateService.instant('test-concept.concept')} ${count}`,
      consumerInsight: null,
      reasons: [],
    };
    this.bicTestService
      .createConcept({
        testId: this.currentTest.id,
        conceptName: concept.conceptName,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const newConcept = {
          id: res.id,
          conceptName: res.conceptName,
        };
        this.currentTest.concepts.push(newConcept);
        this.createTestService.currentConcept.next(res);
        this.calcTimeService.calcTestBICTime(this.currentTest);
        this.changeDetectionRef.detectChanges();
        this._setValidators();
        this._isDisabledAddConcept = false;
      });
  }

  private _getRouterChanges(): void {
    this.currentRoute = this.route.snapshot.routeConfig.path;
    this.createTestService.nextRoute.pipe(takeUntil(this.ngUnsubscribe)).subscribe(route => {
      if (route && route !== this.currentRoute && this.currentTest) {
        this._goTo(route);
      }
    });
  }

  private _getSessionStorageSubscription(): void {
    this.sessionStorageService
      .getConcept()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(concepts => {
        this._conceptsForMarks = concepts;
      });
  }

  private _getTest(): void {
    this.createTestService.test.pipe(takeUntil(this.ngUnsubscribe)).subscribe(test => {
      if (test) {
        this.currentTest = test;
        this.initTest = cloneDeep(test);
        if (!this._isHasSubscriptions) {
          this._initForm();
        }
        if (test.concepts.length < 1) {
          this.saveConcept();
        }
        this.createTestService.form.patchValue(test);
        this._checkConsumerInsight();
        this._selectedSection = this._selectedSection ? this._selectedSection : this.section1;
        this.changeDetectionRef.detectChanges();
        if (this._conceptsForMarks.indexOf(this.currentConcept?.id) !== -1) {
          this.conceptForm?.controls.consumerInsight?.markAsTouched();
          this.changeDetectionRef.detectChanges();
        }
      }
    });
  }

  private _initForm(): void {
    this.conceptForm = this.fb.group({
      conceptName: [
        !this.currentTest.concepts.length ? `${this.translateService.instant('test-concept.concept')} 1` : '',
        [
          Validators.required,
          Validators.minLength(MIN_CONCEPT_NAME_LENGTH),
          Validators.maxLength(MAX_CONCEPT_NAME_LENGTH),
          Validators.pattern(NO_SPACE_PATTERN),
          checkExist(this._getConceptNamesWithoutCurrent()),
        ],
      ],
      consumerInsight: ['', [Validators.required, wordCountValidator(MIN_CONSUMER_INSIGHT_WORDS, MAX_CONSUMER_INSIGHT_WORDS)]],
      benefits: [[]],
      reasons: [[]],
    });
    this._formSubscription();
  }

  private _formSubscription(): void {
    this._isHasSubscriptions = true;
    this._getHighlightTags();
    this._getConcept();
  }

  private _getHighlightTags(): void {
    this.conceptForm.controls.consumerInsight.valueChanges.pipe(debounceTime(300)).subscribe(text => {
      if (text?.split('.').length > 1) {
        this.tagsService.getTriggers({ text: text.toLowerCase() }).subscribe(res => {
          this.highlightTexts = res;
          this.changeDetectionRef.detectChanges();
        });
      }
    });
  }

  private _getConcept(): void {
    this.createTestService.currentConcept
      .pipe(
        tap(concept => {
          if (concept?.conceptName) {
            this._newConcept = concept;
          }
        }),
        switchMap(() => {
          if (this.currentConcept?.conceptName && this._compareTest()) {
            this._updateMoodboardWithConcept();
          }
          return of(true);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        if (this._newConcept?.conceptName) {
          this.currentConcept = this._newConcept;
          this._getConceptNamesWithoutCurrent();
          this._setValidators();
          this.conceptForm?.patchValue(this._newConcept);
          this.moodBoard = this._newConcept.moodboard || {};
          this.highlightTexts = [];
          this.changeDetectionRef.detectChanges();
        }
      });
  }

  private _goTo(route: string): void {
    if (this._compareTest()) {
      this._saveTestBeforeNavigate(route, false);
    } else {
      this._setInSessionStorage();
      this.navigateTo(route);
    }
  }

  private _saveTestBeforeNavigate(route: string, isDestroy: boolean): void {
    if (!isEmpty(this.currentConcept?.id)) {
      this._updateMoodboardWithConcept(route);
    } else {
      this.bicTestService
        .createConcept({
          testId: this.currentTest.id,
          conceptName: this.conceptForm.value.conceptName,
        })
        .subscribe(res => {
          this.currentConcept.id = res.id;
          this.currentConcept.conceptName = res.conceptName;
          this.createTestService.currentConcept.next(this.currentConcept);
          this.changeDetectionRef.detectChanges();
          this._updateMoodboardWithConcept(route, isDestroy);
        });
    }
  }

  private _compareTest(): boolean {
    this._updateTest();
    return JSON.stringify(this.currentTest.concepts) !== JSON.stringify(this.initTest.concepts);
  }

  private _updateTest(): void {
    const formValue = this.conceptForm.value;
    this.currentConcept.consumerInsight = formValue.consumerInsight;
    this.currentConcept.benefits = formValue.benefits;
    this.currentConcept.reasons = formValue.reasons;
    if (this.conceptForm.controls.conceptName.valid) {
      this.currentConcept.conceptName = formValue.conceptName;
    }
  }

  private _setInSessionStorage(): void {
    if (this._conceptsForMarks.indexOf(this.currentConcept.id) === -1) {
      this.sessionStorageService.setConcept(this.currentConcept.id);
    }
  }

  private _updateMoodboardWithConcept(route?: string, isDestroy?: boolean): void {
    this._createMoodBoard()
      .pipe(
        mergeMap(() => this._updateTestOnServer()),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(res => {
        const concept = res.concepts?.find(item => item.id === this.currentConcept?.id);
        this.currentConcept.moodboard = concept?.moodboard;
        this.createTestService.currentTest$.next(res);
        this.currentConcept.consumerInsight = this.conceptForm.value.consumerInsight;
        this._setInSessionStorage();
        route && this.navigateTo(route);
        if (isDestroy) {
          this.ngUnsubscribe.next();
          this.ngUnsubscribe.complete();
        }
      });
  }

  private _getConceptNamesWithoutCurrent(): string[] {
    if (this.currentTest) {
      this._conceptsName = [];
      this.currentTest.concepts.forEach(concept => {
        if (concept.conceptName !== this.currentConcept?.conceptName) {
          this._conceptsName.push(concept.conceptName);
        }
      });
    }
    return this._conceptsName;
  }

  private _getAllConceptNames(): string[] {
    const names: string[] = [];
    if (this.currentTest) {
      this.currentTest.concepts.forEach(concept => {
        names.push(concept.conceptName);
      });
    }
    return names;
  }

  private _updateTestOnServer(): Observable<Test> {
    this._updateTest();
    if (this.currentTest.concepts.length) {
      this.currentTest.concepts = this.currentTest.concepts.map(concept => {
        if (concept.id === this.currentConcept.id) {
          concept = merge(concept, this.currentConcept);
        }
        concept = omit(concept, ['moodboard']);
        return concept;
      });
    } else {
      this.currentTest.concepts.push(this.currentConcept);
    }
    return this.bicTestService.updateTest(omit(this.currentTest, ['respondentRequirements']));
  }

  private _getConceptNumber(): number {
    const names = this._getAllConceptNames();
    const amount = [];
    if (names.length) {
      names.forEach(name => {
        const arr = name.split(' ');
        if (!isNaN(+arr[arr.length - 1])) {
          amount.push(+arr[arr.length - 1]);
        }
      });
    }
    if (amount.sort((a, b) => b - a)[0]) {
      return amount.sort((a, b) => b - a)[0] + 1;
    } else {
      return 1;
    }
  }

  private _checkConsumerInsight(): void {
    if (this.conceptForm.controls.consumerInsight.value) {
      this.conceptForm.controls.consumerInsight.markAsTouched();
      this.conceptForm.controls.consumerInsight.markAsDirty();
    }
  }

  private _createMoodBoard(): Observable<any> {
    if (this.moodBoard && this.moodBoard.items) {
      this.moodBoard.testConceptId = this.currentConcept.id;
      if (this.currentConcept.moodboard?.id) {
        this.moodBoard.id = this.currentConcept.moodboard?.id;
        return this.bicTestService.updateMoodBoard(this.moodBoard);
      } else {
        return this.bicTestService.saveMoodBoard(this.moodBoard, this.createTestService.testId);
      }
    } else {
      return of(true);
    }
  }

  private _setValidators(): void {
    this.conceptForm.controls.conceptName.setValidators([
      Validators.required,
      Validators.minLength(MIN_CONCEPT_NAME_LENGTH),
      Validators.maxLength(MAX_CONCEPT_NAME_LENGTH),
      Validators.pattern(NO_SPACE_PATTERN),
      checkExist(this._getConceptNamesWithoutCurrent()),
    ]);
  }
}
