import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteDetailComponent } from './quote-detail/quote-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { QuoteManagementRoutingModule } from './quote-management-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { QuoteManagementComponent } from './quote-management.component';

@NgModule({
  declarations: [QuoteDetailComponent, QuoteManagementComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuoteManagementRoutingModule,
    SharedModule,
    MatMenuModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
})
export class QuoteManagementModule {}
