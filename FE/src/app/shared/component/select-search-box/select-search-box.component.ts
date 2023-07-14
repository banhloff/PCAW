import { CommonUtils } from './../../services/common-utils.service';
import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, debounceTime, tap, map } from 'rxjs/operators';
// const _ = require('lodash/array');

export interface SelectSearchService {
  selectionSearch: (
    page: any,
    size: any,
    condition: string,
    bonusCondition?: string
  ) => Observable<any>;
}
export interface SelectSearchServiceCS {
  selectionSearchs: (
    page: any,
    size: any,
    condition: string,
    bonusCondition?: string
  ) => Observable<any>;
}

export interface SelectSearchServiceCSS {
  selectionSearchss: (
    page: any,
    size: any,
    condition: string,
    bonusCondition?: string
  ) => Observable<any>;
}

export interface SelectSearchServices {
  selectionSearchs: (
    page: any,
    size: any,
    condition: string,
    bonusCondition?: string
  ) => Observable<any>;
}


export class BufferData {
  private full: boolean;
  items: any[] = [];
  constructor(items?: any[], full?: boolean) {
    if (status) {
      this.full = full;
    }
    if (items) {
      this.items = items;
    }
  }
  markAsFull(): void {
    this.full = true;
  }
  isFull(): boolean {
    return this.full;
  }
}

