import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Search } from '../common/search';
import * as moment from 'moment';
import { AbstractService } from '../common/abstract.service';
import { User } from '../models/user';
import { API_DATE_FORMAT, USER_API } from '../constants/constants';
@Injectable({
  providedIn: 'root',
})
export class UserService extends AbstractService<User> {
  constructor(protected httpClient: HttpClient) {
    super(USER_API, httpClient);
  }

  buildSearch(): void {
    this.search = new Search<User>(User);
  }

  getId(element: User): string {
    return element.uuid;
  }
}
