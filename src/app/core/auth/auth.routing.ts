import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ConfirmInviteComponent } from './confirm-invite/confirm-invite.component';
import { ResendEmailComponent } from './resend-email/resend-email.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'password-recovery',
        component: ChangePasswordComponent,
      },
      /** Registration enabled */
      // {
      //   path: 'register',
      //   component: RegisterComponent,
      // },
      /** Registration disabled */
      {
        path: 'register',
        redirectTo: '/',
      },
      {
        path: 'confirm-invite',
        component: ConfirmInviteComponent,
      },
      {
        path: 'resend-email',
        component: ResendEmailComponent,
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
