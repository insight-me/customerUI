import { Component, Input, OnInit } from '@angular/core';
import { BTBrand, BTTest } from '../../../../../shared/models/bt-test.model';

@Component({
  selector: 'app-brand-img-list',
  templateUrl: './brand-img-list.component.html',
  styleUrls: ['./brand-img-list.component.scss',
  '../../../bt-create/preview/bt-preview-input-brand/bt-preview-input-brand.component.scss']
})
export class BrandImgListComponent implements OnInit {
  @Input() imagesList: BTBrand[] = [];
  @Input() test: BTTest;
  constructor() { }

  ngOnInit(): void {
  }

}
