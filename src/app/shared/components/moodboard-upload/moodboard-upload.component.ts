import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { differenceWith, forEach, orderBy } from 'lodash';
import { CdkDragEnter, moveItemInArray } from '@angular/cdk/drag-drop';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { calcImageData } from '../../utils/calc-image-data.utils';
import { IMAGE_EXTENSION_TYPES } from '../../../../assets/consts/consts';

@Component({
  selector: 'app-moodboard-upload',
  templateUrl: './moodboard-upload.component.html',
  styleUrls: ['./moodboard-upload.component.scss'],
  providers: [DialogService],
  encapsulation: ViewEncapsulation.None,
})
export class MoodboardUploadComponent {
  @Input()
  public set moodBoard(data: any) {
    if (data) {
      this.images = orderBy(data.items, ['position'], ['asc']);
      if (this.images.length && (differenceWith(data.items, this.images) || differenceWith(this.images, data.items))) {
        this.saveImages();
      }
    } else {
      this.images = [];
    }
  }

  @Output() public updateMoodBoard = new EventEmitter();
  @ViewChild('fileUpload') fileUpload: ElementRef;

  public images = [];
  public maxLength = 9;
  public maxFileSize = 1024 * 1024 * 1.5;
  public containerWidth = 1124;
  public containerHeight = 600;

  constructor(
    private toastService: ToastService,
    private translateService: TranslateService
  ) {
  }

  public handleFileInput(files: any): void {
    const filesLength = files.length;
    forEach(files, (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const fileName = file.name.split('.');
        if (!IMAGE_EXTENSION_TYPES.includes(fileName[fileName.length - 1].toLowerCase())) {
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
          if (this.images.length < this.maxLength) {
            const imageFile = reader.result as string;
            const itemData = calcImageData(this.containerWidth, this.containerHeight, image, filesLength > 1);
            this.images.push({
              imageName: file.name,
              imageBase64: imageFile,
              itemData
            });
            this.updateMoodBoard.emit({
              items: this.images,
            });
          }
        };
      };
    });
    this.fileUpload.nativeElement.value = '';
  }

  public onDeleteImage(index: number): void {
    this.images = this.images.filter((value, i) => index !== i);
    this.updateMoodBoard.emit({
      items: this.images,
    });
  }

  public entered(event: CdkDragEnter): void {
    moveItemInArray(this.images, event.item.data, event.container.data);
    this.updateMoodBoard.emit({
      items: this.images,
    });
  }

  public getImageUrl(image): string {
    return image.imageBase64 ? image.imageBase64 : image.path;
  }

  public saveImages(): void {
    this.updateMoodBoard.emit({
      items: this.images,
    });
  }

  public onChangeImage(cofig: any, image: any): void {
    image.itemData = {
      itemPositionX: Math.floor(cofig.position.x),
      itemPositionY: Math.floor(cofig.position.y),
      itemWidth: Math.floor(cofig.width),
      itemHeight: Math.floor(cofig.height),
    };
    this.updateMoodBoard.emit({
      items: this.images,
    });
  }

  public onSelectImage(image, index): void {
    this.images = this.images.filter((item, i) => i !== index);
    this.images.push(image);
  }
}
