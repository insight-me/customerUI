import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SelfModel } from '../../../shared/models/landing/self.model';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { SectionHeaderInfo } from '../../../shared/models/main-page.model';
import { ABOUT_US_HEADER } from '../../../../assets/consts/main-page.consts';
import { COMPANIES_DATA } from './model/const/companies-data.const';
import { PERSONS_DATA } from './model/const/persons-data.const';

@Component({
  selector: 'app-about-us-page',
  templateUrl: './about-us-page.component.html',
  styleUrls: ['./about-us-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutUsPageComponent {
  public activeTab = 0;
  public personsData: SelfModel[] = PERSONS_DATA;
  public companiesData: SelfModel[] = COMPANIES_DATA;
  public IconsType = IconsType;
  public sectionInfo: SectionHeaderInfo = ABOUT_US_HEADER;
}
