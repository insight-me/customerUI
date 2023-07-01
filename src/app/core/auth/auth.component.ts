import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { IconsType } from '../../shared/enums/icons.type';
import { LoadingService } from '../../shared/services/app-state/loader.service';

@Component({
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  private language: string;
  public imgPreloadUrl = '../../../assets/images/png/background_blur_warm.png';
  public set imgUrl(value: string) {
    this._imgUrl = value;
    if (value) {
      this.loadingService.setLoadingBackgroundValue(false);
    }
  }

  public get imgUrl(): string {
    return this._imgUrl;
  }
  // tslint:disable-next-line:variable-name
  private _imgUrl: string;


  constructor(private route: ActivatedRoute,
    private loadingService: LoadingService,
    private configurationService: ConfigurationService) {
  }

  public ngOnInit(): void {
    this.loadingService.setLoadingBackgroundValue(true);
    this.language = this.route.snapshot.queryParams.language;
    if (this.language) {
      this.setLanguage();
    }
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  private setLanguage(): void {
    localStorage.setItem('language', JSON.stringify(this.language.toLowerCase()));
    this.configurationService.setLanguages();
  }
}
