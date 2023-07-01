import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateService } from '../../../../shared/services/app-state/app-state.service';

@Component({
  selector: 'app-desktop-alert',
  templateUrl: './desktop-alert.component.html',
  styleUrls: ['./desktop-alert.component.scss'],
})
export class DesktopAlertComponent implements OnInit, OnDestroy {
  @Output() closeAlert = new EventEmitter();

  public userName = '';

  private _sub: Subscription = new Subscription();

  constructor(private appStateService: AppStateService) {}

  public ngOnInit(): void {
    this._getUserName();
  }

  public ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

  public openPage(): void {
    this.closeAlert.emit();
  }

  private _getUserName(): void {
    this._sub = this.appStateService.user.subscribe((user) => {
      if (user) {
        this.userName = `${user?.firstName} ${user?.lastName}`;
      }
    });
  }
}
