import {assign, Machine, interpret} from 'xstate';

import moment from 'moment';

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

export type LoginEvent =
  | { type: 'LOGIN', loginContext: ILoginContext }
  | { type: 'EXPIRATION', loginContext: ILoginContext }
  | { type: 'LOGOUT', loginContext: ILoginContext }

const loginMachine = Machine<ILoginContext, any, LoginEvent>({
    key: 'login',
    initial: 'idle',
    context: {},
    states: {
      idle: {
        on: {
          LOGIN: {
            target: 'login',
          }
        }
      },
      login: {
        entry: [
          assign((context, event) => {
            return {
              user: event.loginContext.user,
              session: event.loginContext.session
            }
          }),
        ],
        on: {
          LOGOUT: {
            target: 'logout',
          },
          EXPIRATION: {
            target: 'expiration',
          }
        }
      },
      expiration: {
        on: {
          LOGIN: 'login',
          LOGOUT: 'logout'
        }
      },
      logout: {
        entry: [
          assign((_) => {
            return {
              user: undefined,
              session: undefined
            }
          }),
        ],
        on: {
          LOGIN:
            {
              target: 'login',
            }
        }
      }
    }
  }
)

export let loginService;

function calcExpirationTimeout(session: ISession): number {
  const difference = moment.duration(
    moment(session.expire * 1000).diff(moment()),
  );
  if (difference.asMilliseconds() < 0) {
    throw 'Login with expired session';
  }
  return difference.asMilliseconds();
}

function createExpirationActivity(session: ISession, expirationDelay: number): any {
  const expTimeout = calcExpirationTimeout(session);
  const expirationTimeout = expTimeout - expirationDelay;
  return setTimeout(() => {
    onExpiration();
  }, expirationTimeout);
}

function createExpiredActivity(session: ISession): any {
  const expTimeout = calcExpirationTimeout(session);
  return setTimeout(() => {
    onLogout();
  }, expTimeout);
}

let logoutTimeout: any;
let expirationTimeout: any;

export function onLogin(loginContext: ILoginContext, expirationDelay: number = 300000) {
  if (!loginContext.session) {
    throw 'wrong session';
  }
  if (logoutTimeout) {
    clearTimeout(logoutTimeout);
  }
  if (expirationTimeout) {
    clearTimeout(expirationTimeout);
  }
  expirationTimeout = createExpirationActivity(loginContext.session, expirationDelay);
  logoutTimeout = createExpiredActivity(loginContext.session);
  loginService.send('LOGIN', {loginContext});
}

export function onLogout() {
  if (logoutTimeout) {
    clearTimeout(logoutTimeout);
  }
  if (expirationTimeout) {
    clearTimeout(expirationTimeout);
  }
  loginService.send('LOGOUT');

}

function onExpiration() {
  if (expirationTimeout) {
    clearTimeout(expirationTimeout);
  }
  loginService.send('EXPIRATION');
}

export function init() {
  loginService = interpret(loginMachine).start();
  return loginService;
}

init();
