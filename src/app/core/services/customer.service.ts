import { delay, map, Observable, of } from 'rxjs';
import { Customer } from '../models/customer.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customersUrl = 'assets/data/customers.json';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<{ customers: Customer[] }>(this.customersUrl).pipe(
      // to display my loading state
      delay(1000),
      map((response) => response.customers)
    );
  }

  addCustomer(customer: Customer): Observable<Customer> {
    const newCustomer = {
      ...customer,
      createdDate: new Date().toISOString(),
    };
    return of(newCustomer);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return of(customer);
  }

  deleteCustomer(id: string): Observable<string> {
    return of(id);
  }

  getSelectedQuotesById(id: string): Observable<Customer[]> {
    return this.getCustomers().pipe(
      map((customers) => customers.filter((customer) => customer.id === id))
    );
  }
}
