import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { PRODUCT_LIST } from '../../../../../assets/consts/main-page.consts';
import { GridCard } from '../product-list/product-list.component';

@Component({
  selector: 'app-research-products',
  templateUrl: './research-products.component.html',
  styleUrls: ['./research-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchProductsComponent {
  public list: GridCard[] = PRODUCT_LIST;

  public get IconsType(): typeof IconsType {
    return IconsType;
  }
}
