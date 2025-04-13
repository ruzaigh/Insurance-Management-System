import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from '../reducers/customer.reducers';
export const selectCustomerState =
  createFeatureSelector<CustomerState>('customer');

export const selectAllCustomers = createSelector(
  selectCustomerState,
  (state: CustomerState) => {
    // If filteredCustomers exists and has customers use filteredCustomers
    if (state.filteredCustomers && state.filteredCustomers.length > 0) {
      return state.filteredCustomers;
    }
    // Otherwise return all customers
    return state.customers;
  },
);
