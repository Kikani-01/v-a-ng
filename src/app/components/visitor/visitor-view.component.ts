import { Visitor } from '../../models/visitor';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractViewComponent } from 'src/app/common/components/abstract-view.component';
import { VisitorService } from 'src/app/services/visitor.service';
import { PreviousRouteService } from 'src/app/common/services/previous-route.service';

@Component({
  selector: 'app-visitor-view',
  templateUrl: './visitor-view.component.html',
})
export class VisitorViewComponent extends AbstractViewComponent<Visitor> {
  fromEditPage: boolean;
  visitor: Visitor;

  constructor(
    router: Router,
    protected visitorService: VisitorService,
    protected previousRouteService: PreviousRouteService,
    protected route: ActivatedRoute
  ) {
    super(router, route, visitorService, 'visitors');

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
