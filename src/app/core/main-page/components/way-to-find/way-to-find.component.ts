import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../../shared/services/app-state/loader.service';

@Component({
  selector: 'app-way-to-find',
  templateUrl: './way-to-find.component.html',
  styleUrls: ['./way-to-find.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WayToFindComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
