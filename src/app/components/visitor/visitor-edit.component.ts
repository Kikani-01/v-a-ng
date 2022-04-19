import { Visitor } from 'src/app/models/visitor';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { AbstractEditComponent } from 'src/app/common/components/abstract-edit.component';
import { VisitorService } from 'src/app/services/visitor.service';

@Component({
    selector: 'app-visitor-edit',
    templateUrl: './visitor-edit.component.html',
})
export class VisitorsEditComponent
    extends AbstractEditComponent<Visitor>
    implements OnInit {
    public registerForm: FormGroup;

    public genderOptions: SelectItem[] = [];
    public maxDate = new Date();

    constructor(
        router: Router,
        route: ActivatedRoute,
        messageService: MessageService,
        public visitorService: VisitorService,
        private confirmationService: ConfirmationService,
        private formBuilder: FormBuilder
    ) {
        super(router, route, visitorService, messageService, 'visitors');

        this.element = new Visitor();

        this.buildForm();
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    createInstance(): Visitor {
        return new Visitor();
    }

    getId(): string {
        return this.element!.uuid;
    }

    private buildForm(): void {
        this.registerForm = this.formBuilder.group({
            fiscalcode: [this.element?.fiscalcode, Validators.required],
            entrance_date: [this.element?.entrance_date, Validators.required],
            exit_date: [this.element?.exit_date, Validators.required],
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
