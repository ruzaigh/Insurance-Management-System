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

  on(CustomerActions.loadCustomersSuccess, (state, { customers }) => ({
    ...state,
    customers,
  })),

  on(CustomerActions.addCustomerSuccess, (state, { customer }) => ({
    customers: [customer, ...state.customers],
  })),

  on(CustomerActions.deleteCustomerSuccess, (state, { id }) => ({
    ...state,
    customers: state.customers.filter((c) => c.id !== id),
  })),
  on(CustomerActions.updateCustomerSuccess, (state, { customer }) => ({
    ...state,
    customers: state.customers.map((c) =>
      c.id === customer.id ? customer : c
    ),
  }))
);
