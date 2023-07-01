import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { IconsType } from 'src/app/shared/enums/icons.type';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss', '../../bic-container/bic-container.component.scss'],
})
export class PromptComponent {
  @Output() onChanged = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<boolean>();
  @ViewChild('prompt')
  prompt: ElementRef;

  public skipTest(): void {
    this.onChanged.emit();
  }

  public hidePrompt(): void {
    this.prompt.nativeElement.hidden = true;
    this.onClose.emit(false);
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }
}
