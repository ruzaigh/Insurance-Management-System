export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  addresses: Address[];
  createdDate: string;
}

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
}
