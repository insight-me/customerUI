import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';
import { FormControl } from '@angular/forms';
import { HighlightTag } from './highlight-tag.interface';

@Component({
  selector: 'app-textarea-tags',
  templateUrl: './textarea-tags.component.html',
  styleUrls: ['./textarea-tags.component.scss', './text-input-highlight.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TextareaTagsComponent implements OnInit {
  @Input() public control: FormControl;

  @Input()
  public set highlightTexts(data: any[]) {
    this.$highlightTexts = data;
    this.addTags();
  }

  public get highlightTexts(): any[] {
    return this.$highlightTexts;
  }

  @ViewChild('op') $panel: OverlayPanel;

  tags: HighlightTag[] = [];
  target = {
    left: 0,
    top: 0,
  };

  tagClicked: HighlightTag;
  private $highlightTexts = [];

  ngOnInit(): void {
    this.addTags();
  }

  addTags(): void {
    this.tags = [];
    this.highlightTexts.forEach((highlight) => {
      const matchMentions = new RegExp('\\b' + highlight.text + '\\b', 'g');
      let mention;
      // tslint:disable-next-line
      while ((mention = matchMentions.exec(this.control.value.toLowerCase()))) {
        this.tags.push({
          indices: {
            start: mention.index,
            end: mention.index + mention[0].length,
          },
          improvements: highlight.improvements,
          data: mention[0],
        });
      }
    });
  }

  public addDarkClass(elm: HTMLElement): void {
    elm.classList.add('bg-blue-dark');
  }

  public removeDarkClass(elm: HTMLElement): void {
    elm.classList.remove('bg-blue-dark');
  }

  public tagClick(event: any): void {
    this.tagClicked = event.tag;
    this.target = {
      left:
        document.documentElement.clientWidth - 350 > event.target.offsetLeft
          ? event.target.offsetLeft
          : document.documentElement.clientWidth - 350,
      top: event.target.offsetTop,
    };
    this.$panel.toggle(event.event);
  }

  public onSelectAssociation(association: string): void {
    const currentTag = this.control.value.substr(
      this.tagClicked.indices.start,
      this.tagClicked.indices.end
    );
    const currentTagIsUpper = currentTag[0] === currentTag[0].toUpperCase();
    const newAssociation = currentTagIsUpper
      ? association
      : association.toLowerCase();
    const newText =
      this.control.value.substr(0, this.tagClicked.indices.start) +
      newAssociation +
      this.control.value.substr(
        this.tagClicked.indices.end,
        this.control.value.length
      );
    this.control.patchValue(newText);
    this.addTags();
    this.$panel.hide();
  }

  public onClickTextarea(): void {
    if (this.$panel.render) {
      this.$panel.hide();
    }
  }

  public trimValue(): void {
    this.control.setValue(this.control.value.trim());
  }
}
