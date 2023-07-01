import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { IMAGE_EXTENSION_TYPES } from '../../../../../../assets/consts/consts';
import { ToastService } from '../../../../services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ONE_AND_HALF_MB_IN_BYTE } from '../../../../../../assets/consts/test-creation.const';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: [ './add-image.component.scss' ]
})
export class AddImageComponent implements AfterViewInit {
  @Input() imageFormControl: FormControl;
  public image: string;
  @ViewChild('fileUploadAdd') fileUpload: ElementRef;

  constructor(private toastService: ToastService,
              private translateService: TranslateService,
              private cdr: ChangeDetectorRef) {
  }

  public ngAfterViewInit(): void {
    this.imageFormControl.setValue('');
    this.fileUpload.nativeElement.value = '';
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public handleFileInput(files: any): void {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      const fileName = files[0].name.split('.');
      if (!IMAGE_EXTENSION_TYPES.includes(fileName[fileName.length - 1].toLowerCase())) {
        this.toastService.showMessage(
          'warn',
          this.translateService.instant('t-toast.Failed'),
          this.translateService.instant('test-concept.error-extension')
        );
        return;
      }
      if (files[0].size > ONE_AND_HALF_MB_IN_BYTE) {
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
        this.image = reader.result as string;
        this.cdr.detectChanges();
        this.imageFormControl.setValue(this.image);
      };
    };
  }

  public removeImage(): void {
    this.image = null;
    this.imageFormControl.setValue('');
  }
}
