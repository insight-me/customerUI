import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BtTestCreateService } from '../../../../../shared/services/bt-test/bt-test-create.service';
import { SubheaderElement } from '../../../../../shared/models/test-creation.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BTTest } from 'src/app/shared/models/bt-test.model';
import { IconsType } from '../../../../../shared/enums/icons.type';
import { RespondentRequirements, Test, TestConcept } from '../../../../../shared/models/test.model';
import { AppStateService } from '../../../../../shared/services/app-state/app-state.service';
import { TestProgressService } from '../../../../../shared/services/test-progress/test-progress.service';

@Component({
  selector: 'app-subheader-element',
  templateUrl: './subheader-element.component.html',
  styleUrls: ['./subheader-element.component.scss'],
})
export class SubheaderElementComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() isFirst: boolean;
  @Input() isLast: boolean;
  @Input() item: SubheaderElement;
  @Input() test: Test | BTTest;
  @Input() currentConcept: TestConcept = null;
  @Input() respondentRequirements: RespondentRequirements = null;

  @Output() changeRoute: EventEmitter<string> = new EventEmitter();
  public currentRoute = '';

  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private btTestCreateService: BtTestCreateService,
    private appStateService: AppStateService,
    private testProgressService: TestProgressService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this._getCurrentRoute();
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this._getCurrentRoute();
    });
  }

  public ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  public ngOnDestroy(): void {
    this.btTestCreateService.nextRoute.next('section-1');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getWidthForProgress(): number {
    return this.testProgressService.getWidthForProgressBIC(
      this.item.title,
      this.currentConcept,
      this.test as Test,
      this.respondentRequirements
    ).width;
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public onNavigate(route: string): void {
    this.changeRoute.emit(route);
  }

  private _getCurrentRoute(): void {
    this.currentRoute = this.route.snapshot.firstChild.routeConfig.path;
  }
}
