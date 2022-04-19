import { Company } from 'src/app/models/company';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { AbstractEditComponent } from 'src/app/common/components/abstract-edit.component';
import { CompanyService } from 'src/app/services/company.service';

@Component({
    selector: 'app-company-edit',
    templateUrl: './company-edit.component.html',
})
export class CompanyEditComponent
    extends AbstractEditComponent<Company>
    implements OnInit {
    public registerForm: FormGroup;

    public genderOptions: SelectItem[] = [];
    public maxDate = new Date();

    constructor(
        router: Router,
        route: ActivatedRoute,
        messageService: MessageService,
        public companyService: CompanyService,
        private confirmationService: ConfirmationService,
        private formBuilder: FormBuilder
    ) {
        super(router, route, companyService, messageService, 'companies');

        this.element = new Company();

        this.buildForm();
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    createInstance(): Company {
        return new Company();
    }

    getId(): string {
        return this.element!.uuid;
    }

    private buildForm(): void {
        this.registerForm = this.formBuilder.group({
            name: [this.element?.name, Validators.required],
            description: [this.element?.description, Validators.required],
            address: [this.element?.address, Validators.required],
            city: [this.element?.city, Validators.required],
            province: [this.element?.province, Validators.required],
            active: [this.element?.active, Validators.required]
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
