import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractListComponent } from 'src/app/common/components/abstract-list.component';
import { Company } from 'src/app/models/company';
import { CompanyService } from 'src/app/services/company.service';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-companies-list',
    templateUrl: './companies-list.component.html',
})
export class CompaniesListComponent extends AbstractListComponent<Company> implements OnInit {
    pageSize = 10;

    labels: any = {};
    values: any = {};

    constructor(router: Router, private companyService: CompanyService) {
        super(router, companyService, 'companies');

        this.labels['name'] = 'name';
        this.labels['description'] = 'description';
        this.labels['address'] = 'address';
        this.labels['city'] = 'city';
        this.labels['province'] = 'province';
        this.labels['active'] = 'active';
    }
    ngOnInit(): void {
        console.log('COMPANIES', this.model);

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
