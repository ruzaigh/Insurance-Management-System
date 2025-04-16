import { createAction, props } from '@ngrx/store';
import { Customer } from '../../../core/models/customer.model';
import { Quote } from '../../../core/models/quote.model';

export const loadCustomers = createAction('[Customer] Load Customers');
export const loadCustomersSuccess = createAction(
  '[Customer] Load Customers Success',
  props<{ customers: Customer[] }>()
);
export const loadCustomersFailure = createAction(
  '[Customer] Load Customers Failure',
  props<{ error: any }>()
);

export const addCustomer = createAction(
  '[Customer] Add Customer',
  props<{ customer: Customer }>()
);
export const addCustomerSuccess = createAction(
  '[Customer] Add Customer Success',
  props<{ customer: Customer }>()
);

export const addCustomerFailure = createAction(
  '[Customer] Add Customer Failure',
  props<{ error: any }>()
);

export const updateCustomer = createAction(
  '[Customer] Update Customer',
  props<{ customer: Customer }>()
);
export const updateCustomerSuccess = createAction(
  '[Customer] Update Customer Success',
  props<{ customer: Customer }>()
);

export const updateCustomerFailure = createAction(
  '[Customer] Update Customers Failure',
  props<{ error: any }>()
);

export const deleteCustomer = createAction(
  '[Customer] Delete Customer',
  props<{ id: string }>()
);
export const deleteCustomerSuccess = createAction(
  '[Customer] Delete Customer Success',
  props<{ id: string }>()
);
export const deleteCustomerFailure = createAction(
  '[Customer] Delete Customer Failure',
  props<{ error: any }>()
);

export const searchCustomers = createAction(
  '[Customer] Search Customers',
  props<{ searchTerm: string }>()
);

export const searchCustomersSuccess = createAction(
  '[Customer] Search Customers Success',
  props<{ searchTerm: string }>()
);

export const selectedCustomer = createAction(
  '[Customer] Selected Customer ',
  props<{ id: string }>()
);

export const selectedCustomerSuccess = createAction(
  '[Customer] Selected Customer Success',
  props<{ customer: Customer[] }>()
);

export const selectedCustomerFailure = createAction(
  '[Customer] Selected Customer Failure',
  props<{ error: any }>()
);
