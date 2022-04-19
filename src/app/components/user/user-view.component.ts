import { ATTACHMENT_API } from '../../constants/constants';
import { User } from '../../models/user';
import { CompanyService } from 'src/app/services/company.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AbstractViewComponent } from 'src/app/common/components/abstract-view.component';
import { PreviousRouteService } from 'src/app/common/services/previous-route.service';

@Component({
    selector: 'app-user-view',
    templateUrl: './user-view.component.html',
})
export class UserViewComponent extends AbstractViewComponent<User> {
    fromEditPage: boolean;
    downloadURL: string = ATTACHMENT_API;

    constructor(
        router: Router,
        protected userService: UserService,
        protected route: ActivatedRoute,
        private companyService: CompanyService,
        protected previousRouteService: PreviousRouteService
    ) {
        super(router, route, userService, 'users');

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

    postFind(): void {
        if (this.element.company_uuid) {
            this.companyService
                .find(this.element.company_uuid)
                .subscribe(item => (this.element.company_name = item.name));
        }
    }
}
