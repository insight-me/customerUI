import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuarterService {
  public year$: Subject<number> = new Subject();
  public selectedSet: Set<string> = new Set();
  public selectedMap: Map<number, string> = new Map();

}
