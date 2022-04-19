import { Attachment } from './../models/attachment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from '../common/abstract.service';
import { ATTACHMENT_API } from '../constants/constants';
import { Search } from '../common/search';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AttachmentService extends AbstractService<Attachment> {
    baseUrl = ATTACHMENT_API;
    constructor(protected httpClient: HttpClient) {
        super(ATTACHMENT_API, httpClient);
    }

    buildSearch(): void {
        this.search = new Search<Attachment>(Attachment);
    }

    getId(element: Attachment): string {
        return element.uuid;
    }

    download(uuid: string): Observable<Blob> {
        return this.httpClient
            .get<Blob>(`${this.baseUrl}/${uuid}/download`, {
                observe: 'response',
                responseType: 'blob' as 'json',
            })
            .pipe(map(response => response.body));
    }
}
