import { Attachment } from 'src/app/models/attachment';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { AbstractEditComponent } from 'src/app/common/components/abstract-edit.component';
import { AttachmentService } from 'src/app/services/attachment.service';

@Component({
    selector: 'app-attachment-edit',
    templateUrl: './attachment-edit.component.html',
})
export class AttachmentEditComponent extends AbstractEditComponent<Attachment>
    implements OnInit {
    public registerForm: FormGroup;

    public genderOptions: SelectItem[] = [];
    public maxDate = new Date();

    constructor(
        router: Router,
        route: ActivatedRoute,
        messageService: MessageService,
        public attachmentService: AttachmentService,
        private confirmationService: ConfirmationService,
        private formBuilder: FormBuilder
    ) {
        super(router, route, attachmentService, messageService, 'attachment');

        this.element = new Attachment();

        this.buildForm();
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    createInstance(): Attachment {
        return new Attachment();
    }

    getId(): string {
        return this.element!.uuid;
    }

    private buildForm(): void {
        this.registerForm = this.formBuilder.group({
            name: [this.element?.filename, Validators.required],
        });
    }

    delete(): void {
        this.confirmationService.confirm({
            message: 'Confirm the deletion?',
            header: 'Attention!',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                super.delete();
            },
            reject: () => { },
        });
    }
}
