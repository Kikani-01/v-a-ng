import { Directive, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { LazyLoadEvent, Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { AbstractService } from '../abstract.service';

@Directive()
export abstract class AbstractListComponent<T> implements OnInit {
  msgs: Message[] = [];

  element: T;
  errorMessage: string;
  model: T[] = [];
  listSize: number;

  firstReload: boolean;

  @ViewChild('op') op: OverlayPanel;

  constructor(
    protected router: Router,
    public service: AbstractService<T>,
    public path: string
  ) {}

  ngOnInit(): void {
    this.service.buildSearch();
    this.firstReload = true;
  }

  public loadData(firstReload: boolean, datatable?: any): void {
    this.preLoaddata();
    this.service.getList().subscribe(
      (model) => {
        console.log('MODEL', model);
        
        this.model = model as T[];
        this.listSize = this.service.listSize;
        this.postList();
      },
      (error) => (this.errorMessage = error as any)
    );
  }

  public preLoaddata(): void {}

  protected preLoad(event: LazyLoadEvent, datatable?: any): void {
    if (event.sortField) {
      this.service.search.orderBy =
        event.sortField +
        (event.sortOrder && event.sortOrder > 0 ? ' ASC' : ' DESC');
    }
    this.manageFilters(event);
  }

  protected manageFilters(event: LazyLoadEvent): void {}

  public lazyLoad(event: LazyLoadEvent, datatable?: any): void {
    if (!this.firstReload) {
      this.service.search.startRow = event.first as number;
    }

    this.service.search.pageSize = event.rows as number;
    this.preLoad(event, datatable);
    this.loadData(this.firstReload, datatable);
    if (this.firstReload) {
      this.firstReload = false;
    }
  }

  protected defaultCriteria(): void {
    this.service.buildSearch();
  }

  public refresh(datatable: Table): void {
    this.clearMsgs();
    if (datatable.lazy) {
      datatable.reset();
    } else {
      this.lazyLoad({}, datatable);
    }
  }

  public reload(datatable: Table): void {
    this.service.search.startRow = 0;
    this.refresh(datatable);

    if (this.op != null) {
      this.op.hide();
    }
  }

  public reset(datatable: Table): void {
    this.service.buildSearch();
    this.refresh(datatable);

    if (this.op != null) {
      this.op.hide();
    }
  }

  public newElement(): T {
    throw new Error('override this');
  }

  public onRowSelect(event: T, focusable: any): void {
    this.element = event;
    if (focusable) {
      focusable.focus();
    }
  }

  public getNavigateOnView(): void {}

  public getNavigateOnEdit(): void {}

  public postSave(): void {}

  public postUpdate(): void {}

  public postDelete(): void {}

  public save(): void {
    this.clearMsgs();
    this.service.persist(this.element).subscribe(
      (element) => {
        this.addInfo('Salvataggio completato con successo. ');
        this.element = this.newElement();
        this.loadData(false);
        this.postSave();
      },
      (error) => {
        this.addError(
          'Impossibile completare il salvataggio. Si prega di riprovare. '
        );
      }
    );
  }

  public undo(focusable: any): void {
    this.clearMsgs();
    this.element = this.newElement();
    if (focusable) {
      focusable.focus();
    }
  }

  public delete(element: T): void {
    this.clearMsgs();
    this.service.delete(this.getId()).subscribe(
      (result) => {
        this.addInfo('Eliminazione completata con successo. ');
        this.element = this.newElement();
        this.loadData(false);
        this.postDelete();
      },
      (error) => {
        this.addError("Impossibile completare l'eliminazione. ");
      }
    );
  }

  public update(): void {
    this.clearMsgs();
    this.service.update(this.element).subscribe(
      (element) => {
        this.addInfo('Modifica completata con successo. ');
        this.element = this.newElement();
        this.loadData(false);
        this.postUpdate();
      },
      (error) => {
        this.addError('Impossibile completare la modifica. ');
      }
    );
  }

  public postList(): void {}

  public addInfo(message: string): void {
    this.msgs.push({
      severity: 'info',
      summary: 'Informazioni: ',
      detail: message,
    });
  }

  public addWarn(message: string): void {
    this.msgs.push({
      severity: 'warn',
      summary: 'Attenzione: ',
      detail: message,
    });
  }

  public addError(message: string): void {
    this.msgs.push({ severity: 'error', summary: 'Errore: ', detail: message });
  }

  public clearMsgs(): void {
    this.msgs = [];
  }

  abstract getId(): string;

  public view(element: T): void {
    this.element = element;
    this.router.navigate(['/' + this.path + '/view', this.getId()]);
  }

  public edit(element: T): void {
    this.element = element;
    this.router.navigate(['/' + this.path + '/edit', this.getId()]);
  }

  public back(): void {
    this.router.navigate(['/']);
  }

  annulla(): void {
    const lastIndexOfSlash = this.path.lastIndexOf('/');
    let backPath = this.path.substring(0, lastIndexOfSlash + 1);
    if (backPath === '') {
      backPath = 'home';
    }
    this.router.navigate(['/' + backPath]);
  }
}
