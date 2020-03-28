import {assign, actions, Machine, interpret} from 'xstate';
const moment = require('moment');

interface StateSchema {
  states: {
    login?: {
      on?: {}
    };
    expiration?: {
      on?: {}
    };
    logout?: {
      on?: {}
    };
  };
}

export interface IUser {
  admin: boolean;
  firstName: string;
  secondName: string;
  eMail: string;
  id: string;
  imgStc?: string;
}

export interface ISession {
  expire: number;
}

export interface ILoginContext {
  user?: IUser;
  session?: ISession;
}

export type LoginEvent =
  | { type: 'LOGIN', context: ISession }
  | { type: 'EXPIRATION' }
  | { type: 'LOGOUT' }

const loginMachine = Machine<any, any, any>({
    key: 'login',
    initial: 'logout',
    context: {},
    states: {
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

export const service = interpret(loginMachine).start();

function calcExpirationTimeout(session: ISession): number {
  const difference = moment.duration(
    moment(session.expire * 1000).diff(moment()),
  );
  if (difference.asMilliseconds() < 0) {
    throw 'Login try with expired session';
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
  expirationTimeout = createExpirationActivity(loginContext.session, expirationDelay);
  logoutTimeout = createExpiredActivity(loginContext.session);
  service.send('LOGIN', {loginContext});
}

export function onLogout() {
  if (logoutTimeout) {
    clearTimeout(logoutTimeout);
  }
  if (expirationTimeout) {
    clearTimeout(expirationTimeout);
  }
  service.send('LOGOUT');

}

export function onExpiration() {
  if (expirationTimeout) {
    clearTimeout(expirationTimeout);
  }
  service.send('EXPIRATION');
}



