import { Component, Input, OnInit } from '@angular/core';
import { BTTest } from '../../../../../shared/models/bt-test.model';

@Component({
  selector: 'app-bt-one-preview',
  templateUrl: './bt-one-preview.component.html',
  styleUrls: ['./bt-one-preview.component.scss']
})
export class BtOnePreviewComponent implements OnInit {
  @Input() test: BTTest;
  @Input() category: string;
  constructor() { }

  ngOnInit(): void {
  }

}
