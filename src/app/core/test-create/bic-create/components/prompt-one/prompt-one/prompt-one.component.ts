import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-prompt-one',
  templateUrl: './prompt-one.component.html',
  styleUrls: [
    './prompt-one.component.scss',
    '../../bic-container/bic-container.component.scss',
  ],
})
export class PromptOneComponent {
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  public closePrompt(): void {
    this.onClose.emit(false);
  }
}
