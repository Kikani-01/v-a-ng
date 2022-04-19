import { Observable, of } from 'rxjs';
import { Directive, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { ERROR_CODE } from 'src/app/constants/constants';
import { AbstractService } from '../abstract.service';

@Directive()
export abstract class AbstractEditComponent<T> implements OnInit {
    public msgs: Message[] = [];

    public editMode = false;
    public element: T;

    public windowHeight: number;
    public windowWidth: number;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: AbstractService<T>,
        protected messageService: MessageService,
        public path: string
    ) {}

    ngOnInit(): void {
        const id: string = this.route.snapshot.params['id'];
        if (id) {
            this.editMode = true;
            this.service.find(id).subscribe({
                next: (element: any) => {
                    this.element = element as T;
                    this.postFind();
                },
                error: error => this.addError('Error loading data.' + (error || '')),
            });
        } else {
            this.editMode = false;
            this.element = this.createInstance();
            this.postCreate();
        }

        this.windowHeight = window.innerHeight * 0.98;
        this.windowWidth = window.innerWidth * 0.98;
    }

    postCreate(): void {}

    postFind(): void {}

    upload(): void {}

    preSave(): boolean {
        return true;
    }

    preUpdate(): boolean {
        return true;
    }

    postSave(): void {}

    postThenNavigate(): Observable<boolean> {
        return of(false);
    }

    postUpdate(): void {}

    postDelete(): void {}

    save(): void {
        this.clearMsgs();
        this.editMode = false;
        if (!this.preSave()) {
            return;
        }
        this.service.persist(this.element).subscribe(
            element => {
                this.addInfo('Save completed successfully. ');
                this.element = element as T;
                this.postSave();

                this.postThenNavigate().subscribe({
                    next: () => this.navigateAfterSave(),
                    error: err => this.addError('Error: ' + err),
                    complete: () => this.navigateAfterSave(),
                });
            },
            error => {
                let msg: any = error ? error : '';
                this.addError('Could not complete the change. ' + msg);

                // const keys: string[] = Object.keys(ERROR_CODE);
                // for (let item of keys) {
                //   if (msg.includes(item)) {
                //     msg = ERROR_CODE[item];
                //     this.addError('Unable to complete saving. ' + msg);
                //     this.saveError();
                //     return;
                //   } else {
                //     this.addError('Unable to complete saving. ' + msg);
                //     this.saveError();
                //   }
                // }
            }
        );
    }

    saveError(): void {}

    update(): void {
        this.clearMsgs();
        this.editMode = false;
        if (!this.preUpdate()) {
            return;
        }
        this.service.update(this.element).subscribe(
            element => {
                this.addInfo('Edit completed successfully. ');
                this.element = element as T;
                this.postUpdate();

                this.postThenNavigate().subscribe({
                    next: () => this.navigateAfterSave(),
                    error: err => this.addError('Error: ' + err),
                    complete: () => this.navigateAfterSave(),
                });
            },
            error => {
                let msg = error ? error : '';
                this.addError('Could not complete the change. ' + msg);

                // const keys = Object.keys(ERROR_CODE);
                // for (let item of keys) {
                //   if (msg.includes(item)) {
                //     msg = ERROR_CODE[item];
                //     this.addError('Could not complete the change. ' + msg);
                //     this.saveError();
                //     return;
                //   }
                // }

                // this.addError('Could not complete the change. ' + msg);
                // this.saveError();
            }
        );
    }

    delete(): void {
        this.clearMsgs();
        this.editMode = false;
        this.service.delete(this.getId()).subscribe(
            element => {
                this.postDelete();
                this.navigateAfterDelete();
                this.addInfo('Deletion completed successfully. ');
            },
            error => {
                this.addError('Unable to complete deletion. ' + (error || ''));
            }
        );
    }

    goToList(): void {
        this.clearMsgs();
        this.navigateToList();
    }

    public isEditMode(): boolean {
        return this.editMode;
    }

    public clearMsgs(): void {
        this.msgs = [];
    }

    public addInfo(message: string): void {
        this.msgs = [
            ...this.msgs,
            {
                severity: 'info',
                summary: 'Information: ',
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

    abstract createInstance(): T;

    abstract getId(): string;

    navigateAfterDelete(): void {
        this.router.navigate(['/' + this.path + '/list']);
    }

    navigateAfterUpdate(): void {
        this.router.navigate(['/' + this.path + '/view', this.getId()]);
    }

    navigateAfterSave(): void {
        this.router.navigate(['/' + this.path + '/view', this.getId()]);
    }

    navigateToList(): void {
        this.router.navigate(['/' + this.path + '/list']);
    }

    ngOnDestroy(): void {}
}
