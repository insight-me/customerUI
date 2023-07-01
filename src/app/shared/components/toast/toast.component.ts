import { MessageService } from 'primeng/api';
import { Component } from '@angular/core';
import { ToastType } from '../../enums/toast.type';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  providers: [],
})
export class ToastComponent {
  constructor(private messageService: MessageService) {}

  public onClose(): void {
    this.messageService.clear('custom-toast');
  }

  public get toastType(): typeof ToastType {
    return ToastType;
  }
}
