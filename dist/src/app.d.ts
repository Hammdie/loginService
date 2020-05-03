import { IUser, ISession } from '@diemtarh/detalex-client-lib';
export interface ILoginContext {
    user?: IUser;
    session?: ISession;
}
export declare type LoginEvent = {
    type: 'LOGIN';
    loginContext: ILoginContext;
} | {
    type: 'EXPIRATION';
    loginContext: ILoginContext;
} | {
    type: 'LOGOUT';
    loginContext: ILoginContext;
};
export declare let loginService: any;
export declare function onLogin(loginContext: ILoginContext, expirationDelay?: number): void;
export declare function onLogout(): void;
export declare function init(): any;
