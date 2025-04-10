import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import {
  loadCustomers,
  loadCustomersFailure,
} from '../../../shared/store/actions/customer.actions';
import { Customer } from '../../../core/models/customer.model';
import { Subscription } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { selectAllCustomers } from '../../../shared/store/selectors/customer.selectors';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit, OnDestroy, AfterViewInit {
  columnConfig: Array<{
    id: string;
    label: string;
  }> = [
    { id: 'id', label: 'Id' },
    { id: 'firstName', label: 'First Name' },
    { id: 'lastName', label: 'Last Name' },
    { id: 'phone', label: 'Phone Number' },
    { id: 'dateOfBirth', label: 'Date of birth' },
    { id: 'addresses', label: 'Address' },
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
  private subscription: Subscription = new Subscription();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store,
    private actions$: Actions,
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  ngAfterViewInit() {
    this.customerListDataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.store.dispatch(loadCustomers());
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
        // Optionally handle error state here
      })
    );
  }

  viewUser(row: Customer) {
    if (!row || !row.id) {
      this.snackBar.open('Customer information is not available', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
      return;
    }

    const dialogRef = this.dialog.open(CustomerDetailComponent, {
      width: '600px',
      data: { customer: row, mode: 'edit' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(loadCustomers());
      }
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
