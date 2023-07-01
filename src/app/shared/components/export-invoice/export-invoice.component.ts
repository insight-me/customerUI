import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IconsType } from '../../enums/icons.type';
import { ExportInvoiceService } from '../../services/invoices/export-invoice/export-invoice.service';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PaymentTypeBE } from '../../enums/payment.type';
import { TestProductName } from '../../enums/product.id.type';
import { ToastService } from '../../services/toast/toast.service';
import {
  A4_HEIGHT,
  A4_WIDTH,
  PNG_FORMAT,
  RECEIPT_SCALE,
} from '../../../../assets/consts/reciept.consts';

@Component({
  selector: 'app-export-invoice',
  templateUrl: './export-invoice.component.html',
  styleUrls: ['./export-invoice.component.scss'],
})
export class ExportInvoiceComponent implements AfterViewInit {
  @ViewChild('invoiceRef') invoiceRef: ElementRef;

  public tableHeader: string[] = [
    'Product',
    'Description',
    'Number of respondents',
    'Amount',
  ];

  constructor(
    public exportInvoiceService: ExportInvoiceService,
    private toastService: ToastService
  ) {}

  public ngAfterViewInit(): void {
    this.createPDF();
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public get PaymentTypeBE(): typeof PaymentTypeBE {
    return PaymentTypeBE;
  }

  public get TestProductName(): typeof TestProductName {
    return TestProductName;
  }

  public createPDF(): void {
    html2canvas(this.invoiceRef.nativeElement, {
      useCORS: true,
      logging: false,
      scale: RECEIPT_SCALE,
    }).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/jpg');
      const doc = new jsPDF('p', 'mm', 'a4', true);
      // setTimeout(() => {
      doc.addImage(contentDataURL, PNG_FORMAT, 0, 0, A4_WIDTH, A4_HEIGHT);
      const out = doc.output();
      const url = btoa(out);
      this.exportInvoiceService.setInvoicePDFImage(url);
      // }, 1000);
    });
  }
}
