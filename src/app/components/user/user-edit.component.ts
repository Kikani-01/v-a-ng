import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEditComponent } from 'src/app/common/components/abstract-edit.component';
import { Company } from 'src/app/models/company';
import { User } from 'src/app/models/user';
import { CompanyService } from 'src/app/services/company.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
})
export class UserEditComponent
    extends AbstractEditComponent<User>
    implements OnInit {
    registerForm: FormGroup;

    maxDate: Date = new Date();
    minDate: Date = new Date();

    filteredCompany: Company[] = [];
    selectedCompany: Company = new Company();

    constructor(
        router: Router,
        route: ActivatedRoute,
        messageService: MessageService,
        public userService: UserService,
        private confirmationService: ConfirmationService,
        private formBuilder: FormBuilder,
        private companyService: CompanyService
    ) {
        super(router, route, userService, messageService, 'users');

        this.element = new User();

        this.minDate.setFullYear(this.minDate.getFullYear() - 120);
        this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
        this.buildForm();
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    private buildForm(): void {
        this.registerForm = this.formBuilder.group({
            fiscalcode: [this.element.fiscalcode, Validators.required],
            name: [this.element.name, Validators.required],
            surname: [this.element.surname, Validators.required],
            address: [this.element.address, Validators.required],
            city: [this.element.city, Validators.required],
            province: [this.element.province, Validators.required],
            mobile_phone: [
                this.element.mobile_phone,
                [
                    Validators.required,
                    Validators.pattern(/^\+(?:[0-9] ?){6,14}[0-9]$/),
                ],
            ],
            email: [this.element.email, [Validators.required, Validators.email]],
            company_uuid: [this.element.company_uuid],
            attachment_uuid: [this.element.attachment_uuid],
            active: [this.element.active, Validators.required],
        });
    }

    createInstance(): User {
        return new User();
    }

    getId(): string {
        return this.element.uuid;
    }

    postFind(): void {
        if (this.element.company_uuid) {
            this.retrieveCompany();
        }
    }

    postSave(): void {
        this.userService.unmarshall(this.element);
    }

    postUpdate(): void {
        this.userService.unmarshall(this.element);
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

    retrieveCompany(): void {
        this.companyService.find(this.element.company_uuid).subscribe(item => {
            if (item) this.selectedCompany = item;
        });
    }

    filterCompany(event: any): void {
        const query = event.query;
        this.companyService.buildSearch();
        this.companyService.search.like.name = query;
        this.companyService.search.pageSize = 20;

        this.companyService.getList().subscribe(
            list => (this.filteredCompany = list),
            ko => this.addError('Error in filtering companies')
        );
    }

    fillCompany(): void {
        this.element.company_uuid = this.selectedCompany.uuid;
    }
}
