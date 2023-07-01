import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { orderBy } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ALL_CUSTOM_SEGMENTS, ALL_SEGMENTS, NO_ORDER_ID } from '../../../../../../assets/consts/consts';
import { MAX_WIDTH, TOAST_DELAY } from '../../../../../../assets/consts/test-creation.const';
import { IconsType } from '../../../../../shared/enums/icons.type';
import { TestType } from '../../../../../shared/enums/product.id.type';
import { BTTest } from '../../../../../shared/models/bt-test.model';
import { RespondentOptions, Segment } from '../../../../../shared/models/test-creation.model';
import { Countries, Involment, Test } from '../../../../../shared/models/test.model';
import { AppStateService } from '../../../../../shared/services/app-state/app-state.service';
import { BicCategoryService } from '../../../../../shared/services/bic-test/bic-category.service';
import { CalcTimeService } from '../../../../../shared/services/calc-time/calc-time.service';
import { OrderStateService } from '../../../../../shared/services/order/order-state.service';
import { OrderService } from '../../../../../shared/services/order/order.service';
import { PaymentService } from '../../../../../shared/services/payment/payment.service';
import { TestProgressService } from '../../../../../shared/services/test-progress/test-progress.service';
import { TestService } from '../../../../../shared/services/test/test.service';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { TestCreationUtils } from '../../../../../shared/utils/test.creation.utils';

@Component({
  selector: 'app-confirm-and-run-form',
  templateUrl: './confirm-and-run-form.component.html',
  styleUrls: ['./confirm-and-run-form.component.scss'],
})
export class ConfirmAndRunFormComponent implements OnInit, OnDestroy {
  @Input() public test: BTTest | Test;

  public isPay = false;
  public countries: Countries[] = [];
  public paymentVerificationFailed = false;
  public customSegments: Segment[] = [];

