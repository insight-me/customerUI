import { Component, Input } from '@angular/core';
import { TestStatus } from '../../models/test.model';
import { PaymentStatus } from '../../models/payment.model';
import { LibraryTypes } from '../../enums/library.type';

interface StatusParams {
  name: string;
  image: string;
  color: string;
}

const TEST_LIBRARY_STATUSES = {
  [TestStatus.Draft]: {
    name: 'Draft',
    image: 'draft',
    color: '#8E8E93',
  },
  [TestStatus.Ongoing]: {
    name: 'Ongoing',
    image: 'ongoing',
    color: '#FF9859',
  },
  [TestStatus.Finished]: {
    name: 'Finished',
    image: 'finished',
    color: '#4DAC48',
  },
  [TestStatus.Pending]: {
    name: 'Pending',
    image: 'pending',
    color: '#675FA8',
  },
  [TestStatus.StartFailed]: {
    name: 'Failed start',
    image: 'failed-start',
    color: '#FF776F',
  },
};

const ORDER_LIBRARY_STATUSES = {
  [PaymentStatus.Success]: {
    name: 'Success',
    image: 'finished',
    color: '#4DAC48',
  },
  [PaymentStatus.Pending]: {
    name: 'Pending',
    image: 'pending',
    color: '#675FA8',
  },
};

const LIBRARY_STATUSES_OBJ = {
  [LibraryTypes.TestLibrary]: TEST_LIBRARY_STATUSES,
  [LibraryTypes.OrderLibrary]: ORDER_LIBRARY_STATUSES,
};

@Component({
  selector: 'app-library-item-status',
  templateUrl: './library-item-status.component.html',
  styleUrls: ['./library-item-status.component.scss'],
})
export class LibraryItemStatusComponent {
  @Input() isMobile = false;
  @Input() set statusName({
    status,
    libraryType,
  }: {
    status: TestStatus;
    libraryType: LibraryTypes;
  }) {
    this._status = LIBRARY_STATUSES_OBJ[libraryType][status];
  }

  private _status: StatusParams = null;

  public get status(): StatusParams {
    return this._status;
  }
}
