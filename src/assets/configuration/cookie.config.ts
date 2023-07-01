import { NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { environment } from '../../environments/environment';

export const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: environment.cookieDomain,
    expiryDays: 364,
  },
  position: 'bottom',
  theme: 'classic',
  palette: {
    popup: {
      background: '#3c3768',
      text: '#ffffff',
      link: '#ffffff'
    },
    button: {
      background: '#ff9859',
      text: '#ffffff',
      border: 'transparent'
    }
  },
  type: 'opt-out',
  content: {
    message: 'This website uses cookies to ensure you get the best experience on our website.',
    dismiss: 'Got it!',
    allow: 'Allow cookies',
    deny: 'Refuse cookies',
    link: 'Learn more',
    href: '/privacy-policy',
    policy: 'Privacy Policy'
  }
};
