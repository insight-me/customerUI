import { Component, Input, OnInit } from '@angular/core';
import { CustomTranslateService } from 'src/app/shared/services/custom-translate.service';
import { BicCategoryService } from '../../../../../shared/services/bic-test/bic-category.service';

@Component({
  selector: 'app-bt-preview-brands',
  templateUrl: './bt-preview-brands.component.html',
  styleUrls: ['./bt-preview-brands.component.scss',
    '../bt-preview-input-brand/bt-preview-input-brand.component.scss',
    '../../../../test-create/bt-create/components/brand-img-list/brand-img-list.component.scss']
})
export class BtPreviewBrandsComponent implements OnInit {
  @Input() test: any = null;

  constructor(public categoryService: BicCategoryService,
    public customTranslateService: CustomTranslateService
  ) { }

  ngOnInit(): void { }

}
