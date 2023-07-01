import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss']
})
export class LegalComponent implements OnInit {
  public isPrivacy = false;
  public isTerms = false;

  constructor(private config: DynamicDialogConfig,
              private ref: DynamicDialogRef) {
  }

  public ngOnInit(): void {
    this.isPrivacy = this.config.data.isPrivacy;
    this.isTerms = this.config.data.isTerms;
  }

  public close(): void {
    this.ref.close();
  }
}
