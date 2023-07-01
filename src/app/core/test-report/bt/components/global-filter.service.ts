import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NzCalendarMode } from 'src/app/shared/enums/nz-range.type';
import { Countries } from 'src/app/shared/models/test.model';
import { AppStateService } from 'src/app/shared/services/app-state/app-state.service';

@Injectable({ providedIn: 'root' })
export class GlobalFilterService {
  public isOpened$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public switch$: Subject<boolean> = new Subject();
  public pickerOpened$: Subject<boolean> = new Subject();
  public movingAverage$ = new BehaviorSubject(true);
  public countryList: Countries[] = [];
  public calendarMode: NzCalendarMode;
  public period: string;
  public inputValue: string;
  public datesMap: Map<string, string> = new Map();

  constructor(private _appStateService: AppStateService) { }

  public getCountries(): Observable<Countries[]> {
    return this._appStateService.countries
      .pipe(tap((res) => {
        this.countryList = res;
      }));
  }
}
