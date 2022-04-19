import { Company } from '../models/company';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from '../common/abstract.service';
import { Search } from '../common/search';
import { COMPANIES_API } from '../constants/constants';
@Injectable({
    providedIn: 'root',
})
export class CompanyService extends AbstractService<Company> {
    constructor(protected httpClient: HttpClient) {
        super(COMPANIES_API, httpClient);
    }

    buildSearch(): void {
        this.search = new Search<Company>(Company);
    }

    getId(element: Company): string {
        return element.uuid;
    }
}
