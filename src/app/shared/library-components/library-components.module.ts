import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryItemStatusComponent } from './library-item-status/library-item-status.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [LibraryItemStatusComponent],
  exports: [
    LibraryItemStatusComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ]
})
export class LibraryComponentsModule { }
