import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppStateService } from '../../services/app-state/app-state.service';

@Component({
  selector: 'app-tests-list',
  templateUrl: './tests-list.component.html',
  styleUrls: ['./tests-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsListComponent implements OnInit {
  constructor(public appSS: AppStateService) {}

  public ngOnInit(): void {
    if (!this.appSS.products$) {
      this.appSS.getProducts();
    }
  }
}
