import { Customer } from './customer.model';

export interface Quote {
  id: string;
  customerId: string;
  customerFullName: string;
  quoteAmount: number;
  quoteStatus: 'pending' | 'approved' | 'rejected';
  createdDate: string;
  expiryDate: string;
  productType: string;
  notes?: string;
  customer?: Customer;
}