const DEFAULT_SIZE_API = 50;
@Component({
  selector: 'select-search',
  templateUrl: './select-search-box.component.html',
  styleUrls: ['./select-search-box.component.scss'],
})
export class SelectSearchBoxComponent implements OnInit, OnChanges {
  dataSource: any[] = [];
  loading = false;
  searchInput$ = new Subject<string>();
  @Input() name = "";
  @Input() fetchAll = false;
  @Input() check = true;
  @Input() isReadonly = false;
  @Input() placeholder = 'Chọn';
  @Input() notFoundText = 'Không có bản ghi';
  @Input() typeToSearchText = 'Nhập giá trị tìm kiếm';
  @Input() service: SelectSearchService;
  @Input() inputLabel: string;
  @Input() inputValue: string;
  @Input() inputControl: FormControl;
  @Output() changeEvent: EventEmitter<any> = new EventEmitter();
  currentPage = 1;
  apiSize: number = DEFAULT_SIZE_API;
  condition = '';
  @Input() firstSearchCondition: any;
  @Input() bonusCondition: any;
  @Input() clearable = true;
  @Input() appendTo = '';
  @Input() maxSelectedItems: number ;
  firstSearchConditionUpdated = false;
  // in case you want to add fixed item in dataSource
  @Input() fixedItem: any[];
  bufferMap: Map<string, BufferData>;
  firstSearchItem: any;
  detectFirstSearchItem = false;
  detectFirstChange = false;
  fetchingNew = false;
  @Input() multiple = false;
  @Input() searchFn: (
    page: any,
    size: any,
    condition: string,
    bonusCondition?: string
  ) => Observable<any>;
  // attached firstItem only one time
  attached = false;
  @Input() loadOnInit = false;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
  @ContentChild('selectOption', { static: false })
  selectOption: TemplateRef<any>;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    /* only use for single select */
    if (!this.multiple) {
      if (
        changes['firstSearchCondition'] &&
        !this.firstSearchConditionUpdated &&
        !this.detectFirstChange
      ) {
        const currentValue = changes['firstSearchCondition'].currentValue;
        if (currentValue !== '' && currentValue !== null && currentValue !== undefined) {
          this.loading = true;
          if (this.bonusCondition) {
            this.searchFn(
              1,
              this.apiSize,
              this.firstSearchCondition,
              this.bonusCondition
            ).subscribe(data => {
              this.setFirstSearchCondition(data);
            });
          } else {
            this.searchFn(1, this.apiSize, this.firstSearchCondition).subscribe(data => {
              this.setFirstSearchCondition(data);
            });
          }
        }
      }
    }
    if (changes['bonusCondition']) {
      if (!CommonUtils.isNullOrEmpty(changes['bonusCondition'].currentValue)) {
        if (!this.fetchAll) {
          this.bufferMap = new Map<string, BufferData>();
          this.fetchNew();
        } else {
          this.fetchAllData();
        }
      }
    }
  }

  ngOnInit() {
    if (this.fixedItem && this.fixedItem.length >= 1) {
      this.dataSource = [...this.fixedItem, ...this.dataSource];
    }
    if (!this.fetchAll) {
      this.searchInput$.pipe(distinctUntilChanged(), debounceTime(800)).subscribe(newTerm => {
        if (newTerm !== null && newTerm !== undefined) {
          this.condition = newTerm.trim();
          this.fetchNew();
        }
      });
      if(this.loadOnInit) {
        this.fetchNew();
      }
    } else {
      this.fetchAllData();
    }
  }

  onScrollToEnd() {
    // error not fire
  }

  onScroll(event:any) {
    if (!this.fetchAll) {
      if (this.loading) {
        return;
      }
      if (this.dataSource && event.end > 1 && event.end === this.dataSource.length) {
        this.fetchMore();
      }
    }
  }

  setConditionDefault() {
    if (this.condition === null || this.condition === undefined) this.condition = '';
  }

  fetchData(page: number) {
    this.setConditionDefault();
    if (CommonUtils.isNullOrEmpty(this.bonusCondition)) {
      return this.searchFn(page, this.apiSize, this.condition).pipe(
        map(data => {
          this.bufferingData(this.condition, data.data.items);
          return Object.assign({}, data);
        }),
        tap(data => {
          if (!this.multiple) {
            this.findFirstSearchItem(data);
          }
        })
      );
    } else {
      return this.searchFn(page, this.apiSize, this.condition, this.bonusCondition).pipe(
        map(data => {
          this.bufferingData(this.condition, data.data.items);
          return Object.assign({}, data);
        }),
        tap(data => {
          if (!this.multiple) {
            this.findFirstSearchItem(data);
          }
        })
      );
    }
  }

  fetchAllData() {
    this.setConditionDefault();
    if (CommonUtils.isNullOrEmpty(this.bonusCondition)) {
      return this.searchFn(1, 500, '').subscribe(data => {
        if (this.fixedItem) {
          data.data.items = [...this.fixedItem, ...data.data.items];
        }
        this.dataSource = data.data.items;
        this.loading = false;
      });
    } else {
      return this.searchFn(1, 500, '', this.bonusCondition).subscribe(data => {
        if (this.fixedItem) {
          data.data.items = [...this.fixedItem, ...data.data.items];
        }
        this.dataSource = data.data.items;
        this.loading = false;
      });
    }
  }

  fetchMore() {
    if (
      !this.fetchAll &&
      !this.fetchingNew &&
      !this.loading &&
      this.bufferMap &&
      this.bufferMap.get(this.condition) &&
      !this.bufferMap.get(this.condition).isFull()
    ) {
      this.setConditionDefault();
      this.loading = true;
      this.currentPage++;
      const tempDataSource = this.adapterGetBuffer(this.condition, this.currentPage);
      const expectLength = this.currentPage * this.apiSize;
      if (expectLength > tempDataSource.length) {
        this.fetchData(this.currentPage).subscribe(() => {
          this.dataSource = this.adapterGetBuffer(this.condition, this.currentPage);
          this.loading = false;
        });
      } else {
        this.dataSource = tempDataSource;
        this.loading = false;
      }
    }
  }

  fetchNew() {
    if (!this.loading && !this.fetchAll) {
      this.fetchingNew = true;
      this.currentPage = 1;
      this.loading = true;
      this.setConditionDefault();
      if (this.hasBufferData()) {
        this.dataSource = this.adapterGetBuffer(this.condition, this.currentPage);
        this.loading = false;
        this.fetchingNew = false;
      } else {
        this.fetchData(this.currentPage).subscribe(() => {
          if (this.hasBufferData()) {
            this.dataSource = this.adapterGetBuffer(this.condition, this.currentPage);
            this.loading = false;
            this.fetchingNew = false;
          }
          this.loading = false;
          this.fetchingNew = false;
        });
      }
    }
  }

  setFirstSearchCondition(data: any) {
    this.firstSearchItem = data.data.items.find(
        (item: { [x: string]: any; }) => item[this.inputValue] === this.inputControl.value
    );
    this.valueChange.emit(Object.assign({}, this.firstSearchItem));
    this.loading = false;
    this.firstSearchConditionUpdated = true;
    if (this.firstSearchCondition && this.firstSearchItem) {
      this.dataSource = [this.firstSearchItem, ...this.dataSource];
    }
  }

  onSearch(event:any) { }

  onChange(event: any) {
    this.detectFirstChange = true;
    this.changeEvent.emit(event);
  }

  haveFirstSearchCondition() {
    if (this.firstSearchCondition === '') return false;
    if (!this.firstSearchCondition) return false;
    return true;
  }

  findFirstSearchItem(data:any) {
    if (!this.detectFirstSearchItem && this.firstSearchItem) {
      const result = data.data.items.findIndex(
          (item: any) => JSON.stringify(item) === JSON.stringify(this.firstSearchItem)
      );
      if (result >= 0) this.detectFirstSearchItem = true;
    }
  }

  onClear(event:any) {
    this.condition = '';
    this.fetchNew();
  }

  onOpen(event:any) {
    this.condition = '';
    this.fetchNew();
  }

  customSearchFn = (term: string, item:any) => {
    term = term.trim().toLowerCase();
    const searchValue = item[this.inputLabel];
    return searchValue.toLowerCase().indexOf(term) > -1;
  };

  bufferingData(condition: string, data: any[]) {
    if (!this.bufferMap) {
      this.bufferMap = new Map<string, BufferData>();
    }
    if (!this.bufferMap.get(condition)) {
      this.bufferMap.set(condition, new BufferData());
    }
    const bufferData = this.bufferMap.get(condition);
    if (data.length < this.apiSize) {
      bufferData.markAsFull();
    }
    bufferData.items = [...bufferData.items, ...data];
  }

  hasBufferData(): boolean {
    if (this.bufferMap && this.bufferMap.get(this.condition)) {
      if (!this.detectFirstSearchItem && this.firstSearchItem) {
        const result = this.bufferMap
          .get(this.condition)
          .items.findIndex(item => JSON.stringify(item) === JSON.stringify(this.firstSearchItem));
        if (result >= 0) this.detectFirstSearchItem = true;
      }
      return true;
    } else {
      return false;
    }
  }

  getBufferData(condition: string, page: number) {
    const endIndex = page * this.apiSize;
    const bufferData = this.bufferMap.get(condition);
    if (endIndex > bufferData.items.length) {
      return bufferData.items.slice(0, bufferData.items.length);
    } else {
      return bufferData.items.slice(0, endIndex);
    }
  }

  adapterGetBuffer(condition: string, page: number) {
    let bufferData = this.getBufferData(condition, page);
    if (this.fixedItem && this.fixedItem.length > 0) {
      const fixedItemSearched = [];
      for (const item of this.fixedItem) {
        if (item[this.inputLabel].toLowerCase().indexOf(this.condition) > -1)
          fixedItemSearched.push(item);
      }
      if (fixedItemSearched.length > 0) {
        bufferData = [...fixedItemSearched, ...bufferData];
      }
    }
    if (!this.multiple) {
      if (!this.detectFirstSearchItem && this.firstSearchItem && !this.attached) {
        bufferData = [this.firstSearchItem, ...bufferData];
        this.attached = true;
      }
    }
    return bufferData;
  }
}
