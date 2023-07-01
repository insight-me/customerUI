import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {
  }

  public showMessage(status: string, summary: string, detail: string, life?: number): void {
    this.messageService.add({
      key: 'custom-toast',
      severity: 'custom',
      summary,
      detail,
      data: status,
      sticky: false,
      life: life ? life : 3000,
    });
  }
}
