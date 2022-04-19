import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import * as moment from 'moment/moment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Search } from './search';

export abstract class AbstractService<T> {
  listSize: number;
  search: Search<T>;

  protected progress$: Observable<number>;
  protected progress = 0;
  protected progressObserver: any;

  protected static setUploadUpdateInterval(interval: number): void {
    setInterval(() => { }, interval);
  }

  constructor(protected url: string, protected httpClient: HttpClient) {
    this.initialize();

    this.progress$ = new Observable<number>((observer) => {
      this.progressObserver = observer;
    });
  }

  private initialize(): void {
    this.buildSearch();
    this.init();
  }

  protected init(): void { }

  public getList(): Observable<T[]> {
    let params = new HttpParams();
    params = this.applyRestrictions(params, this.search);

    return this.httpClient
      .get<HttpResponse<T[]>>(this.url, {
        observe: 'response',
        params: params,
      })
      .pipe(
        map((res) => {
          this.listSize =
            res.headers.get('listSize') != null
              ? +res.headers.get('listSize')!
              : 0;
          const ts: any = res.body;
          this.postList(ts);
          return ts;
        }),
        catchError(this.handleError)
      );
  }

  public getAllList(search?: Search<T>): Observable<T[]> {
    let params = new HttpParams();

    if (search == null) {
      search = JSON.parse(JSON.stringify(this.search));
    }
    search!.pageSize = 0;
    search!.startRow = 0;
    params = this.applyRestrictions(params, search);

    return this.httpClient
      .get<HttpResponse<T[]>>(this.url, {
        observe: 'response',
        params: params,
      })
      .pipe(
        map((res) => {
          const ts: any = res.body;
          this.postList(ts);
          return ts;
        }),
        catchError(this.handleError)
      );
  }

  public getListSize(): number {
    if (this.listSize) {
      return this.listSize;
    }
    return 0;
  }

  public size(): Observable<number> {
    let params = new HttpParams();
    this.search.startRow = 0;
    this.search.pageSize = 1;
    params = this.applyRestrictions(params, this.search);

    return this.httpClient
      .get(this.url + '/listSize', {
        observe: 'response',
        params: params,
      })
      .pipe(
        map((res: HttpResponse<number | object>) => {
          return res.headers.get('listSize') != null
            ? +res.headers.get('listSize')!
            : 0;
        }),
        catchError(this.handleError)
      );
  }

  protected applyRestrictions(
    params: HttpParams,
    search: any,
    prefix?: string
  ): HttpParams {
    if (!prefix) {
      prefix = '';
    } else {
      prefix = prefix + '.';
    }
    for (const key in search) {
      if (search[key] !== null) {
        if (!(search[key] instanceof Object)) {
          params = params.set(
            prefix + key,
            this.toQueryParam(prefix + key, search[key])
          );
        } else if (search[key] instanceof Date) {
          params = params.set(
            prefix + key,
            this.toQueryParam(prefix + key, search[key])
          );
        } else {
          params = this.applyRestrictions(params, search[key], prefix + key);
        }
      }
    }
    return params;
  }

  protected toQueryParam(field: string, value: any): any {
    if (value instanceof Date) {
      const date =
        moment(value).utc(true).format('YYYY-MM-DD') +
        ' ' +
        moment(value).utc(true).format('HH:mm:ss');
      return date;
    }
    return value;
  }

  public find(id: string): Observable<T> {
    return this.httpClient.get<T>(this.url + '/' + id).pipe(
      map((res) => {
        const t: any = res as any;
        this.postFind(t);
        return t;
      }),
      catchError(this.handleError)
    );
  }

  public newInstance<T>(type: { new(): T }): T {
    return new type();
  }

  public delete(id: string): Observable<any> {
    return this.httpClient
      .delete(this.url + '/' + id, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  public persist(element: T): Observable<T> {
    const body = this.marshall(element);
    return this.httpClient
      .post<T>(this.url, body)
      .pipe(catchError(this.handleError));
  }

  public update(element: T): Observable<T> {
    const body = this.marshall(element);
    return this.httpClient
      .put<T>(this.url + '/' + this.getId(element), body)
      .pipe(catchError(this.handleError));
  }

  protected handleError(error: HttpErrorResponse): Observable<any> {
    // in a real world app, we may send the error to some remote logging infrastructure
    // instead of just logging it to the console

    if (!error) {
      return throwError('Try later');
    }
    console.error(error?.error?.msg);
    return throwError(error?.error?.msg);
  }

  public getInstance<T>(TCreator: { new(): T }): T {
    return new TCreator();
  }

  public abstract getId(element: T): void;

  public abstract buildSearch(): void;

  public getObserver(): Observable<number> {
    return this.progress$;
  }

  public upload(
    uuid: string,
    file: any,
    external_type?: string
  ): Observable<any> {
    const formData: FormData = new FormData();

    if (file) {
      this.progress = 0;

      formData.append('name', file.name);
      formData.append('file', file);
      formData.append('external_uuid', uuid);
      formData.append('external_type', external_type);
      formData.append('mime_type', `application/${file.name.split('.').pop()}`);
    }

    return this.httpClient.post(this.url, formData);
  }

  public unmarshall(element: T): void { }

  protected marshall(element: T): T {
    return element;
  }

  protected postFind(t: T): void {
    this.unmarshall(t);
  }

  protected postList(ts: T[]): void {
    for (const item of ts) {
      this.unmarshall(item);
    }
  }
}
