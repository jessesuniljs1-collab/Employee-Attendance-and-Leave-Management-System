import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * AuthService — manages HR role authentication state.
 * Controls access to restricted HR modules (Leave Approval).
 * Uses BehaviorSubject for reactive role-state updates.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

    /** Internal role state — false = Employee, true = HR */
    private _isHR = new BehaviorSubject<boolean>(false);

    /** Public Observable — subscribe for reactive HR mode updates */
    isHR$ = this._isHR.asObservable();

    /** Synchronous check — used by the AuthGuard */
    isHR(): boolean {
        return this._isHR.getValue();
    }

    /** Toggle between HR and Employee modes */
    toggleHRMode(): void {
        this._isHR.next(!this._isHR.getValue());
    }

    /** Explicitly set role — useful for login flow expansion */
    setHRMode(value: boolean): void {
        this._isHR.next(value);
    }
}
