import { User } from '../../models/user';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { mergeAll, tap, toArray } from 'rxjs/operators';
import { AbstractListComponent } from 'src/app/common/components/abstract-list.component';
import { CompanyService } from 'src/app/services/company.service';
import { UserService } from '../../services/user.service';
import { Company } from 'src/app/models/company';
import { API_DATE_FORMAT, CHIPS_DATE_FORMAT } from 'src/app/constants/constants';
import * as moment from 'moment';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
})
export class UserListComponent extends AbstractListComponent<User> {
    pageSize = 10;

    labels: any = {};
    values: any = {};

    companyUids: string;
    companiesList: Company[] = [];
    status: boolean = false;
    filteredCompany: Company[] = [];
    selectedCompany: Company = new Company();

    constructor(
        router: Router,
        private userService: UserService,
        private companyService: CompanyService
    ) {
        super(router, userService, 'users');

        this.labels['company_uuid'] = 'company';
        this.labels['name'] = 'name';
        this.labels['surname'] = 'surname';
        this.labels['city'] = 'city';
        this.labels['province'] = 'province';
        this.labels['fiscalcode'] = 'fiscalcode';
        this.labels['mobile_phone'] = 'mobile_phone';
        this.labels['email'] = 'email';
        this.labels['active'] = 'active';
    }

    getId(): string {
        return this.element.uuid;
    }

    ngOnInit(): void {
        if (this.service.search.obj.company_uuid) {
            this.recoverCompany(this.service.search.obj.company_uuid);
        }
    }

    clickEvent() {
        this.status = !this.status;
    }

    postList() {
        this.mapCompaniesById();
    }

    preLoaddata(): void {
        this.service.search.orderBy = 'name ASC';
        super.preLoaddata();
    }

    recoverCompany(uuid: string): void {
        this.companyService.find(uuid).subscribe(item => {
            this.selectedCompany = item;
        });
    }

    mapCompaniesById() {
        this.companyUids = this.model.map(item => item.company_uuid).toString();
        this.companyService.buildSearch();
        this.companyService.search.obj.uuid = this.companyUids;
        delete this.companyService.search.pageSize;
        delete this.companyService.search.startRow;

        this.companyService.getList().subscribe(
            (list: Company[]) => {
                for (let element of this.model) {
                    const mathedCompany = list.find(
                        item => item.uuid === element.company_uuid
                    );
                    if (mathedCompany) element.company_name = mathedCompany.name;
                }
            },
            err => this.addError('Error in company filter ' + err)
        );
    }

    filterCompany(event?: any): void {
        const query = event ? event.query : null;
        this.companyService.buildSearch();

        this.companyService.search.like.name = query;
        this.companyService.search.pageSize = 20;

        this.companyService
            .getList()
            .pipe(
                mergeAll(),
                tap(item => (this.values[item.uuid] = item.name)),
                toArray()
            )
            .subscribe(
                list => (this.filteredCompany = list),
                ko => this.addError('Error in company filter')
            );
    }

    fillCompany(): void {
        this.service.search.obj.company_uuid = this.selectedCompany.uuid;
    }

    private normalizePhoneNumber() {
        if (
            this.userService.search.like.mobile_phone &&
            this.userService.search.like.mobile_phone.trim().startsWith('+')
        ) {
            this.userService.search.like.mobile_phone =
                this.userService.search.like.mobile_phone.replace('+', '').trim();
        }
    }

    reload(datatable: Table): void {
        this.normalizePhoneNumber();

        if (this.service.search.obj.company_uuid === null) {
            this.selectedCompany = null;
        }

        super.reload(datatable);
    }

    reset(datatable: Table): void {
        this.selectedCompany = null;

        super.reset(datatable);
    }
}
