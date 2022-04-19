import { Visitor } from '../models/visitor';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from '../common/abstract.service';
import { Search } from '../common/search';
import { VISITOR_API } from '../constants/constants';

@Injectable({
    providedIn: 'root',
})
export class VisitorService extends AbstractService<Visitor> {
    getVisitor: any;
    constructor(protected httpClient: HttpClient) {
        super(VISITOR_API, httpClient);
    }

    buildSearch(): void {
        this.search = new Search<Visitor>(Visitor);
    }

    getId(element: Visitor): string {
        return element.uuid;
    }
}
