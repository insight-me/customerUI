import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseSectionComponent } from '../base-section/base-section.component';
import * as moment from 'moment';
import { FormControl, Validators } from '@angular/forms';
import { isLateStartDate, isValidStartDate, isValidStartDateFormat } from '../../../../../shared/utils/date.utils';
import { TestCreationUtils } from '../../../../../shared/utils/test.creation.utils';

@Component({
  selector: 'app-section-seven',
  templateUrl: './section-seven.component.html',
  styleUrls: [
    './section-seven.component.scss',
    '../../../components/test-create-container/test-create-container.component.scss',
    '../../../bic-create/components/bic-container/bic-container.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionSevenComponent extends BaseSectionComponent {
  public currentSection = 'section-7';
  public startDateControl: FormControl = new FormControl('', [Validators.required]);
  public disabledDays = [0, 2, 3, 4, 5, 6];
  public disabledDates: Date[] = [];
  public isChangeDate = false;

  public setInitActions(): void {
    if (this.test.startDate !== null) {
      this.startDateControl.setValue(new Date(Date.parse(this.test.startDate as string)));
    }
    this.startDateControl.valueChanges.subscribe(() => {
      this.updateStartDate();
      this.cdr.detectChanges();
    });
    this.setDisabledDates();
    const firstEnter = TestCreationUtils.getSessionStorageFirstEnterTestKey(this.test.id);
    if (firstEnter?.date) {
      if (firstEnter?.respondent) {
        sessionStorage.setItem(
          `first-${this.test.id}`,
          JSON.stringify({
            respondent: firstEnter.respondent,
            date: false,
          })
        );
      } else {
        sessionStorage.removeItem(
          `first-${this.test.id}`
        );
      }

    } else {
      this.startDateControl.markAsTouched();
    }
    this.cdr.detectChanges();
  }

  public get checkIfHaveChanges(): boolean {
    return this.isChangeDate;
  }

  private setDisabledDates(): void {
    const dayToday = moment().format('dddd');
    if (dayToday === 'Sunday') {
      const tomorrow = new Date();
      const today = new Date();
      tomorrow.setDate(today.getDate() + 1);
      this.disabledDates.push(tomorrow);
    }
    this.disabledDates.push(new Date());
  }

  public updateStartDate(): void {
    const date = Date.parse(this.startDateControl.value);
    this.test.startDate = new Date(Date.UTC(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate()));
    const endDate = new Date(date);
    this.test.endDate = new Date(endDate.setMonth(endDate.getMonth() + +this.test.testDurationInMonthes));
    this.isChangeDate = this.initTest?.startDate !== this.test?.startDate;
  }

  public isLateStartDate(): boolean {
    return isLateStartDate(this.test.startDate as Date);
  }

  public isValidStartDateFormat(): boolean {
    return isValidStartDateFormat(this.test?.startDate);
  }

  public isValidStartDate(): boolean {
    return isValidStartDate(this.startDateControl.value);
  }
}
