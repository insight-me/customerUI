import {
  Component,
  Input,
  Output,
  HostListener,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent {
  @Input() public imageFile: string;
  @Input() public disabled = false;
  @Output() public updateImage = new EventEmitter();
  @ViewChild('editBlock') editBlock;

  public showEditBlock = false;

  constructor(
    private imageCompress: NgxImageCompressService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement): void {
    if (this.editBlock) {
      const clickedInside = this.editBlock.nativeElement.contains(
        targetElement
      );
      if (!clickedInside) {
        this.showEditBlock = false;
      }
    }
  }

  public onEdit(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.showEditBlock = !this.showEditBlock;
  }

  public onDeleteImage(): void {
    this.imageFile = null;
    this.showEditBlock = false;
    this.updateImage.emit(null);
  }

  public handleFileInput(files: any): void {
    if (this.disabled) {
      return;
    }
    const image = files[0];
    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        if (this.imageCompress.byteCount(reader.result) > 1024 * 1024 * 5) {
          this.imageCompress
            .compressFile(reader.result as string, -1, 50, 50)
            .then((result) => {
              this.imageFile = result as string;
              if (this.imageCompress.byteCount(result) > 1024 * 1024 * 5) {
                this.toastService.showMessage(
                  'warn',
                  this.translateService.instant('t-toast.Failed'),
                  this.translateService.instant('test-concept.error-large-img'),
                );
              } else {
                this.updateImage.emit({
                  image: this.imageFile,
                  type: image.type,
                });
              }
            });
        } else {
          this.imageFile = reader.result as string;
          this.updateImage.emit({ image: this.imageFile, type: image.type });
        }
      };
    }
  }
}
