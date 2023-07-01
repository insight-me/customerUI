import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { AppStateService } from '../../shared/services/app-state/app-state.service';
import { User } from 'src/app/shared/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  providers: [DialogService],
})
export class MyProfileComponent implements OnInit, OnDestroy {
  public user: User;
  private sub: Subscription = new Subscription();

  constructor(private activatedRoute: ActivatedRoute,
              private appStateService: AppStateService) {
  }

  public ngOnInit(): void {
    this.sub = this.appStateService.user.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
