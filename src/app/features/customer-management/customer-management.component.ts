import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Customer } from '../../core/models/customer.model';
import {
  deleteCustomer,
  loadCustomers,
  loadCustomersFailure,
  selectedCustomer,
} from '../../shared/store/actions/customer.actions';
import { selectAllCustomers } from '../../shared/store/selectors/customer.selectors';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { CustomerQuotesComponent } from './customer-quotes/customer-quotes.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  columnConfig: Array<{
    id: string;
    label: string;
    sortable?: boolean;
  }> = [
    { id: 'id', label: 'Id' },
    { id: 'firstName', label: 'First Name' },
    { id: 'lastName', label: 'Last Name' },
    { id: 'phone', label: 'Phone Number' },
    { id: 'dateOfBirth', label: 'Date of birth' },
    { id: 'addresses', label: 'Address' },
    { id: 'actions', label: 'Actions', sortable: false },
  ];

  displayedColumns: string[] = this.columnConfig.map((column) => column.id);
  public isLoading = false;

  public customerListDataSource = new MatTableDataSource<Customer>([]);
  skeletonData = Array(5)
    .fill({})
    .map(() => {
      const emptyCustomer: any = {};
      this.columnConfig.forEach((column) => {
        emptyCustomer[column.id] = '';
      });
      return emptyCustomer;
    });
  private customerId: string = '';
  private subscription: Subscription = new Subscription();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store,
    private actions$: Actions,
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {}
  ngAfterViewInit() {
    this.customerListDataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.isLoading = true;

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.customerId = params['id'];
      })
    );

    if (!this.customerId) {
      this.store.dispatch(loadCustomers());
    } else {
      this.store.dispatch(selectedCustomer({ id: this.customerId }));
    }
    this.subscription.add(
      this.store.select(selectAllCustomers).subscribe((customers) => {
        this.customerListDataSource.data = customers;
        if (customers.length > 0) {
          this.isLoading = false;
        }
      })
    );

    this.subscription.add(
      this.actions$.pipe(ofType(loadCustomersFailure)).subscribe(() => {
        this.isLoading = false;
      })
    );
  }

  viewUser(customer: Customer) {
    if (!customer || !customer.id) {
      this.snackBar.open('Customer information is not available', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.dialog.open(CustomerDetailComponent, {
      width: '600px',
      height: '80vh',
      data: { customer: customer, mode: 'edit' },
    });
  }
  deleteCustomer(customer: Customer) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: {
        heading: 'Warning',
        message: `Are you sure you want to delete ${customer.firstName} ${customer.lastName}? This action cannot be undone.`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      },
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        // User confirmed deletion
        this.store.dispatch(deleteCustomer({ id: customer.id }));
        this.snackBar.open('Customer successfully deleted', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
      }
    });
  }

  viewCustomerQuotes(customer: Customer) {
    this.dialog.open(CustomerQuotesComponent, {
      width: '600px',
      data: { customer },
    });
  }

  getLatestAddress(addresses: any[]): string {
    if (!addresses || addresses.length === 0) {
      return '';
    }

    const latestAddress = addresses[addresses.length - 1];

    return latestAddress.street
      ? `${latestAddress.street}, ${latestAddress.city || ''} ${
          latestAddress.zipCode || ''
        }`
      : JSON.stringify(latestAddress);
  }

  async announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      await this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      await this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  addCustomer() {
    this.dialog.open(CustomerDetailComponent, {
      width: '600px',
      height: '80vh',
      data: { mode: 'create' },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
