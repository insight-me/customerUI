import { Component, Input } from '@angular/core';
import { CustomTranslateService } from 'src/app/shared/services/custom-translate.service';

@Component({
  selector: 'app-preview-one',
  templateUrl: './preview-one.component.html',
  styleUrls: ['./preview-one.component.scss'],
})
export class PreviewOneComponent {
  @Input() public concept: any;
  @Input() public test?: any;
  @Input() public showText = true;
  @Input() public showImages = true;
  @Input() public isHideHeader = false;

  get translations(): Record<string, any> {
    return this._customTranslateService.translations;
  }

  constructor(private _customTranslateService: CustomTranslateService) { }

  public getConsumerInsight(text: string): string[] {
    return text?.trim().split('\n');
  }

  public getBenefits(): string {
    if (this.concept) {
      const benefits = [];
      this.concept.benefits.forEach((benefit) => {
        const benefitTrim = benefit.value.trim();
        if (benefitTrim[benefitTrim.length - 1] === '.') {
          benefits.push(
            benefitTrim[0].toUpperCase() +
            benefitTrim.slice(1, benefitTrim.length - 1)
          );
        } else {
          benefits.push(benefitTrim[0].toUpperCase() + benefitTrim.slice(1));
        }
      });
      const result = benefits.join('. ');
      return result[0].toUpperCase() + result.slice(1) + '.';
    }
  }

  public getReason(reason: string): string {
    const reasonTrim = reason.trim();
    if (reasonTrim[reasonTrim.length - 1] === '.') {
      return reasonTrim[0].toUpperCase() + reasonTrim.slice(1);
    } else {
      return reasonTrim[0].toUpperCase() + reasonTrim.slice(1) + '.';
    }
  }

  public getTextForLikesDislikes(isSubtext: boolean): string {
    if (
      this.showText &&
      (this.test.wordsLikesEnabled ||
        this.concept.benefits.length ||
        this.concept.reasons.length) &&
      this.showImages &&
      this.concept.moodboard?.items.length
    ) {
      return isSubtext
        ? 'preview.Please give your feedback on at least three words and at least one of the images. Once you click on a word or image you will be able to give a thumb up or down depending on your feedback.'
        : 'preview.Now we would like to understand what words of the idea description that you like and dislike. We would also like to understand what images in the moodboard that you like and dislike.';
    }
    if (
      this.showText &&
      (this.test.wordsLikesEnabled ||
        this.concept.benefits.length ||
        this.concept.reasons.length)
    ) {
      return isSubtext
        ? 'preview.Please give your feedback on at least three words. Once you click on a word you will be able to give a thumb up or down depending on your feedback.'
        : 'preview.Now we would like to understand what words of the idea description that you like and dislike.';
    }
    if (this.showImages && this.concept.moodboard?.items.length) {
      return isSubtext
        ? 'preview.Please give your feedback on at least one of the images. Once you click on an image you will be able to give a thumb up or down depending on your feedback.'
        : 'preview.Now we would like to understand what images in the moodboard that you like and dislike.';
    }
  }
}
