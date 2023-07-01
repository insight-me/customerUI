import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStateService } from 'src/app/shared/services/app-state/app-state.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test-create-container',
  templateUrl: './test-create-container.component.html',
  styleUrls: ['./test-create-container.component.scss'],
})
export class TestCreateContainerComponent implements OnInit, OnDestroy {
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private appStateService: AppStateService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe((res) => {
      if (!this.appStateService.respondentOptions$.getValue()) {
        this.appStateService.saveRespondentOptions(res.respondentOptions);
      }
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
