import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { TestProductName, TestType } from '../../enums/product.id.type';
import { Company } from '../../models/company.model';
import { CustomSegment } from '../../models/custom-segmentation.model';
import { Product } from '../../models/product.model';
import { RespondentOptions, Segment } from '../../models/test-creation.model';
import { Countries } from '../../models/test.model';
import { User } from '../../models/user.model';
import { CompanyService } from '../company/company.service';
import { InvoicesStateService } from '../invoices/invoices-state.service';
import { ProductService } from '../product/product.service';
import { TestService } from '../test/test.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  public currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public currentCompany: BehaviorSubject<Company> = new BehaviorSubject<Company>(null);
  public countries: BehaviorSubject<Countries[]> = new BehaviorSubject<Countries[]>([]);
  public currentCountry: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public customSegments$: BehaviorSubject<CustomSegment[]> = new BehaviorSubject<CustomSegment[]>([]);
  public countryList: Countries[] = [];
  public respondentOptions$: BehaviorSubject<RespondentOptions> = new BehaviorSubject<RespondentOptions>(null);
  public userInfo: User = null;
  public products$: Observable<Product[]> = null;
  public language: BehaviorSubject<string> = new BehaviorSubject<string>('EN');
  public numberOfSegments: number;
  public customSegments = [];
  public defaultSegment: Segment = null;

  private _company: Company = null;

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private testService: TestService,
    private productService: ProductService,
    private invoicesSS: InvoicesStateService
  ) {}

  public get user(): Observable<User> {
    return this.currentUser.asObservable();
  }

  public get company(): Observable<Company> {
    return this.currentCompany.asObservable();
  }

  public setCurrentUser(user: User): void {
    this.userInfo = user;
    this.currentUser.next(user);
    this.invoicesSS.clearInvoices();
  }

  public deleteCurrentUser(): void {
    this.userInfo = null;
    this.currentUser.next(null);
  }

  public setCurrentCompany(company: Company): void {
    this._company = company;
    this.currentCompany.next(company);
    if (!this.countryList.length) {
      this.getCountries();
    }
    this.setCurrentCountry();
  }

  public deleteCurrentCompany(): void {
    this._company = null;
    this.currentCompany.next(null);
  }

  public getCountries(): void {
    this.userService
      .getCountriesList()
      .pipe(first())
      .subscribe(res => {
        this.countryList = res;
        this.countries.next(res);
        this.setCurrentCountry();
      });
  }

  public getCompany(): void {
    if (this.userInfo) {
      this.companyService.getCompanyById(this.userInfo.companyId).subscribe(res => {
        this.setCurrentCompany(res);
      });
    }
  }

  public getUser(): void {
    this.userService.getUserInfo().subscribe(res => {
      this.setCurrentUser(res);
      if (this.language.getValue() !== res.preferredLanguage.toLowerCase()) {
        this.changeLanguage(res.preferredLanguage.toLowerCase());
      }
    });
  }

  public getRespondentOptions(): void {
    const test = this.testService.test;
    this.testService.getRespondentOptions(test.sv).subscribe(res => {
      this.saveRespondentOptions(res);
    });
  }

  public changeLanguage(lang: string): void {
    this.language.next(lang);
    this.getCountries();
    this.getRespondentOptions();
  }

  public saveRespondentOptions(respondentOptions: RespondentOptions): void {
    this.numberOfSegments = respondentOptions.segments.length;
    this.defaultSegment = respondentOptions.segments.find(segment => segment.isDefault);
    this.respondentOptions$.next(respondentOptions);
  }

  public getUserInfoForGuard(): Observable<User> {
    return this.userService.getUserInfo();
  }

  public getProducts(): void {
    this.products$ = this.productService.getProduct().pipe(
      /** toDo: remove to see CT test */
      map(products => {
        return products.filter(product => product.testType !== TestType.CT);
      }),
      map(products => {
        products.forEach(product => (product.name = TestProductName[product.testType]));
        return products;
      })
    );
  }

  public getCustomSegmentation(): void {
    this.testService.getCustomSegments().subscribe(customSegments => {
      this.customSegments$.next(customSegments);
      this.customSegments = customSegments;
    });
  }

  private setCurrentCountry(): void {
    this.currentCountry.next(this.countryList.find(item => item.countryCode === this._company?.countryCode)?.countryName);
  }
}
