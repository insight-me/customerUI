import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TreeMultiselectOptionsModel } from '../../../../shared/models/tree.multiselect.options.model';
import { BehaviorSubject } from 'rxjs';
import {filter, first, tap} from 'rxjs/operators';

@Component({
  selector: 'app-tree-multiselect',
  templateUrl: './tree-multiselect.component.html',
  styleUrls: ['./tree-multiselect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeMultiselectComponent implements OnChanges {
  @Input() public options: TreeMultiselectOptionsModel[];
  @Input() public control: FormControl;
  @Input() public defaultLabel: string;

  public selected: {[key: string]: boolean} = {};

  private changeState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Output() public onChange: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('ref') public ref: ElementRef;

  constructor() { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.options && changes.options.currentValue) {
      this.options.forEach(option => {
        this.selected[option.value] = option.items.every(item => this.control.value.includes(item.value));
      });
    }
  }

  public toggleGroup(groupId: string): void {
    const currentValue = this.selected[groupId];
    /*all children*/
    const allChildren = this.options.find(({value}) => value === groupId).items.map(({value}) => value);
    /*current control value*/
    let controlValue = (this.control.value as string[]) || [];
    if (currentValue) {
      /*add value if it is not selected*/
      allChildren.forEach(item => !controlValue.includes(item) && controlValue.push(item));
    } else {
      /*remove value if it is selected*/
      controlValue = controlValue.filter(item => !allChildren.includes(item));
    }

    const pMultiselectPanel = this.ref.nativeElement.getElementsByClassName('p-multiselect-panel');
    const pMultiselect = this.ref.nativeElement.getElementsByClassName('p-multiselect');
    pMultiselectPanel[0].style.minWidth = this.ref.nativeElement.clientWidth + 'px';
    pMultiselect[0].style.minWidth = this.ref.nativeElement.clientWidth + 'px';
    this.ref.nativeElement.parentNode.style.width = this.ref.nativeElement.clientWidth + 'px';
    this.ref.nativeElement.style.position = 'fixed';
    this.ref.nativeElement.style.zIndex = 1001;

    this.control.setValue(controlValue);
    this.changeState.next(true);

    setTimeout(() => {
      this.ref.nativeElement.style.position = 'static';
      this.ref.nativeElement.style.zIndex = 1;
      pMultiselectPanel[0].style.minWidth = 'none';
      pMultiselect[0].style.minWidth = 'none';
      this.ref.nativeElement.parentNode.style.width = '100%';
    }, 0);
  }

  public multiSelectChange(ev): void {
    if (!ev.itemValue) {
      /*it is toggled all event*/
      Object.keys(this.selected).forEach(item => this.selected[item] = !!ev.value.length);
    } else {
      /*it is toggled one item event*/
      const group = this.options.find(group => group.items.map(({value}) => value).includes(ev.itemValue));
      /*if all children from group are selected - mark parent also as selected and vice versa*/
      this.selected[group.value] = group.items.every(item => ev.value.includes(item.value));
    }
    this.changeState.next(true);
  }

  public onPanelHide(): void {
    this.changeState.asObservable()
      .pipe(
        first(),
        filter(val => !!val),
        tap(() => {
          this.onChange.next();
          this.changeState.next(false);
        })
      )
      .subscribe()
  }

}
