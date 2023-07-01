import { PaymentTypes } from '../../app/shared/models/payment.model';

export const PAYMENT_TYPES: PaymentTypes[] = [
  {
    id: 1,
    label: 'Invoice',
  },
  {
    id: 2,
    label: 'Card',
    cards: ['visa', 'master-card', 'american-express', 'china-union-pay'],
  },
];
