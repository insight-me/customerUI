import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { AbstractPreviewComponent } from 'src/app/shared/base/abstract-preview.component';
import { PreviewSections } from 'src/app/shared/models/preview.model';
import { TestConcept } from 'src/app/shared/models/test.model';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: [
    './preview.component.scss',
    '../../components/bic-container/bic-container.component.scss',
  ],
})
export class PreviewComponent extends AbstractPreviewComponent implements OnInit {
  @Input() public concept: TestConcept;
  @ViewChild('container') public container: ElementRef;
  @ViewChild('preview1') public section1: ElementRef;
  @ViewChild('preview2') public section2: ElementRef;
  @ViewChild('preview3') public section3: ElementRef;
  @ViewChild('preview4') public section4: ElementRef;

  public ngOnInit(): void {
    super.ngOnInit();
    setTimeout(() => {
      this.concept = this.concept = this.config.data.concept;
    }, 0);
  }


  protected navigateToElement(): void {
    switch (this.currentRoute) {
      case PreviewSections.Section1:
        break;
      case PreviewSections.Section2:
        this.container.nativeElement.scrollTop =
          this.section2.nativeElement.offsetTop;
        break;
      case PreviewSections.Section3:
        if (this.section3) {
          this.container.nativeElement.scrollTop =
            this.section3.nativeElement.offsetTop;
        } else {
          this.container.nativeElement.scrollTop =
            this.section2.nativeElement.offsetTop;
        }
        break;
      case PreviewSections.Section4:
        if (this.section4) {
          this.container.nativeElement.scrollTop =
            this.section4.nativeElement.offsetTop;
        } else {
          if (this.section3) {
            this.container.nativeElement.scrollTop =
              this.section3.nativeElement.offsetTop;
          } else {
            this.container.nativeElement.scrollTop =
              this.section2.nativeElement.offsetTop;
          }
        }
        break;
    }
  }

}
