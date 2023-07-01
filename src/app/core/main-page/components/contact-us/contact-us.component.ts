import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomValidator } from '../../../../shared/validators/custom.validator';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { MeetingRequestModel } from '../../../../shared/models/landing/meeting.request.model';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { MeetingService } from '../../../../shared/services/landing/meeting.service';
import { exhaustMap, tap } from 'rxjs/operators';
import { LoadingService } from '../../../../shared/services/app-state/loader.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactUsComponent implements OnInit {
  public form: FormGroup = this.formBuilder.group({
    name: [
      null,
      [Validators.required, Validators.minLength(5), Validators.maxLength(50)],
    ],
    email: [null, [Validators.required, CustomValidator.emailValidator]],
    phone: [null, [Validators.required]],
  });

  public nameWithErrors$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public emailWithErrors$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public phoneWithErrors$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private request: Subject<MeetingRequestModel> =
    new Subject<MeetingRequestModel>();
  private sub: Subscription = new Subscription();
  private _imgUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private translateService: TranslateService,
    private meetingService: MeetingService
  ) {}

  public ngOnInit(): void {
    this.sub.add(
      this.request
        .asObservable()
        .pipe(
          exhaustMap((model: MeetingRequestModel) => this.sendRequest(model)),
          tap(() => {
            const details = this.translateService.instant(
              'landing.Your request has successfully been sent!'
            );
            this.toastService.showMessage('success', details, '');
            this.form.reset();
          })
        )
        .subscribe()
    );
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  public get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  public get phone(): FormControl {
    return this.form.get('phone') as FormControl;
  }

  public submit(): void {
    this.form.markAllAsTouched();
    this.nameChange();
    this.emailChange();
    this.phoneChange();
    if (this.form.invalid) {
      return;
    }
    this.request.next(this.form.value);
  }

  private sendRequest(
    model: MeetingRequestModel
  ): Observable<MeetingRequestModel> {
    model.phone = model.phone.toString();
    return this.meetingService.contactRequest(model);
  }

  public nameChange(): void {
    this.nameWithErrors$.next(this.name.touched && this.name.invalid);
  }

  public emailChange(): void {
    this.emailWithErrors$.next(this.email.touched && this.email.invalid);
  }

  public phoneChange(): void {
    this.phoneWithErrors$.next(this.phone.touched && this.phone.invalid);
  }
}
