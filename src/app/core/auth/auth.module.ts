import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth.routing';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmInviteComponent } from './confirm-invite/confirm-invite.component';
import { ResendEmailComponent } from './resend-email/resend-email.component';
import { RegistrationInitiationComponent } from './registration-initiation/registration-initiation.component';
import { ChangePasswordFormComponent } from './change-password-form/change-password-form.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ChangePasswordComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ConfirmInviteComponent,
    ResendEmailComponent,
    RegistrationInitiationComponent,
    ChangePasswordFormComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedComponentsModule,
    CheckboxModule,
    InputTextModule,
    DropdownModule,
  ],
})
export class AuthModule {}
