import { OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

/**
 * Determines whether passed component was destroyed.
 * @param component Angular component.
 */
export function componentDestroyed(component: OnDestroy) {
    const oldNgOnDestroy = component.ngOnDestroy;
    const destroyed$ = new ReplaySubject<void>(1);

    component.ngOnDestroy = () => {
        oldNgOnDestroy.apply(component);
        destroyed$.next(undefined);
        destroyed$.complete();
    };

    return destroyed$;
}
