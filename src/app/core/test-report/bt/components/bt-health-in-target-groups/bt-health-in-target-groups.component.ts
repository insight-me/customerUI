import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {BtStyleService} from "../../bt.style.service";
import {GroupedBarDataSet} from "../../../../../shared/models/bic.test.report/grouped.bar.data.set";
import {KPI_NAME} from "../../../../../../assets/consts/consts";

@Component({
  selector: 'app-bt-health-in-target-groups',
  templateUrl: './bt-health-in-target-groups.component.html',
  styleUrls: ['./bt-health-in-target-groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtHealthInTargetGroupsComponent implements OnInit {
  @Input() public dataSet: GroupedBarDataSet[];
  @Input() public pdfVersion: boolean = false;

  constructor(
    public btStyle: BtStyleService,
  ) { }

  ngOnInit(): void {
  }

  public getGroupLabel(kpi: string): string {
    return KPI_NAME[kpi];
  }

}
