import { Company } from '../../models/company';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractViewComponent } from 'src/app/common/components/abstract-view.component';
import { CompanyService } from 'src/app/services/company.service';
import { PreviousRouteService } from 'src/app/common/services/previous-route.service';

@Component({
  selector: 'app-company-view',
  templateUrl: './company-view.component.html',
})
export class CompanyViewComponent extends AbstractViewComponent<Company> {
  fromEditPage: boolean;
  company: Company;

  constructor(
    router: Router,
    protected companyService: CompanyService,
    protected previousRouteService: PreviousRouteService,
    protected route: ActivatedRoute
  ) {
    super(router, route, companyService, 'companies');

    this.fromEditPage =
      previousRouteService.getPreviousUrl().includes('edit') ||
      previousRouteService.getPreviousUrl().includes('new');
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  getId(): string {
    return this.element.uuid;
  }
}
