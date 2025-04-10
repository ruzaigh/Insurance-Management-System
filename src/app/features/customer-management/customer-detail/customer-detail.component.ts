import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../../../core/models/customer.model';
import {
  deleteCustomer,
  updateCustomer,
  updateCustomerFailure,
  updateCustomerSuccess,
} from '../../../shared/store/actions/customer.actions';
@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
  public customerForm: FormGroup = new FormGroup({
    id: new FormControl({ value: '', disabled: true }),
    firstName: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    phone: new FormControl('', [
      Validators.pattern(/^\+?[0-9\s\-\(\)]{8,20}$/),
    ]),
    dateOfBirth: new FormControl(''),
    status: new FormControl('active'),
  });
  private subscription: Subscription = new Subscription();

  constructor(
    private store: Store,
    private actions$: Actions,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CustomerDetailComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { customer: Customer; mode: 'edit' | 'create' }
  ) {}

  ngOnInit(): void {
    if (this.data.customer) {
      // Subscribe to selected customer
      this.customerForm.patchValue({
        id: this.data.customer.id,
        firstName: this.data.customer.firstName,
        lastName: this.data.customer.lastName,
        phone: this.data.customer.phone,
        dateOfBirth: this.data.customer.dateOfBirth
          ? new Date(this.data.customer.dateOfBirth)
          : null,
      });

      // Subscribe to update success/failure
      this.subscription.add(
        this.actions$.pipe(ofType(updateCustomerSuccess)).subscribe(() => {
          this.snackBar.open('Customer updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
          this.dialogRef.close(true);
        })
      );

      this.subscription.add(
        this.actions$
          .pipe(ofType(updateCustomerFailure))
          .subscribe((action) => {
            this.snackBar.open(
              action.error || 'Failed to update customer',
              'Close',
              {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
                panelClass: ['error-snackbar'],
              }
            );
          })
      );
    }
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      // Show validation errors toast
      this.snackBar.open('Please fix the validation errors', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar'],
      });

      // Mark all fields as touched to trigger validation visuals
      this.markFormGroupTouched(this.customerForm);
      return;
    }

    // Create the customer object from form value
    // Include the id from the disabled control
    const updatedCustomer: Customer = {
      id: this.data.customer.id,
      ...this.customerForm.getRawValue(),
    };

    this.store.dispatch(updateCustomer({ customer: updatedCustomer }));
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }
  onDelete() {
    this.store.dispatch(deleteCustomer({ id: this.data.customer.id }));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