  private respondentOptions: RespondentOptions;
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public categoryService: BicCategoryService,
    private appStateService: AppStateService,
    private orderService: OrderService,
    private testService: TestService,
    private changeDetectionRef: ChangeDetectorRef,
    private toastService: ToastService,
    private translateService: TranslateService,
    private testProgressService: TestProgressService,
    public calcTimeService: CalcTimeService,
    private orderSS: OrderStateService,
    private paymentService: PaymentService
  ) { }

  public ngOnInit(): void {
    this._getCountries();
    this._getRespondentOptions();
    this._getCustomSegments();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public get testTypeEnum(): typeof TestType {
    return TestType;
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public get isBic(): boolean {
    return this.test.testType === TestType.BIC;
  }

  public get isBt(): boolean {
    return this.test.testType === TestType.BT;
  }

  public get hasSegmentation(): boolean {
    return !!(
      (!this.test.respondentRequirements?.isSegmentation && !this.test.respondentRequirements?.isCustomSegmentation) ||
      (this.test.respondentRequirements?.isCustomSegmentation && this.customSegments.length) ||
      this.test.respondentRequirements?.isSegmentation
    );
  }

  public getConceptNames(): string {
    const names = [];
    (this.test as Test).concepts.forEach(concept => {
      names.push(concept.conceptName);
    });
    return names.join(', ');
  }

  public getSubcategoriesNames(subcategories): string {
    return (
      orderBy(
        this.test.respondentRequirements.involvements
          .map(inv => {
            return {
              ...inv,
              value: TestCreationUtils.getSubcategoryName(inv, subcategories),
            } as Involment;
          })
          .concat(
            this.test.respondentRequirements.customInvolvements.filter(item =>
              TestCreationUtils.getValuesNotInvalid(this.categoryService.customSubcategoriesControl)
                .map(elem => elem.subcategory)
                .includes(item.value)
            )
          ),
        name => name.value.toLowerCase()
      )
        .map(item => item.value)
        .join(', ') + ` (${this.test.respondentRequirements.categoryIRs[0].ir}%)`
    );
  }

  public getCost(): string {
    if (this.test) {
      return TestCreationUtils.getCost(this.test.priceOfTest);
    }
    return '0';
  }

  public getCostInCurrency(): string {
    if (this.test) {
      return TestCreationUtils.getCostInCurrency(this.test);
    }
    return '0';
  }

  public getMarkets(): string[] {
    if (!this.test.respondentRequirements) {
      return;
    }
    if (!this.test.respondentRequirements?.countries?.length) {
      return ['-'];
    }
    const markets = [];
    this.test.respondentRequirements.countries.forEach(country => {
      const subdivisions = [];
      this.test.respondentRequirements.subdivisions.forEach(subdivision => {
        if (subdivision.countryId === country.id) {
          subdivisions.push(subdivision.value);
        }
      });
      let regions;
      if (this.countries.find(item => item.id === country.id).subdivisions.length === subdivisions.length) {
        regions = this.translateService.instant('respondents.all-selected-regions-1');
      } else {
        regions = subdivisions.join(', ');
      }
      const market = { country: country.value, subdivisions: regions };
      markets.push(market);
    });
    const result = [];
    markets.forEach(market => {
      market.country = [market.country, market.subdivisions].join(': ');
      result.push(market.country);
    });
    return result.sort();
  }

  public getNumberOfRespondents(): number {
    if (!this.test.respondentRequirements) {
      return;
    }
    let sum = 0;
    this.test.respondentRequirements.countries.forEach(country => (sum += country.respondentCount));
    return sum;
  }

  public getGenders(): string {
    if (!this.test.respondentRequirements) {
      return;
    }
    const genders = [];
    this.test.respondentRequirements.genders.forEach(gender => {
      genders.push(this.translateService.instant(gender.value));
    });
    if (!genders.length) {
      return '-';
    }
    return genders.join(', ');
  }

  public getSegments(): string {
    if (!this.test.respondentRequirements) {
      return;
    }
    if (!this.test.respondentRequirements.isSegmentation && !this.test.respondentRequirements.isCustomSegmentation) {
      return '-';
    }
    const segments = [];
    if (this.test.respondentRequirements.isSegmentation) {
      this.test.respondentRequirements.segments.forEach(segment => {
        if (!segment.isDefault) {
          segments.push(`${segment.value} (${segment.ir}%)`);
        }
      });
      if (!segments.length) {
        return '-';
      }
      if (segments.length === this.respondentOptions?.segments?.length - 1) {
        return ALL_SEGMENTS;
      }
    }
    if (this.test.respondentRequirements.isCustomSegmentation) {
      this.test.respondentRequirements.customSegments.forEach(segment => {
        segments.push(`${segment.value} (${segment.ir}%)`);
      });
      if (!segments.length) {
        return '-';
      }
      if (segments.length === this.customSegments.length) {
        return ALL_CUSTOM_SEGMENTS;
      }
    }

    return segments.sort().join(', ');
  }

  public placeOrder(): void {
    this.checkOrder();
  }

  public checkOrder(): void {
    let testHasError;
    let timeError = false;
    /** BIC */
    if (this.test.testType === TestType.BIC) {
      testHasError = (this.test as Test).concepts.find(
        concept =>
          this.testProgressService.getWidthForProgressBIC('Section 6', concept, this.test as Test, this.test.respondentRequirements)
            .width !== MAX_WIDTH
      );
      if (this.calcTimeService.isExceedBICLimit) {
        timeError = true;
        this.calcTimeService.isShowedPopup = false;
      }
    }
    /** BT */
    if (this.test.testType === TestType.BT) {
      testHasError =
        this.testProgressService.getWidthForProgressBT('Section 8', this.test as BTTest, this.test.respondentRequirements).width !==
        MAX_WIDTH;
    }

    if (!testHasError && !timeError) {
      this._getCreatedOrderOrCreate();
    } else {
      if (testHasError) {
        this.getErrorsInTest();
      }
    }
  }

  private getErrorsInTest(): void {
    let errors = [];
    if (this.test.testType === TestType.BIC) {
      (this.test as Test).concepts.forEach(concept => {
        const errorConcept = this.testProgressService.getWidthForProgressBIC(
          'Section 6',
          concept,
          this.test as Test,
          this.test.respondentRequirements
        ).errorSection;
        if (errorConcept.length) {
          errors.push(errorConcept);
        }
      });
      this.getErrorMessagesInBIC(errors);
    }

    if (this.test.testType === TestType.BT) {
      errors = this.testProgressService.getWidthForProgressBT(
        'Section 8',
        this.test as BTTest,
        this.test.respondentRequirements
      ).errorSection;
      this.getErrorMessagesInBT(errors);
    }
  }

  private getErrorMessagesInBIC(errors: number[][]): void {
    this.toastService.showMessage(
      'error',
      this.translateService.instant('confirm-test.error-order'),
      `${TestCreationUtils.getConfirmAndRunErrorsForBIC(errors, this.translateService, this.test as Test)}`,
      TOAST_DELAY
    );
  }

  private getErrorMessagesInBT(errors: number[]): void {
    this.toastService.showMessage(
      'error',
      this.translateService.instant('confirm-test.error-order'),
      `${TestCreationUtils.getConfirmAndRunErrorsForBT(errors, this.translateService)}`,
      TOAST_DELAY
    );
  }

  private _getCountries(): void {
    this.appStateService.countries.pipe(takeUntil(this.ngUnsubscribe)).subscribe(countries => {
      if (countries.length) {
        this.countries = countries;
      }
    });
  }

  private _getRespondentOptions(): void {
    this.appStateService.respondentOptions$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(options => {
      if (options) {
        this.respondentOptions = options;
      }
    });
  }

  private _getCustomSegments(): void {
    this.testService
      .getCustomSegments()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(customSegments => {
        this.customSegments = customSegments;
        this.changeDetectionRef.detectChanges();
      });
  }

  private _getCreatedOrderOrCreate(): void {
    if (this.test.orderId === NO_ORDER_ID || !this.test.orderId) {
      this._createOrder();
    } else {
      this._getCreatedOrder();
    }
  }

  private _createOrder(): void {
    const order = {
      testId: this.test.id,
      testName: this.test.testName,
      amount: this.test.priceOfTest,
    };
    this.orderService.createOrder(order).subscribe(
      res => {
        if (res) {
          this.test.orderId = res.id;
          this.orderSS.setOrder(res.orderNumber);
          this._checkIfErrorFromNorstat();
        }

        // if (res && this.test.testType === TestType.BT) {
        // }
        this.isPay = true;
      },
      () => {
        this.toastService.showMessage('error', this.translateService.instant('t-auth.There was an unknown error. Please, try again.'), '');
      }
    );
  }

  private _getCreatedOrder(): void {
    this.orderService.getOrderById(this.test.orderId).subscribe({
      next: res => {
        this.orderSS.setOrder(res.orderNumber);
        this._checkIfErrorFromNorstat();
      },
      error: err => {
        this.toastService.showMessage(
          'error',
          this.translateService.instant('t-auth.There was an unknown error. Please, try again.'),
          err.message
        );
      },
    });
  }

  private _checkIfErrorFromNorstat(): void {
    this.paymentService.verifyPayment(this.test.id).subscribe({
      next: res => {
        if (res) {
          this._goToPaymentSelection();
        } else {
          this._showVerificationError();
        }
      },
      error: err => {
        this._showVerificationError();
      },
    });
  }

  private _goToPaymentSelection(): void {
    this.isPay = true;
    this.changeDetectionRef.detectChanges();
  }

  private _showVerificationError(): void {
    this.paymentVerificationFailed = true;
    this.changeDetectionRef.detectChanges();
    this.toastService.showMessage(
      'error',
      this.translateService.instant('confirm-test.Unfortunately, we seem to have an issue with our data provider.'),
      this.translateService.instant('confirm-test.Please contact our support who will help you.')
    );
  }
}
