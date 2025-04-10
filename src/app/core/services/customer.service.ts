import { catchError, delay, map, Observable, of } from 'rxjs';
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
      delay(1000),
      map((response) => response.customers),
      catchError(this.handleError<Customer[]>('getCustomers', []))
    );
  }

  getCustomerById(id: string): Observable<Customer | undefined> {
    return this.getCustomers().pipe(
      map((customers) => customers.find((customer) => customer.id === id)),
      catchError(this.handleError<Customer | undefined>(`getCustomer id=${id}`))
    );
  }

  addCustomer(customer: Customer): Observable<Customer> {
    // In a real app, this would be an HTTP POST
    // Here we're just returning the customer with a new ID
    const newCustomer = {
      ...customer,
      id: customer.id,
      createdDate: customer.createdDate || new Date().toISOString(),
    };
    return of(newCustomer);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    // In a real app, this would be an HTTP PUT
    return of(customer);
  }

  deleteCustomer(id: string): Observable<string> {
    // In a real app, this would be an HTTP DELETE
    return of(id);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
