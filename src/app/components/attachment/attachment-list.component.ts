import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractListComponent } from 'src/app/common/components/abstract-list.component';
import { Attachment } from 'src/app/models/attachment';
import { AttachmentService } from 'src/app/services/attachment.service';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-attachment-list',
    templateUrl: './attachment-list.component.html',
})
export class AttachmentListComponent extends AbstractListComponent<Attachment> implements OnInit {
    pageSize = 10;

    labels: any = {};
    values: any = {};

    constructor(router: Router, private attachmentService: AttachmentService) {
        super(router, attachmentService, 'attachment');

        this.labels['name'] = 'name';
        this.labels['external_type'] = 'external_type';
        this.labels['external_uuid'] = 'external_uuid';
        this.labels['mime_type'] = 'mime_type';
        this.labels['creation_date'] = 'creation_date';
    }
    ngOnInit(): void {
        console.log('ATTACHMENT', this.model);

    }

    getId(): string {
        return this.element!.uuid;
    }

    preLoaddata(): void {
        this.service.search.orderBy = 'name';
        super.preLoaddata();
    }

    reload(datatable: Table): void {
        super.reload(datatable);
    }

    reset(datatable: Table): void {
        super.reset(datatable);
    }
}
