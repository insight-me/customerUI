import { Injectable } from '@angular/core';
import { Tokens } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private accessKey = 'accessToken';
  private refreshKey = 'refreshToken';

  public set(tokens: Tokens): void {
    localStorage.setItem(this.accessKey, tokens.accessToken);
    localStorage.setItem(this.refreshKey, tokens.refreshToken);
  }

  public get(): Tokens {
    return {
      accessToken: localStorage.getItem(this.accessKey),
      refreshToken: localStorage.getItem(this.refreshKey),
    };
  }

  public remove(): void {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
  }
}
