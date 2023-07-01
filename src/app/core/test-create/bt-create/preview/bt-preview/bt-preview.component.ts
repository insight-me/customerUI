import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractPreviewComponent } from 'src/app/shared/base/abstract-preview.component';
import { PreviewSections } from '../../../../../shared/models/preview.model';

@Component({
  selector: 'app-bt-preview',
  templateUrl: './bt-preview.component.html',
  styleUrls: ['./bt-preview.component.scss',
    '../../../../test-create/bic-create/preview/preview/preview.component.scss']
})
export class BtPreviewComponent extends AbstractPreviewComponent implements OnInit {
  @ViewChild('containerBT') public containerBT: ElementRef;
  @ViewChild('inputBrand') public section1: ElementRef;
  @ViewChild('preview2') public section2: ElementRef;
  @ViewChild('previewBrands') public previewBrands: ElementRef;
  @ViewChild('commercial') public commercial: ElementRef;
  @ViewChild('recommendation') public recommendation: ElementRef;
  @ViewChild('customQuestions') public customQuestions: ElementRef;
  public category: string;


  protected navigateToElement(): void {
    switch (this.currentRoute) {
      case PreviewSections.Section1:
        break;
      case PreviewSections.Section5:
        if (this.test.brands?.length && this.containerBT?.nativeElement) {
          this.containerBT.nativeElement.scrollTop =
            this.section2?.nativeElement.offsetTop;
        }
        break;
      case PreviewSections.Section3:
        if (this.test.brands?.length) {
          this.containerBT.nativeElement.scrollTop =
            this.previewBrands.nativeElement.offsetTop;
        }
        break;
      case PreviewSections.Section4:
        break;
      case PreviewSections.Section6:
        if (this.test.brands.length || this.test.customQuestions.length) {
          if (this.recommendation) {
            this.containerBT.nativeElement.scrollTop =
              this.recommendation?.nativeElement.offsetTop;
          } else if (this.commercial) {
            this.containerBT.nativeElement.scrollTop =
              this.commercial?.nativeElement.offsetTop;
          } else {
            if (this.containerBT) {
              this.containerBT.nativeElement.scrollTop =
                this.customQuestions?.nativeElement.offsetTop;
            }

          }
        }
        break;
    }
  }

}

