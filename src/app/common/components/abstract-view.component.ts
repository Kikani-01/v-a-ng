import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/api';
import { OnInit, Directive } from '@angular/core';
import { AbstractService } from '../abstract.service';

@Directive()
export abstract class AbstractViewComponent<T> implements OnInit {
    public msgs: Message[] = [];

    public editMode = false;
    public element: T = null;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: AbstractService<T>,
        public path: string
    ) {}

    ngOnInit(): void {
        const id: string = this.route.snapshot.params['id'];
        if (id) {
            this.editMode = true;
            this.service.find(id).subscribe(
                element => {
                    this.element = element as T;
                    this.postFind();
                },
                error => {
                    this.addError(
                        'Errore nel caricamento dei dati.' + (error || '')
                    );
                }
            );
        } else {
            this.addError('Errore nel caricamento dei dati.');
        }
    }

    postFind(): void {}

    goToList(): void {
        this.clearMsgs();
        this.navigateToList();
    }

    public clearMsgs(): void {
        this.msgs = [];
    }

    public addInfo(message: string): void {
        this.msgs = [
            ...this.msgs,
            {
                severity: 'info',
                summary: 'Informazioni: ',
                detail: message,
            },
        ];
    }

    public addWarn(message: string): void {
        this.msgs = [
            ...this.msgs,
            {
                severity: 'warn',
                summary: 'Attention: ',
                detail: message,
            },
        ];
    }

    public addError(message: string): void {
        this.msgs = [
            ...this.msgs,
            { severity: 'error', summary: 'Error: ', detail: message },
        ];
    }

    abstract getId(): string;

    navigateToList(): void {
        this.router.navigate(['/' + this.path + '/list']);
    }

    public edit(element: T): void {
        this.element = element;
        this.router.navigate(['/' + this.path + '/edit', this.getId()]);
    }

    ngOnDestroy() {}
}
