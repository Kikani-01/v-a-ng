import { AttachmentService } from 'src/app/services/attachment.service';
import { User } from '../../models/user';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Company } from 'src/app/models/company';
import { PreviousRouteService } from 'src/app/common/services/previous-route.service';
import { AbstractEditComponent } from 'src/app/common/components/abstract-edit.component';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-user-verification',
    templateUrl: './user-verification.component.html',
    providers: [AttachmentService],
})
export class UserVerificationComponent extends AbstractEditComponent<User> {
    companyMap = {};

    fromEditPage: boolean;
    company: Company;

    selectedFile: File[] = [];

    constructor(
        router: Router,
        message: MessageService,
        protected userService: UserService,
        protected route: ActivatedRoute,
        private attachmentService: AttachmentService,
        protected previousRouteService: PreviousRouteService
    ) {
        super(router, route, userService, message, 'users');
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    createInstance(): User {
        return new User();
    }

    getId(): string {
        return this.element.uuid;
    }

    onDocumentUpload(event: any) {
        this.selectedFile = event.files[0];
        this.element?.uuid &&
            this.attachmentService
                .upload(this.element.uuid, event.files[0], 'users')
                .subscribe({
                    next: () =>
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Uploaded successfuly',
                        }),
                    error: err => this.addError('Failed to upload: ' + err),
                });
    }
}
