import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SwiperComponent } from 'ngx-swiper-wrapper';
import { QuickTest, TestName, TestStatus } from 'src/app/shared/models/test.model';
import { TestService } from 'src/app/shared/services/test/test.service';
import { FULL_PERCENTS } from 'src/assets/consts/consts';
import SwiperCore, { Navigation, Pagination, Scrollbar, SwiperOptions } from 'swiper';
import { SWIPER_OPTIONS } from '../../../../assets/configuration/swiper.config';
import { ProductName, TestProductName, TestType } from '../../../shared/enums/product.id.type';

SwiperCore.use([Navigation, Pagination, Scrollbar]);

interface CardParams {
  name: string;
  image: string;
  background: string;
  buttonText: string;
}

const TEST_STATUSES = {
  [TestStatus.Draft]: {
    name: 'Draft',
    image: 'draft',
    background: 'linear-gradient(180deg, #ADD9F4 0%, #E3F2FD 100%)',
    buttonText: 'Continue setup',
  },
  [TestStatus.Ongoing]: {
    name: 'Ongoing',
    image: 'ongoing',
    background: 'linear-gradient(180deg, #F9EF9A 0%, #FFFCE0 100%)',
    buttonText: 'Sneek peek of result',
  },
  [TestStatus.Finished]: {
    name: 'Finished',
    image: 'finished',
    background: 'linear-gradient(180deg, #AFEBAB 0%, #BAEEB7 27.83%, #D8F7D5 100%)',
    buttonText: 'View result and report',
  },
  [TestStatus.Pending]: {
    name: 'Pending',
    image: 'pending',
    background: 'linear-gradient(180deg, #B8B2EA 0%, #E6E2F8 100%)',
    buttonText: '',
  },
  [TestStatus.StartFailed]: {
    name: 'Failed start',
    image: 'failed-start',
    background: 'linear-gradient(180deg, #FFA56F 0%, #FFEEE3 100%)',
    buttonText: '',
  },
};

const MIN_TESTS_TO_SHOW_PAGINATION = 3;

@Component({
  selector: 'app-created-tests',
  templateUrl: './created-tests.component.html',
  styleUrls: ['./created-tests.component.scss'],
})
export class CreatedTestsComponent {
  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('testButton') testButton: HTMLAllCollection;
  @Input() public tests: QuickTest[] = [];
  public config: SwiperOptions = SWIPER_OPTIONS;


  private static getReportUrl(testName: TestName): string {
    const reportSubUrl = {
      [TestName.BIC]: 'bic',
      [TestName.BT]: 'bt',
    };
    return reportSubUrl[testName];
  }

  constructor(
    private testService: TestService,
    private translateService: TranslateService,
    private router: Router,
  ) { }

  public get statusEnum(): typeof TestStatus {
    return TestStatus;
  }

  public get TestType(): typeof TestType {
    return TestType;
  }

  public get TestProductName(): typeof TestProductName {
    return TestProductName;
  }

  public getCardParams(status: TestStatus): CardParams {
    return TEST_STATUSES[status];
  }

  public isShowPagination(): boolean {
    return this.tests.length < MIN_TESTS_TO_SHOW_PAGINATION;
  }

  public isShowButton(test: QuickTest): boolean {
    if (test.status === TestStatus.Ongoing) {
      return !!test.answeredNumber;
    }
    return !!TEST_STATUSES[test.status].buttonText;
  }

  public getProgressText(test: QuickTest): string {
    const proc = test.passesPercent;
    if (proc >= FULL_PERCENTS) {
      return this.translateService.instant('dashboard.finished-text');
    } else {
      return this.translateService.instant('dashboard.progress-of-data-gathering', { proc });
    }
  }

  public goTo(test: QuickTest): void {
    let urlParams = '';
    switch (test.status) {
      case TestStatus.Draft:
        urlParams = `/personal-area/create-test/${CreatedTestsComponent.getReportUrl(ProductName[test.productName])}/${test.id}/section-1`;
        break;
      case TestStatus.Ongoing:
      case TestStatus.Finished:
        urlParams = `/personal-area/test-report/${CreatedTestsComponent.getReportUrl(ProductName[test.productName])}/${test.id}`;
        break;
    }
    this.router.navigateByUrl(urlParams);
  }
}
