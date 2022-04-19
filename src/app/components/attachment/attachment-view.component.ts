import { Attachment } from '../../models/attachment';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractViewComponent } from 'src/app/common/components/abstract-view.component';
import { AttachmentService } from 'src/app/services/attachment.service';
import { PreviousRouteService } from 'src/app/common/services/previous-route.service';

@Component({
  selector: 'app-attachment-view',
  templateUrl: './attachment-view.component.html',
})
export class AttachmentViewComponent extends AbstractViewComponent<Attachment> {
  fromEditPage: boolean;
  attachment: Attachment;

  constructor(
    router: Router,
    protected attachmentService: AttachmentService,
    protected previousRouteService: PreviousRouteService,
    protected route: ActivatedRoute
  ) {
    super(router, route, attachmentService, 'attachments');

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
