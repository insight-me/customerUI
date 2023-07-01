import { AuthService } from '../services/auth/auth.service';
import { LocalStorageService } from '../services/app-state/local-storage.service';

export function appInitializer(
  authService: AuthService,
  localStorageService: LocalStorageService
): any {
  return localStorageService.get().refreshToken
    ? () =>
        new Promise((resolve) => {
          authService
            .refreshToken()
            .toPromise()
            .then((res) => {
              if (!res) {
                authService.resetUser();
              }
              resolve(true);
            })
            .catch((err) => {
              authService.resetUser();
              resolve(true);
            });
        })
    : () => null;
}
