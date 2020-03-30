export interface IUser {
    admin: boolean;
    firstName: string;
    lastName: string;
    eMail: string;
    id: string;
}
export interface ISession {
    expire: number;
}
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
export declare function onExpiration(): void;
export declare function init(): any;
