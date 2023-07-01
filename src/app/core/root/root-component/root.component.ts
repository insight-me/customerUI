import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit {
  /*if url includes route, do not show header*/
  public isDashboardMode = false;
  private dashboardHeaderRoutes = ['dashboard', 'product-selection'];
  private excludeRoutes = ['create-test', 'test-report'];

  constructor(private route: ActivatedRoute) { }


  public ngOnInit(): void {
    this.route.data.subscribe();
  }

  public isShowHeader(): boolean {
    return !this.excludeRoutes.includes(
      this.route.snapshot.firstChild.routeConfig.path
    );
  }

  public getIsDashboardMode(): boolean {
    return this.dashboardHeaderRoutes.includes(
      this.route.snapshot.firstChild.routeConfig.path
    );
  }

  public get footerWithBackground(): boolean {
    return this.route.snapshot.firstChild.routeConfig.path === 'test-report';
  }
}
