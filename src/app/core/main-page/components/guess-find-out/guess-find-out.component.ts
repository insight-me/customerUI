import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guess-find-out',
  templateUrl: './guess-find-out.component.html',
  styleUrls: ['./guess-find-out.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuessFindOutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
