import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { TestType } from 'src/app/shared/enums/product.id.type';
import { Test } from '../../../../../shared/models/test.model';
import { BTTest } from '../../../../../shared/models/bt-test.model';

@Component({
  selector: 'app-popup-information',
  templateUrl: './popup-information.component.html',
  styleUrls: ['./popup-information.component.scss']
})
export class PopupInformationComponent implements OnInit {
  @Input() set test(test: Test | BTTest) {
    if (test) {
      this._test = test;
    }
  }

  get test(): Test | BTTest {
    return this._test;
  }

  @Input() public isPopup = true;
  @Output() updateGotIt: EventEmitter<boolean> = new EventEmitter();
  public isInformation: boolean;
  private _test: Test | BTTest;

  constructor() {}

  public get TestType(): typeof TestType {
    return TestType;
  }

  public ngOnInit(): void {
    this.isInformation = true;
  }

  public close(): void {
    this.isInformation = false;
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public getIgotIt(event): void {
    this.updateGotIt.emit(event.checked);
  }
}

