import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bt-preview-additional-questions',
  templateUrl: './bt-preview-additional-questions.component.html',
  styleUrls: ['./bt-preview-additional-questions.component.scss']
})
export class BtPreviewAdditionalQuestionsComponent implements OnInit {
  @Input() test: any = null;
  @Input() concept: any;

  ngOnInit(): void {
  }

}
