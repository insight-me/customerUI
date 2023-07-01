import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCreateRouting } from './test-create.routing';
import { TestCreateContainerComponent } from './components/test-create-container/test-create-container.component';
import { TestCreationComponentsModule } from '../../shared/test-creation-components/test-creation-components.module';

@NgModule({
  declarations: [ TestCreateContainerComponent ],
  imports: [
    CommonModule,
    TestCreateRouting,
    TestCreationComponentsModule,
  ]
})
export class TestCreateModule {
}
