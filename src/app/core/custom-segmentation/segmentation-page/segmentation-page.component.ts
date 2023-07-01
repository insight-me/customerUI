import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CustomSegments} from '../../../shared/models/custom-segmentation.model';
import {Subscription} from 'rxjs';
import {CreateSegmentationService} from '../../../shared/services/segmentation/create-segmentation.service';
import {AppStateService} from '../../../shared/services/app-state/app-state.service';
import {User} from '../../../shared/models/user.model';
import {changeMetaToDesktop} from '../../../shared/utils/change-meta.utils';

@Component({
  selector: 'app-segmentation-page',
  templateUrl: './segmentation-page.component.html',
  styleUrls: ['./segmentation-page.component.scss']
})
export class SegmentationPageComponent implements OnInit, OnDestroy {
  @ViewChild('matrixContainer') matrixContainer: ElementRef;
  @ViewChild('editBtn') editBtn: ElementRef;
  public customSegments: CustomSegments;
  private sub: Subscription = new Subscription();
  public user: User;
  public isAlertExist = true;

  constructor(private createSegmentationService: CreateSegmentationService,
              private appStateService: AppStateService) {
  }

  public ngOnInit(): void {
    this.createSegmentationService.setSegmentation();
    this.getCustomSegments();
    this.getUser();
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public closeAlert(): void {
    this.isAlertExist = false;
    this.matrixContainer.nativeElement?.classList.remove('show');
    this.editBtn.nativeElement?.classList.remove('show');
    changeMetaToDesktop();
  }

  private getCustomSegments(): void {
    this.sub = this.createSegmentationService.getSegmentation()
      .subscribe((segments) => {
        if (segments) {
          this.customSegments = segments;
        }
      });
  }

  private getUser(): void {
    this.sub.add(this.appStateService.user.subscribe((user) => {
      this.user = user;
    }));
  }
}
