import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-taste',
  templateUrl: './taste.component.html',
  styleUrls: [ './taste.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasteComponent implements OnInit {
  public background$: Observable<number>;
  public label$: Observable<string>;
  private texts: string[] = [
    'a taste of what\'s to come',
    'don\'t guess find out',
    'soon you\'ll know',
    'find out what\'s cooking',
  ];
  public color$: Observable<string>;

  constructor() {
  }

  public ngOnInit(): void {
    let backgroundLap = 0;
    let labelLap = 0;
    let colorLap = 0;
    const source$ = timer(0, 2000).pipe(
      shareReplay(),
      map((index) => ++index)
    );

    this.background$ = source$.pipe(
      map((order) => {
        const index = order - backgroundLap * 4;
        if ( index === 4 ) {
          backgroundLap++;
        }
        return index;
      })
    );

    this.label$ = source$.pipe(
      map((order) => {
        const index = order - labelLap * 4;
        if ( index === 4 ) {
          labelLap++;
        }
        return 'landing.' + this.texts[ index - 1 ];
      })
    );

    this.color$ = source$.pipe(
      map((order) => {
        const index = order - colorLap * 4;
        if ( index === 4 ) {
          colorLap++;
        }
        return index === 1 ? '#000' : '#fff';
      })
    );
  }

  public getColor(index: number): string {
    const colors = [
      'rgb(238, 190, 207, 0.7)',
      'rgb(241, 204, 181, 0.7)',
      'rgb(207, 225, 251, 0.7)',
      'rgb(222, 235, 171, 0.7)',
    ];
    return colors[ index - 1 ];
  }
}
