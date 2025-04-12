import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { SearchComponent } from './components/search/search.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ConfirmDialogComponent, SearchComponent],
  imports: [CommonModule, MatIconModule, MatDialogModule, MatButtonModule],
})
export class SharedModule {}
