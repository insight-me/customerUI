import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Countries } from '../models/test.model';
import { AppStateService } from '../services/app-state/app-state.service';

@Injectable({
    providedIn: 'root',
})
export class CountryResolver implements Resolve<Observable<Countries[]> | Countries[]> {
    constructor(private appStateService: AppStateService) { }

    resolve(): Observable<Countries[]> | Countries[] {
        if (this.appStateService.countryList.length) {
            return this.appStateService.countryList;
        }
        this.appStateService.getCountries();
        return [];
    }
}
