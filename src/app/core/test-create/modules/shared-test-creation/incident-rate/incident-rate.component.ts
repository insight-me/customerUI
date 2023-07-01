import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { TestCreationUtils } from '../../../../../shared/utils/test.creation.utils';
import { RespondentsService } from '../../../bic-create/services/respondents.service';
import { BicCategoryService } from '../../../../../shared/services/bic-test/bic-category.service';
import { Observable, Subscription } from 'rxjs';
import { CategoryInvolvement } from '../../../../../shared/models/bt-test.model';

const IR_LEVELS = {
  'Very High': {
    name: 'BIC.Very High',
    procents: ' (>95%)',
  },
  High: {
    name: 'BIC.High',
    procents: ' (80-95%)',
  },
  Medium: {
    name: 'BIC.Medium',
    procents: ' (40-79%)',
  },
  Low: {
    name: 'BIC.Low',
    procents: ' (20-39%)',
  },
  'Very Low': {
    name: 'BIC.Very Low',
    procents: ' (<20%)',
  },
};

@Component({
  selector: 'app-incident-rate',
  templateUrl: './incident-rate.component.html',
  styleUrls: ['./incident-rate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentRateComponent implements OnInit, OnDestroy {
  private _subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private bicRespondentsService: RespondentsService,
    private bicCategoryService: BicCategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this._subscription.add(
      this.bicRespondentsService.updateIR$.subscribe({
        next: () => {
          (this.IRForm.controls[0] as FormGroup).controls.ir.markAsTouched();
          this.cdr.detectChanges();
        },
      })
    );
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
  public get categoryName(): Observable<CategoryInvolvement> {
    return this.bicCategoryService.selectedCategory$;
  }

  public getIRLevel(IRLevel: string): { name: string; procents: string } {
    return IR_LEVELS[IRLevel];
  }

  public getAsFormControl(control: AbstractControl): FormControl {
    return control as FormControl;
  }

  public getAsFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  public get IRForm(): FormArray {
    return this.bicRespondentsService.IRsForm;
  }

  public emitValue(event?: Event, control?: FormControl): void {
    if (event) {
      TestCreationUtils.setZero(event, control);
    }
    this.bicRespondentsService.updateIRs();
    this.cdr.detectChanges();
  }
}
