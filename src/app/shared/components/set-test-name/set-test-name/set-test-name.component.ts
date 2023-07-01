import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TestService } from 'src/app/shared/services/test/test.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { Router } from '@angular/router';
import { UNEXPECTED_ERROR } from 'src/assets/consts/errors.const';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MAX_TEST_NAME_LENGTH, MIN_TEST_NAME_LENGTH, NO_SPACE_PATTERN } from '../../../../../assets/consts/consts';
import { BicTestService } from '../../../services/bic-test/bic-test.service';
import { BtTestService } from '../../../services/bt-test/bt-test.service';
import { checkExist } from '../../../validators/check-exist.validator';
import { TestType } from '../../../enums/product.id.type';

@Component({
  selector: 'app-set-test-name',
  templateUrl: './set-test-name.component.html',
  styleUrls: ['./set-test-name.component.scss'],
})
export class SetTestNameComponent implements AfterViewInit, OnDestroy {
  @Input() isCopy = false;
  @Input() test: {
    id: string;
    type: TestType;
    productId: string;
    name: string;
  };
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  public nameControl = new FormControl('');
  private testNames: string[] = [];

  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private testService: TestService,
    private toastService: ToastService,
    private router: Router,
    private bicTestService: BicTestService,
    private btTestService: BtTestService
  ) {}

  public ngAfterViewInit(): void {
    this.getTestsNames();
    this.setValidation();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public close(): void {
    this.onClose.emit(false);
  }

  public get controlHasError(): boolean {
    return this.nameControl.touched && this.nameControl.invalid;
  }

  private getTestsNames(): void {
    this.testService
      .getTests()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          res.forEach((test: any) => {
            if (test.testType === this.test.type) {
              this.testNames.push(test.testName.toLowerCase());
            }
          });
        }
        this.setValidation();
        this.nameControl.updateValueAndValidity();
      });
  }

  private setValidation(): void {
    this.nameControl.setValidators([
      Validators.required,
      Validators.minLength(MIN_TEST_NAME_LENGTH),
      Validators.maxLength(MAX_TEST_NAME_LENGTH),
      Validators.pattern(NO_SPACE_PATTERN),
      checkExist(this.testNames),
    ]);
  }

  public trimValue(): void {
    this.nameControl.setValue(this.nameControl.value.trim());
  }

  public submitNewTest(event?: KeyboardEvent): void {
    if (!event || (event && event.key === 'Enter')) {
      this.trimValue();
      event?.preventDefault();
      if (this.nameControl.valid) {
        if (this.isCopy) {
          this.copyTest();
        } else {
          this.createTest();
        }
      }
    }
  }

  public getErrorMessage(): string {
    const error = this.nameControl.errors;
    if (error.required) {
      return 'create-test.error-enter';
    }
    if (error.minlength || error.maxlength) {
      return 'create-test.error-length';
    }
    if (error.pattern) {
      return 'create-test.Invalid test name';
    }
    if (error.checkExist) {
      return 'create-test.error-exist';
    }
  }

  private createTest(): void {
    if (this.test.type === TestType.BIC) {
      this.bicTestService
        .createTest({
          testName: this.nameControl.value,
          productId: this.test.productId,
        })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            if (res) {
              this.router.navigate(['personal-area/create-test/bic', res.id]);
            }
          },
          err => {
            this.toastService.showMessage('warn', '', UNEXPECTED_ERROR);
          }
        );
    }
    if (this.test.type === TestType.BT) {
      this.btTestService
        .createTest({
          testName: this.nameControl.value,
          productId: this.test.productId,
        })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            if (res) {
              this._setIsFirstTestOpen(res.id);
              this.router.navigate(['personal-area/create-test/bt', res.id]);
            }
          },
          err => {
            this.toastService.showMessage('warn', '', UNEXPECTED_ERROR);
          }
        );
    }
  }

  private copyTest(): void {
    if (this.test.type === TestType.BIC) {
      this.bicTestService.copyTest(this.test.id, this.nameControl.value).subscribe({
        next: res => {
          this.router.navigate(['personal-area/create-test/bic', res]);
        },
        error: err => {
          this.toastService.showMessage('warn', '', UNEXPECTED_ERROR);
        },
      });
    } else {
      this.btTestService.copyTest(this.test.id, this.nameControl.value).subscribe({
        next: res => {
          this._setIsFirstTestOpen(res);
          this.router.navigate(['personal-area/create-test/bt', res]);
        },
        error: err => {
          this.toastService.showMessage('warn', '', UNEXPECTED_ERROR);
        },
      });
    }
  }

  private _setIsFirstTestOpen(testId: string): void {
    sessionStorage.setItem(
      `first-${testId}`,
      JSON.stringify({
        respondent: true,
        date: true,
      })
    );
  }
}
