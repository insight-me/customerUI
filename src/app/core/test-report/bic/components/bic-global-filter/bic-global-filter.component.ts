import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractGlobalFiltersComponent } from 'src/app/shared/base/abstract-global-filters.component';
import { TestType } from 'src/app/shared/enums/product.id.type';
import { ListItem } from 'src/app/shared/models/test.model';
import { AppStateService } from 'src/app/shared/services/app-state/app-state.service';
import { LoadingService } from 'src/app/shared/services/app-state/loader.service';
import { GlobalFilterService } from '../../../bt/components/global-filter.service';
import { BicReportStateService } from '../../bic.report.state.service';

@Component({
  selector: 'app-bic-global-filter',
  templateUrl: './bic-global-filter.component.html',
  styleUrls: ['./bic-global-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BicGlobalFilterComponent extends AbstractGlobalFiltersComponent {

  public testType = TestType.BIC;

  get segments$(): Observable<ListItem[]> {
    return this.dataService.segmentOptions.asObservable();
  }

  constructor(
    protected fb: FormBuilder,
    protected globalFiltersService: GlobalFilterService,
    protected appStateService: AppStateService,
    protected cdRef: ChangeDetectorRef,
    private bicReportStateService: BicReportStateService,
    public loadingService: LoadingService
  ) {
    super(fb, globalFiltersService, appStateService, cdRef);
  }

  protected setService(): void {
    this.dataService = this.bicReportStateService;
  }

  protected createForm(): void {
    this.form = this.fb.group({
      countryIds: this.fb.control(null),
      regions: this.fb.control(null),
      population: this.fb.control(this.populationOptions[0]),
      gender: this.fb.control(this.allOption),
      fromAge: this.fb.control(null),
      toAge: this.fb.control(null),
      purchase: this.fb.control(null),
      segments: this.fb.control(null)
    });

  }
}
