import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Quote } from '../../core/models/quote.model';
import {
  deleteQuote,
  loadQuotes,
  loadSelectedCustomerQuotes,
} from '../../shared/store/actions/quote.actions';
import { selectAllQuotes } from '../../shared/store/selectors/quote.selectors';
import { QuoteDetailComponent } from './quote-detail/quote-detail.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quote-management',
  templateUrl: './quote-management.component.html',
  styleUrls: ['./quote-management.component.scss'],
})
export class QuoteManagementComponent implements OnInit, OnDestroy {
  public columnConfig: Array<{
    id: string;
    label: string;
    sortable?: boolean;
  }> = [
    { id: 'id', label: 'ID' },
    { id: 'customerFullName', label: 'Customer' },
    { id: 'quoteAmount', label: 'Amount' },
    { id: 'productType', label: 'Product Type' },
    { id: 'quoteStatus', label: 'Status' },
    { id: 'createdDate', label: 'Created Date' },
    { id: 'actions', label: 'Actions', sortable: false },
  ];

  public displayedColumns: string[] = this.columnConfig.map(
    (column) => column.id
  );
  public quoteListDataSource = new MatTableDataSource<Quote>([]);
  public isLoading = true;
  public statusFilter: string = '';
  private subscription = new Subscription();
  private customerQuoteId: string = '';
  skeletonData = Array(5)
    .fill({})
    .map(() => {
      const emptyCustomer: any = {};
      this.columnConfig.forEach((column) => {
        emptyCustomer[column.id] = '';
      });
      return emptyCustomer;
    });

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store,
    private liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.customerQuoteId = params['id'];
      })
    );

    if (!this.customerQuoteId) {
      this.store.dispatch(loadQuotes());
    } else {
      this.store.dispatch(
        loadSelectedCustomerQuotes({ id: this.customerQuoteId })
      );
    }

    this.subscription.add(
      this.store.select(selectAllQuotes).subscribe((quotes) => {
        this.quoteListDataSource.data = quotes;
        this.applyFilters();
        if (quotes.length > 0) {
          this.isLoading = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyStatusFilter(): void {
    this.applyFilters();
  }
  private async applyFilters() {
    if (this.statusFilter === 'reset') {
      await this.router.navigate(['/quotes']);
      window.location.reload();
    }
    this.quoteListDataSource.filter = this.statusFilter;
  }
  addQuote() {
    this.dialog.open(QuoteDetailComponent, {
      width: '600px',
      height: '80vh',
      data: { mode: 'create' },
    });
  }

  viewQuote(quote: Quote) {
    if (!quote || !quote.id) {
      this.snackBar.open('Quote information is not available', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.dialog.open(QuoteDetailComponent, {
      width: '600px',
      height: '80vh',
      data: { quote: quote, mode: 'edit' },
    });
  }

  deleteQuote(quote: Quote) {
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
        this.store.dispatch(deleteQuote({ id: quote!.id }));

        this.snackBar.open('Quote deleted successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
      }
    });
  }

  async announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      await this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      await this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  formatQuoteAmount(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  }

  viewCustomer(customerId: string) {
    //  navigate to the customer management section and display the customer
  }

  formatCellContent(element: any, columnId: string): string {
    if (columnId === 'quoteAmount') {
      return this.formatQuoteAmount(element[columnId]);
    } else if (columnId === 'createdDate') {
      return this.formatDate(element[columnId]);
    }
    return element[columnId];
  }
}
