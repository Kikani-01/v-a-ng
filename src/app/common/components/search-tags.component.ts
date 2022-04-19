import { Component, Output, Input, DoCheck, EventEmitter } from '@angular/core';
import { Search } from '../search';

@Component({
  templateUrl: './search-tags.component.html',
  selector: 'app-search-tags',
})
export class SearchTagsComponent implements DoCheck {
  public operators: string[] = [];
  public fields: any = {};

  @Input()
  public search: Search<any> | any;

  @Input()
  public hiddenFields: string[] = [];

  @Input()
  public labels: any = {};

  @Input()
  public values: any = {};

  @Output() cancel = new EventEmitter<any>();

  constructor() {}

  ngDoCheck(): void {
    if (this.search) {
      this.operators = Object.keys(this.search);
      for (let o = 0; o < this.operators.length; o++) {
        const operator = this.operators[o];
        this.fields[operator] = Object.keys(this.search[operator]);
      }
    }
  }

  public remove(operator: string, field: string): void {
    this.search[operator][field] = null;
    this.cancel.emit();
  }
}
