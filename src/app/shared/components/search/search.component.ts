import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  searchCustomers,
  searchCustomersSuccess,
} from '../../store/actions/customer.actions';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = 'Search...';
  public debounceMs: number = 300;
  public searchControl = new FormControl('');
  private subscription: Subscription = new Subscription();
  public isLoading = false;
  constructor(
    private store: Store,
    private actions$: Actions,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.searchControl.valueChanges
        .pipe(debounceTime(this.debounceMs), distinctUntilChanged())
        .subscribe((value) => {
          this.isLoading = true;
          this.store.dispatch(searchCustomers({ searchTerm: value || '' }));
        }),
    );

    this.subscription.add(
      this.actions$.pipe(ofType(searchCustomersSuccess)).subscribe(() => {
        this.isLoading = false;
      }),
    );
  }
  clearSearch(): void {
    this.searchControl.setValue('');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
