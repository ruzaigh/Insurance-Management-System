import { Customer } from '../../../core/models/customer.model';
import { createReducer, on } from '@ngrx/store';
import * as CustomerActions from '../actions/customer.actions';
export interface CustomerState {
  customers: Customer[];
}

export const initialCustomerState: CustomerState = {
  customers: [],
};

export const customerReducer = createReducer(
  initialCustomerState,

  on(CustomerActions.loadCustomers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CustomerActions.loadCustomersSuccess, (state, { customers }) => ({
    ...state,
    customers,
    loading: false,
  })),

  on(CustomerActions.addCustomerSuccess, (state, { customer }) => ({
    ...state,
    customers: [...state.customers, customer],
  })),

  on(CustomerActions.updateCustomerSuccess, (state, { customer }) => ({
    ...state,
    customers: state.customers.map((c) =>
      c.id === customer.id ? customer : c
    ),
  }))
);
