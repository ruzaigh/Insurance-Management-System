import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Address, Customer } from '../../../core/models/customer.model';
import {
  addCustomer,
  addCustomerFailure,
  addCustomerSuccess,
  deleteCustomer,
  updateCustomer,
  updateCustomerFailure,
  updateCustomerSuccess,
} from '../../../shared/store/actions/customer.actions';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
  customerForm: FormGroup;
  expandedAddresses: boolean[] = []; // Track which addresses are expanded
  private subscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CustomerDetailComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { customer: Customer; mode: 'edit' | 'create' }
  ) {
    // Initialize form with FormBuilder
    this.customerForm = this.formBuilder.group({
      id: [
        {
          value: this.data.customer?.id || uuidv4().slice(0, 4),
          disabled: true,
        },
      ],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, , Validators.email]],
      phone: [
        '',
        [Validators.required, , Validators.pattern(/^\+?[0-9\s\-\(\)]{8,20}$/)],
      ],
      dateOfBirth: ['', Validators.required],
      addresses: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    if (this.data.customer) {
      this.populateForm();
    } else {
      // If needed, add a default empty address
      this.addNewAddress();

      // Subscribe to create success/failure
      this.subscription.add(
        this.actions$.pipe(ofType(addCustomerSuccess)).subscribe(() => {
          this.snackBar.open('Customer created successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
          this.dialogRef.close(true);
        })
      );

      this.subscription.add(
        this.actions$.pipe(ofType(addCustomerFailure)).subscribe((action) => {
          this.snackBar.open(
            action.error || 'Failed to create customer',
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

  populateForm() {
    // Load customer data into form
    this.customerForm.patchValue({
      id: this.data.customer.id,
      firstName: this.data.customer.firstName,
      lastName: this.data.customer.lastName,
      email: this.data.customer.email,
      phone: this.data.customer.phone,
      dateOfBirth: this.data.customer.dateOfBirth
        ? new Date(this.data.customer.dateOfBirth)
        : null,
    });

    // Load addresses into form array
    if (
      this.data.customer.addresses &&
      this.data.customer.addresses.length > 0
    ) {
      // Make all addresses collapsed
      const initialExpandState = false;

      this.data.customer.addresses.forEach((address) => {
        this.addressesFormArray.push(this.createAddressFormGroup(address));
        this.expandedAddresses.push(initialExpandState);
      });

      // Always expand the primary address if it exists
      const primaryIndex = this.data.customer.addresses.findIndex(
        (a) => a.isPrimary
      );
      if (primaryIndex >= 0) {
        this.expandedAddresses[primaryIndex] = true;
      }
    }

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
      this.actions$.pipe(ofType(updateCustomerFailure)).subscribe((action) => {
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

  get addressesFormArray(): FormArray {
    return this.customerForm.get('addresses') as FormArray;
  }

  //get a specific address
  getAddressControl(
    addressIndex: number,
    controlName: string
  ): AbstractControl | null {
    return this.addressesFormArray.at(addressIndex)?.get(controlName) || null;
  }

  // Create a form group for an address
  createAddressFormGroup(address?: Address): FormGroup {
    return this.formBuilder.group({
      id: [address?.id || uuidv4()],
      street: [
        address?.street || '',
        [Validators.required, Validators.minLength(3)],
      ],
      city: [
        address?.city || '',
        [Validators.required, Validators.minLength(2)],
      ],
      state: [address?.state || '', [Validators.required]],
      postalCode: [
        address?.postalCode || '',
        [Validators.required, Validators.pattern(/^[0-9A-Za-z\s-]+$/)],
      ],
      country: [address?.country || '', [Validators.required]],
      isPrimary: [address?.isPrimary || false],
    });
  }

  // Add a new blank address
  addNewAddress() {
    // If this is the first address, make it primary by default
    const isPrimary = this.addressesFormArray.length === 0;

    const newAddressGroup = this.createAddressFormGroup({
      id: uuidv4(),
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isPrimary: isPrimary,
    });

    this.addressesFormArray.push(newAddressGroup);
    this.expandedAddresses.push(true); // Expand new address

    // Scroll to the new address form
    setTimeout(() => {
      const addressElements =
        document.getElementsByClassName('address-container');
      if (addressElements.length > 0) {
        const lastAddress = addressElements[addressElements.length - 1];
        lastAddress.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  toggleAddressExpansion(index: number) {
    this.expandedAddresses[index] = !this.expandedAddresses[index];
  }

  expandAllAddresses() {
    this.expandedAddresses = this.expandedAddresses.map(() => true);
  }

  collapseAllAddresses() {
    this.expandedAddresses = this.expandedAddresses.map(() => false);
  }

  deleteAddress(index: number) {
    const addressFormGroup = this.addressesFormArray.at(index) as FormGroup;
    const isPrimaryAddress = addressFormGroup.get('isPrimary')?.value;

    // Remove the address from the form array
    this.addressesFormArray.removeAt(index);

    // Remove from expanded array
    this.expandedAddresses.splice(index, 1);

    // If we deleted the primary address and there are other addresses, make one primary
    if (isPrimaryAddress && this.addressesFormArray.length > 0) {
      const firstAddressGroup = this.addressesFormArray.at(0) as FormGroup;
      firstAddressGroup.get('isPrimary')?.setValue(true);
    }

    this.snackBar.open('Address removed', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  // Handle primary address changes
  onPrimaryChange(index: number) {
    const isPrimary = this.addressesFormArray.at(index).get('isPrimary')?.value;

    if (isPrimary) {
      // loop over the other address and make them false
      for (let i = 0; i < this.addressesFormArray.length; i++) {
        if (i !== index) {
          this.addressesFormArray.at(i).get('isPrimary')?.setValue(false);
        }
      }
    }

    // make the selected address primary
    this.addressesFormArray.at(index).get('isPrimary')?.setValue(true);
  }

  onSubmit() {
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

    // Get the raw form values including disabled fields
    const formValues = this.customerForm.getRawValue();

    // format date
    let dateOfBirth = formValues.dateOfBirth;
    if (dateOfBirth instanceof Date) {
      dateOfBirth = dateOfBirth.toISOString().split('T')[0];
    }
    // Create the customer object from form value
    const updatedCustomer: Customer = {
      id: this.data.customer?.id || formValues.id,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email || this.data.customer.email,
      phone: formValues.phone,
      dateOfBirth: dateOfBirth,
      addresses: formValues.addresses,
      createdDate: this.data.customer?.createdDate || formValues.id,
    };

    // if mode is edit update the user
    if (this.data.mode === 'edit') {
      this.store.dispatch(updateCustomer({ customer: updatedCustomer }));
    } else {
      this.store.dispatch(addCustomer({ customer: updatedCustomer }));
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      // loop through all the controls an mark them as touched
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((c) => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          } else {
            c.markAsTouched();
          }
        });
      }
    });
  }

  onDelete() {
    // display the confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: {
        heading: 'Warning',
        message: `Are you sure you want to delete ${this.data.customer.firstName} ${this.data.customer.lastName}? This action cannot be undone.`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User confirmed deletion
        this.store.dispatch(deleteCustomer({ id: this.data.customer.id }));
        this.snackBar.open('Customer successfully deleted', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });

        this.dialogRef.close(true);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
