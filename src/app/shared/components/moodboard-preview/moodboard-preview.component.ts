import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MAX_MOODBOARD_HEIGHT, MOODBOARD_KOEF1, MOODBOARD_KOEF2 } from '../../../../assets/consts/consts';

@Component({
  selector: 'app-moodboard-preview',
  templateUrl: './moodboard-preview.component.html',
  styleUrls: [ './moodboard-preview.component.scss' ],
})
export class MoodboardPreviewComponent implements AfterViewInit {
  @Input() public moodboard: any;
  @ViewChild('moodboardContainerElement', { static: false }) public container: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {
  }

  public ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  public get scale(): number {
    return this.container?.nativeElement?.offsetWidth / MOODBOARD_KOEF1 * MOODBOARD_KOEF2;
  }

  public getHeight(): number {
    return MAX_MOODBOARD_HEIGHT * (this.container?.nativeElement?.offsetWidth / MOODBOARD_KOEF1 * MOODBOARD_KOEF2);
  }
}
