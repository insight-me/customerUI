import { flatten } from '@angular/compiler';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { cloneDeep, differenceBy, omit } from 'lodash';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AddStatementAndAssociationDialogComponent } from 'src/app/shared/dialogs/add-statement-and-association-dialog/add-statement-and-association-dialog/add-statement-and-association-dialog.component';
import {
  Association,
  AssociationType,
  Test
} from 'src/app/shared/models/test.model';
import { ADD_ASSOCIATIONS } from 'src/assets/consts/add-elements-in-test-dialog';
import { DESKTOP_VERSION, MAX_ASSOCIATION, MOBILE_MINIMUM_VERSION } from 'src/assets/consts/consts';
import { BicContainerComponent } from '../../components/bic-container/bic-container.component';

const DESKTOP_ARROW_SHIFT = 42;
const MOBILE_ARROW_SHIFT = 90;

@Component({
  selector: 'app-section-three',
  templateUrl: './section-three.component.html',
  styleUrls: [
    './section-three.component.scss',
    '../../components/bic-container/bic-container.component.scss',
  ],
})
export class SectionThreeComponent
  extends BicContainerComponent
  implements OnInit, OnDestroy {
  public test: Test = null;
  public initTest: Test = null;
  public associations: Association[] = [];
  public allAssociations = [];
  public customAssociations = [];
  public recommendedAssociations = [];
  public isDisabledButton$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public isLimitExceeded$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public showAssociations = false;
  public editedAssociationIndex: number = null;
  public editedAssociation: Association = null;
  private lang = 'EN';
  public marketArrowShiftBetween = 41;
  public isTabletVersion = false;

  @HostListener('window:resize')
  private resize(): void {
    this._updateIsTablet();
  }

  public ngOnInit(): void {
    this._updateIsTablet();
    this.appStateService.language.subscribe((lang) => {
      this.lang = lang;
      if (lang !== 'EN' && this.test) {
        this.translateAssociations();
      }
    });
    this.currentRoute = this.route.snapshot.routeConfig.path;
    this.createTestService.nextRoute
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((route) => {
        if (route && route !== this.currentRoute && this.test) {
          this.goTo(route);
        }
      });
    this.getTest();
  }

  public ngOnDestroy(): void {
    if (this.compareTest()) {
      this.updateTest();
      this.bicTestService
        .updateTest(omit(this.test, ['respondentRequirements', 'concepts']))
        .subscribe((res) => {
          this.createTestService.currentTest$.next(res);
        });
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getIsDisabledButtons(): boolean {
    return this.isDisabledButton$.value;
  }

  public getIsLimitExceeded(): boolean {
    return this.isLimitExceeded$.value;
  }

  public checkNumberOfListAssociations(): void {
    if (this.allAssociations.length === this.associations.length) {
      this.isDisabledButton$.next(true);
    } else {
      this.isDisabledButton$.next(false);
    }
    this.changeDetectionRef.detectChanges();
  }

  public checkNumberOfAllAssociations(): void {
    const numberOfAllAssociations =
      this.associations.length + this.customAssociations.length;
    if (numberOfAllAssociations >= MAX_ASSOCIATION) {
      this.isLimitExceeded$.next(true);
      this.changeDetectionRef.detectChanges();
      return;
    }
    this.isLimitExceeded$.next(false);
    this.changeDetectionRef.detectChanges();
  }

  public get associationEnum(): typeof AssociationType {
    return AssociationType;
  }

  public get form(): FormGroup {
    return this.createTestService.form;
  }

  public addAssociation(): void {
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService.open(
        AddStatementAndAssociationDialogComponent,
        {
          showHeader: false,
          height: '100%',
          data: {
            allItems: differenceBy(
              this.allAssociations,
              this.associations,
              'id'
            ),
            associations: this.associations,
            dialogConfig: ADD_ASSOCIATIONS,
            maxItems:
              MAX_ASSOCIATION -
              (this.associations.length + this.customAssociations.length),
            max: MAX_ASSOCIATION,
          },
        }
      );
      ref.onClose.subscribe((res) => {
        if (res) {
          this.addAssociationFromList(res);
        }
      });
      this.dialogFactoryService.openDynamicDialogRefs.push(ref);
    }
  }

  public addAssociationFromList(association): void {
    this.associations = this.associations.concat(association);
    this.checkNumberOfAllAssociations();
    this.checkNumberOfListAssociations();
    this.updateTest();
    this.changeDetectionRef.detectChanges();
  }

  public removeAssociation(association: any): void {
    this.associations = this.associations.filter(
      (item) => item.id !== association.id
    );
    this.customAssociations = this.customAssociations.filter(
      (item) => item.value !== association.value
    );
    this.editedAssociationIndex = null;
    this.editedAssociation = null;
    this.updateTest();
    this.checkNumberOfListAssociations();
    this.checkNumberOfAllAssociations();
  }

  public updateCustomAssociations(list: any): void {
    this.form.controls.customAssociations.patchValue(
      this.removeNullOrEmpty(list)
    );
    this.customAssociations = list;
    this.updateTest();
    this.checkNumberOfAllAssociations();
  }

  public goTo(route: string): void {
    this.updateTest();
    if (this.compareTest()) {
      this.bicTestService
        .updateTest(omit(this.test, ['respondentRequirements', 'concepts']))
        .subscribe((res) => {
          this.createTestService.currentTest$.next(res);
          this.router.navigate([
            'personal-area/create-test/bic',
            this.createTestService.testId,
            route,
          ]);
        });
    } else {
      this.router.navigate([
        'personal-area/create-test/bic',
        this.createTestService.testId,
        route,
      ]);
    }
  }

  public getTest(): void {
    this.isDisabledButton$.next(false);
    this.changeDetectionRef.detectChanges();
    this.createTestService.test
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter((test) => test),
        tap((test: any) => {
          this.test = test;
          this.initTest = cloneDeep(test);
          this.createTestService.form.patchValue(test);
          this.associations = [...test.testAssociations];
          this.customAssociations = [...test.customAssociations];
          this.checkNumberOfAllAssociations();
          this.isDisabledButton$.next(true);
          this.changeDetectionRef.detectChanges();
        }),
        switchMap(() => {
          return this.getRecommendedAssociations();
        })
      )
      .subscribe((recommendedAssociations: any[][]) => {
        recommendedAssociations = flatten(recommendedAssociations);
        this.recommendedAssociations = recommendedAssociations;
        this.associations = this.getRecommendedAssociationsInTest(
          this.associations
        );
        this.getAssociations();
        this.showAssociations = true;
        this.changeDetectionRef.detectChanges();
      });
  }

  public isCustomAssociation(association: string): boolean {
    return (
      this.allAssociations.findIndex((assoc) => assoc.text === association) ===
      -1
    );
  }

  public openEditMode(index: number, association: Association): void {
    this.editedAssociationIndex = index;
    this.editedAssociation = association;
    this.changeDetectionRef.detectChanges();
  }

  public editAssociation(association: string): void {
    if (this.allAssociations.find((assoc) => assoc.text === association)) {
      this.removeAssociation(this.editedAssociation);
      this.associations.push(
        this.allAssociations.find((assoc) => assoc.text === association)
      );
    } else {
      this.removeAssociation(this.editedAssociation);
      this.customAssociations.push({ value: association });
    }
    this.cancelEditMode();
    this.updateTest();
  }

  public cancelEditMode(): void {
    this.editedAssociationIndex = null;
    this.editedAssociation = null;
  }

  private translateAssociations(): void {
    const associations = [];
    this.associations.forEach((item) => {
      const swedenAssociations = this.allAssociations.filter(
        (association) => association.id === item.id
      )[0];
      associations.push(swedenAssociations);
    });
    this.associations = associations;
  }

  private compareTest(): boolean {
    const res =
      differenceBy(
        this.test.testAssociations,
        this.initTest.testAssociations,
        'id'
      ).length ||
      differenceBy(
        this.initTest.customAssociations,
        this.test.customAssociations,
        'value'
      ).length ||
      differenceBy(
        this.test.customAssociations,
        this.initTest.customAssociations,
        'value'
      ).length ||
      differenceBy(
        this.initTest.testAssociations,
        this.test.testAssociations,
        'id'
      ).length;
    return res;
  }

  private updateTest(): void {
    this.test.testAssociations = this.associations;
    this.test.customAssociations = this.customAssociations;
    this.calcTimeService.calcTestBICTime(this.test);
  }

  private getRecommendedAssociationsInTest(
    associationsArray: Association[]
  ): Association[] {
    associationsArray = associationsArray.map((association) => {
      if (
        this.recommendedAssociations.find((item) => item === association?.id)
      ) {
        association.type = AssociationType.Recommended;
      }
      return association;
    });
    return associationsArray;
  }

  private getAssociations(): void {
    this.bicTestService.getAssociations().subscribe((associations) => {
      this.allAssociations =
        this.getRecommendedAssociationsInTest(associations);
      if (this.lang !== 'EN') {
        this.translateAssociations();
      }
      this.checkNumberOfListAssociations();
    });
  }

  private getRecommendedAssociations(): Observable<any> {
    return forkJoin(
      this.test.concepts.map((concept) => {
        if (concept?.consumerInsight?.toLowerCase().trim()) {
          return this.tagsService.getTags({
            text: concept.consumerInsight.toLowerCase().trim(),
          });
        } else {
          return of(false);
        }
      })
    );
  }

  private _updateIsTablet(): void {
    this.isTabletVersion = window.innerWidth <= DESKTOP_VERSION;
    this.marketArrowShiftBetween =
      window.innerWidth < MOBILE_MINIMUM_VERSION
        ? MOBILE_ARROW_SHIFT
        : DESKTOP_ARROW_SHIFT;
    this.changeDetectionRef.detectChanges();
  }
}
