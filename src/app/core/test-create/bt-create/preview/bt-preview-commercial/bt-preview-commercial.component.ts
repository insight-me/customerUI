import { Component, Input } from '@angular/core';
import {  BTTest } from '../../../../../shared/models/bt-test.model';

@Component({
  selector: 'app-bt-preview-commercial',
  templateUrl: './bt-preview-commercial.component.html',
  styleUrls: ['./bt-preview-commercial.component.scss']
})
export class BtPreviewCommercialComponent {
  @Input() test: BTTest;
  @Input() category: string;

}
