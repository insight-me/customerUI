import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ListboxModule } from 'primeng/listbox';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';

const primeng = [
  InputTextModule,
  InputTextareaModule,
  DropdownModule,
  MultiSelectModule,
  InputSwitchModule,
  ListboxModule,
  TooltipModule,
  TableModule,
  TreeTableModule,
  RadioButtonModule,
  InputNumberModule,
]

@NgModule({
  imports: [primeng],
  exports: [primeng]
})
export class PrimengModule {
}
