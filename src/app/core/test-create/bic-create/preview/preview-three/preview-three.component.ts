import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BicTestService } from '../../../../../shared/services/bic-test/bic-test.service';

@Component({
  selector: 'app-preview-three',
  templateUrl: './preview-three.component.html',
  styleUrls: ['./preview-three.component.scss']
})
export class PreviewThreeComponent implements OnDestroy {
  @Input()
  public set test(test: any) {
    if (test?.testAssociations?.length || test?.customAssociations?.length) {
      this.$test = test;
      this.getAssociations();
    }
  }

  public get test(): any {
    return this.$test;
  }


  public associations: any[];
  private $test: any;
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private bicTestService: BicTestService) {
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getAssociations(): void {
    const lang = JSON.parse(localStorage.getItem('language'));
    this.associations = this.test.testAssociations;
    this.associations = this.associations.concat(this.test.customAssociations);
    this.associations = this.associations
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
    if (lang !== 'EN') {
      this.bicTestService.getAssociations(localStorage.getItem('previewLanguage') ?? undefined)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((associations) => {
          const allAssociations = associations;
          const assoc = [];
          this.test.testAssociations.forEach((item) => {
            const swedenAssociations = allAssociations.filter((association) => association.id === item.id)[0];
            assoc.push(swedenAssociations);
          });
          this.associations = assoc.concat(this.test.customAssociations);
        });
    }
  }

}
