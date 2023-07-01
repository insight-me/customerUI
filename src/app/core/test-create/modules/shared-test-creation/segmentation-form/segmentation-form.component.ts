import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SEGMENT_TYPES } from '../../../../../../assets/consts/consts';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { AppStateService } from '../../../../../shared/services/app-state/app-state.service';
import { RespondentRequirements } from '../../../../../shared/models/test.model';
import {
  RespondentOptions,
  Segment,
} from '../../../../../shared/models/test-creation.model';
import { TestType } from '../../../../../shared/enums/product.id.type';
import { RespondentsService } from '../../../bic-create/services/respondents.service';
import { DropdownDataType } from 'src/app/shared/enums/dropdown.type';

@Component({
  selector: 'app-segmentation-form',
  templateUrl: './segmentation-form.component.html',
  styleUrls: ['./segmentation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentationFormComponent implements OnDestroy {
  @Input() testType: TestType;
  @Input() respondentRequirements: RespondentRequirements;
  @Input() set respondentOptions(options) {
    if (options) {
      this._respondentOptions = options;
      this.segmentsForDropdown = this._respondentOptions.segments.filter(
        (segment) => !segment.isDefault
      );
    }
  }

  public segmentsForDropdown: Segment[] = [];
  public segmentTypes: string[] = SEGMENT_TYPES;

  private _respondentOptions: RespondentOptions = null;

  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public appStateService: AppStateService,
    private bicRespondentsService: RespondentsService
  ) {}

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public get isBicTest(): boolean {
    return this.testType === TestType.BIC;
  }

  public get segmentTypeControl(): FormControl {
    return this.bicRespondentsService.segmentTypeControl;
  }

  public get segmentControl(): FormControl {
    return this.bicRespondentsService.segmentControl;
  }

  public get customSegmentControl(): FormControl {
    return this.bicRespondentsService.customSegmentControl;
  }

  public get DropdownDataType(): typeof DropdownDataType {
    return DropdownDataType;
  }

  public onSelectCustomSegments(items): void {
    this.customSegmentControl.setValue(items);
    this.bicRespondentsService.updateCustomSegments();
  }

  public onSelectSegments(items): void {
    this.segmentControl.setValue(items);
    this.bicRespondentsService.updateSegments();
  }

  public onChangeSegmentType(): void {
    this.bicRespondentsService.updateSegmentType();
  }
}
