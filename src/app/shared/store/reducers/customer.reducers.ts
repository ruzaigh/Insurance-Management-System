import { Customer } from '../../../core/models/customer.model';
import { createReducer, on } from '@ngrx/store';
import * as CustomerActions from '../actions/customer.actions';
export interface CustomerState {
  customers: Customer[];
  filteredCustomers?: Customer[];
}

export const initialCustomerState: CustomerState = {
  customers: [],
  filteredCustomers: [],
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
  })),
  on(CustomerActions.searchCustomersSuccess, (state, { searchTerm }) => {
    const term = searchTerm.toLowerCase().trim();

    // If search term is empty, don't filter
    if (!term) {
      return {
        ...state,
        filteredCustomers: [],
      };
    }

    // Filter customers based on search term on ( firstName, lastName )
    const filteredCustomers = state.customers.filter(
      (customer) =>
        customer.firstName.toLowerCase().includes(term) ||
        customer.lastName.toLowerCase().includes(term)
    );

    return {
      ...state,
      filteredCustomers,
    };
  }),
  on(CustomerActions.selectedCustomerSuccess, (state, { customer }) => {
    return {
      ...state,
      customers: customer,
    };
  })
);
