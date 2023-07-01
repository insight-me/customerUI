import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AppStateService } from 'src/app/shared/services/app-state/app-state.service';
import { BTTest } from '../../../../../shared/models/bt-test.model';
import { BICSections } from '../../../bic-create/enums/bic-create.enums';
import { RespondentsService } from '../../../bic-create/services/respondents.service';
import { BtStateService } from '../../services/bt-state.service';

@Component({
  selector: 'app-bt-container',
  templateUrl: './bt-container.component.html',
  styleUrls: ['./bt-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtContainerComponent implements OnInit, OnDestroy {
  constructor(
    public respondentService: RespondentsService,
    private btStateService: BtStateService,
    private route: ActivatedRoute,
    private appStateService: AppStateService
  ) {}

  public ngOnInit(): void {
    this.appStateService.getCustomSegmentation();
    this.btStateService.getTest(this.route.snapshot.params.id);
  }

  public ngOnDestroy(): void {
    sessionStorage.removeItem(`first-${this.route.snapshot.params.id}`);
    localStorage.removeItem('previewLanguage');
    this.btStateService.nextRoute$.next(BICSections.Section1);
  }

  public get test$(): Observable<BTTest> {
    return this.btStateService.currentTest$;
  }
}
