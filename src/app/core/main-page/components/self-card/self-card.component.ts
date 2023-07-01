import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
} from '@angular/core';
import { SelfModel } from '../../../../shared/models/landing/self.model';
import { IconsType } from '../../../../shared/enums/icons.type';
import { WindowVersion } from './model/enums/window-version.enum';

@Component({
  selector: 'app-self-card',
  templateUrl: './self-card.component.html',
  styleUrls: ['./self-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelfCardComponent implements AfterViewInit {
  @Input() public dataSet: SelfModel[];
  @Input() public isTeam = true;

  public windowVersion: WindowVersion = WindowVersion.DESKTOP_VERSION;
  public IconsType = IconsType;
  public cardPagesArray: number[] = [];
  public displayedDataSet: SelfModel[] = [];

  private _activePage = 0;
  private touchStartX = 0;
  private touchEndX = 0;

  private dragStartX = 0;
  private dragEndX = 0;

  @HostListener('window:resize', ['$event.target'])
  private resize(ev) {
    this.setDesktopVersion();
    this.cdr.detectChanges();
  }

  constructor(private cdr: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    this.setDesktopVersion();
  }

  public set activePage(page: number) {
    this._activePage = page;
    this.refreshDisplayedDataSet();
  }

  public get activePage(): number {
    return this._activePage;
  }

  public refreshDisplayedDataSet(): void {
    switch (this.windowVersion) {
      case WindowVersion.DESKTOP_VERSION:
        this.displayedDataSet = this.dataSet;
        break;
      case WindowVersion.TABLE_VERSION:
        this.displayedDataSet = this.isTeam
          ? this.dataSet.slice(this._activePage * 3, this._activePage * 3 + 3)
          : this.dataSet.slice(this._activePage * 2, this._activePage * 2 + 2);
        break;
      case WindowVersion.MOBILE_VERSION:
        this.displayedDataSet = this.dataSet.slice(
          this._activePage,
          this._activePage + 1
        );
        break;
    }
    this.cdr.detectChanges();
  }

  public get gridTemplateColumns(): string {
    switch (this.windowVersion) {
      case WindowVersion.DESKTOP_VERSION:
        return this.isTeam
          ? 'repeat(' + this.dataSet.length + ', 200px)'
          : 'repeat(' + this.dataSet.length + ', 300px)';
      case WindowVersion.TABLE_VERSION:
        return this.isTeam
          ? 'repeat(' + this.displayedDataSet.length + ', 200px)'
          : 'repeat(' + this.displayedDataSet.length + ', 300px)';
      case WindowVersion.MOBILE_VERSION:
        return 'repeat(1 , 300px)';
    }
    this.cdr.detectChanges();
  }

  public wheelHandler(event: WheelEvent): void {
    if (!event.deltaX || Math.abs(event.deltaX) < Math.abs(event.deltaY)) {
      return;
    }
    this.scroll(event.deltaX > 0);
  }

  public touchStartHandler(event): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  public touchEndHandler(event): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleGesture();
  }

  private handleGesture(): void {
    if (Math.abs(this.touchEndX - this.touchStartX) < 50) {
      return;
    }
    if (this.touchEndX < this.touchStartX) {
      this.scroll(true);
    } else if (this.touchEndX > this.touchStartX) {
      this.scroll(false);
    }
  }

  public mouseDown(event: MouseEvent): void {
    this.dragStartX = event.x;
  }

  public mouseUp(event: MouseEvent): void {
    this.dragEndX = event.x;
    this.handleDrag();
  }

  private handleDrag(): void {
    if (Math.abs(this.dragEndX - this.dragStartX) < 50) {
      return;
    }
    if (this.dragEndX < this.dragStartX) {
      this.scroll(true);
    } else if (this.dragEndX > this.dragStartX) {
      this.scroll(false);
    }
  }

  private setDesktopVersion(): void {
    const width = window.innerWidth;
    if (width > 1306) {
      this.windowVersion = WindowVersion.DESKTOP_VERSION;
      this.cardPagesArray = [];
    }
    if (width <= 1306 && width >= 744) {
      this.windowVersion = WindowVersion.TABLE_VERSION;
      this.cardPagesArray = [0, 1];
    }
    if (width < 744) {
      this.windowVersion = WindowVersion.MOBILE_VERSION;
      this.cardPagesArray = [];
      this.dataSet.forEach((item, index) => this.cardPagesArray.push(index));
    }
    this.refreshDisplayedDataSet();
  }

  private scroll(next: boolean): void {
    const nextIndex = next ? this._activePage + 1 : this._activePage - 1;
    if (nextIndex < 0 || nextIndex > this.cardPagesArray.length - 1) {
      return;
    }
    this.activePage = nextIndex;
  }
}
