import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { forEach } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import MD5 from 'crypto-js/md5';
import { BTBrand } from 'src/app/shared/models/bt-test.model';
import { BTBrandHolders } from 'src/app/shared/enums/bt.creation.type';
import {
  MAX_IMAGE_SIZE_BT,
  MAX_IMAGES_LENGTH_BT,
} from 'src/assets/consts/test-creation.const';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { BtStateService } from '../../services/bt-state.service';
import { IMAGE_EXTENSION_TYPES } from '../../../../../../assets/consts/consts';

@Component({
  selector: 'app-brand-image-upload',
  templateUrl: './brand-image-upload.component.html',
  styleUrls: ['./brand-image-upload.component.scss'],
})
export class BrandImageUploadComponent {
  @Input() currentBrand: BTBrand = null;
  @Input() brands: BTBrand[] = [];
  @Input() type: BTBrandHolders;
  @Input() allBrands = 0;
  @Input() allImages: string[] = [];
  @Input() allImagesHash: string[] = [];
  public maxFileSize = MAX_IMAGE_SIZE_BT;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  @Output() public updateImage: EventEmitter<{
    imageData: string;
    imageHash: string;
  }> = new EventEmitter();

  constructor(
    private toastService: ToastService,
    private btTestCreateService: BtStateService,
    private translateService: TranslateService
  ) {}

  public handleFileInput(files: any): void {
    forEach(files, (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const fileName = file.name.split('.');
        if (
          !IMAGE_EXTENSION_TYPES.includes(
            fileName[fileName.length - 1].toLowerCase()
          )
        ) {
          this.toastService.showMessage(
            'warn',
            this.translateService.instant('t-toast.Failed'),
            this.translateService.instant('test-concept.error-extension')
          );
          return;
        }
        if (file.size > this.maxFileSize) {
          this.toastService.showMessage(
            'warn',
            this.translateService.instant('t-toast.Failed'),
            this.translateService.instant('test-concept.error-large-img')
          );
          return;
        }
        const image = new Image();
        image.src = reader.result as string;
        image.onload = () => {
          const imageFile = reader.result as string;
          const hash = MD5(imageFile).toString() + fileName.join('.');
          if (this.allImagesHash.includes(hash)) {
            this.toastService.showMessage(
              'warn',
              this.translateService.instant('t-toast.Failed'),
              this.translateService.instant(
                'BT-brands.Brand image exists.'
              )
            );
            return;
          }
          this.updateImage.emit({ imageData: imageFile, imageHash: hash });
        };
      };
    });
    this.fileUpload.nativeElement.value = '';
  }
}
