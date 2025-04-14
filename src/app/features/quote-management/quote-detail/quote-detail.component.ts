import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Customer, Quote } from '../../../core/models/customer.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
  addQuote,
  addQuoteFailure,
  addQuoteSuccess,
  updateQuote,
  updateQuoteFailure,
  updateQuoteSuccess,
  deleteQuote,
} from '../../../shared/store/actions/quote.actions';
import * as CustomerSelectors from '../../../shared/store/selectors/customer.selectors';

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.scss'],
})
export class QuoteDetailComponent implements OnInit, OnDestroy {
  public quoteForm!: FormGroup;
  public customers$: Observable<Customer[]>;
  private subscription = new Subscription();

  public productTypes = [
    'Auto Insurance',
    'Home Insurance',
    'Life Insurance',
    'Health Insurance',
    'Business Insurance',
    'Travel Insurance',
  ];

  public statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<QuoteDetailComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      quote?: Quote;
      mode: 'edit' | 'create';
      customerId?: string;
    }
  ) {
    this.customers$ = this.store.select(CustomerSelectors.selectAllCustomers);
  }

  ngOnInit(): void {
    // Initialize the form
    this.initializeForm();

    if (this.data.quote && this.data.mode === 'edit') {
      this.populateForm();
    } else {
      if (this.data.customerId) {
        this.quoteForm.get('customerId')?.setValue(this.data.customerId);
        this.updateCustomerFullName(this.data.customerId);
      }

      // Subscribe to create success/failure
      this.subscription.add(
        this.actions$.pipe(ofType(addQuoteSuccess)).subscribe(() => {
          this.snackBar.open('Quote created successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
          this.dialogRef.close(true);
        })
      );

      this.subscription.add(
        this.actions$.pipe(ofType(addQuoteFailure)).subscribe((action) => {
          this.snackBar.open(
            action.error || 'Failed to create quote',
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

    // Update customer name when customer ID changes
    this.subscription.add(
      this.quoteForm.get('customerId')?.valueChanges.subscribe((customerId) => {
        if (customerId) {
          this.updateCustomerFullName(customerId);
        }
      })
    );
  }

  initializeForm(): void {
    const now = new Date();

    this.quoteForm = this.formBuilder.group({
      id: [
        {
          value: this.data.mode === 'create' ? uuidv4().slice(0, 4) : '',
          disabled: true,
        },
      ],
      customerId: ['', [Validators.required]],
      customerFullName: [{ value: '', disabled: true }],
      quoteAmount: [0, [Validators.required, Validators.min(0.01)]],
      quoteStatus: ['pending', [Validators.required]],
      productType: [this.productTypes[0], [Validators.required]],
      createdDate: [{ value: now.toISOString(), disabled: true }],
      notes: [''],
    });
  }

  populateForm(): void {
    if (!this.data.quote) return;

    const quote = this.data.quote;

    this.quoteForm.patchValue({
      id: quote.id,
      customerId: quote.customerId,
      customerFullName: quote.customerFullName,
      quoteAmount: quote.quoteAmount,
      quoteStatus: quote.quoteStatus,
      productType: quote.productType,
      createdDate: quote.createdDate,
      expiryDate: new Date(quote.expiryDate).toISOString().split('T')[0],
      notes: quote.notes,
    });

    // Subscribe to update success/failure
    this.subscription.add(
      this.actions$.pipe(ofType(updateQuoteSuccess)).subscribe(() => {
        this.snackBar.open('Quote updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
        this.dialogRef.close(true);
      })
    );

    this.subscription.add(
      this.actions$.pipe(ofType(updateQuoteFailure)).subscribe((action) => {
        this.snackBar.open(action.error || 'Failed to update quote', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      })
    );
  }

  updateCustomerFullName(customerId: string): void {
    this.subscription.add(
      this.customers$.subscribe((customers) => {
        const customer = customers.find((c) => c.id === customerId);
        if (customer) {
          this.quoteForm
            .get('customerFullName')
            ?.setValue(`${customer.firstName} ${customer.lastName}`);
        }
      })
    );
  }

  onSubmit(): void {
    if (this.quoteForm.invalid) {
      // Show validation errors toast
      this.snackBar.open('Please fix the validation errors', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar'],
      });

      // Mark all fields as touched to trigger validation visuals
      this.markFormGroupTouched(this.quoteForm);
      return;
    }

    const formValues = this.quoteForm.getRawValue();

    // Create quote object
    const quote: Quote = {
      id: this.data.quote?.id || formValues.id,
      customerId: formValues.customerId,
      customerFullName: formValues.customerFullName,
      quoteAmount: formValues.quoteAmount,
      quoteStatus: formValues.quoteStatus,
      productType: formValues.productType,
      createdDate: formValues.createdDate,
      expiryDate: formValues.expiryDate,
      notes: formValues.notes,
    };

    // Dispatch the appropriate action
    if (this.data.mode === 'create') {
      this.store.dispatch(addQuote({ quote }));
    } else {
      this.store.dispatch(updateQuote({ quote }));
    }
  }

  onDelete(): void {
    if (this.data.mode !== 'edit' || !this.data.quote) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: {
        heading: 'Warning',
        message: `Are you sure you want to delete this quote? This action cannot be undone.`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(deleteQuote({ id: this.data.quote!.id }));

        this.snackBar.open('Quote deleted successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });

        this.dialogRef.close({ deleted: true });
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
