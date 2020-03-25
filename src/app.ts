import {assign, interpret, Machine} from 'xstate';

interface IUser {
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
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }


export const loginMachine = Machine({
  key: 'login',
  initial: 'logout',
  context: {
  },
  states: {
    login: {
      on: {
        LOGOUT: {
          target: 'logout',
        }
      }
    },
    logout: {
      on: {
        LOGIN: {
          target: 'login',
          actions: assign((context, event) => {
              return {user: event.user, session: event.session}
          })
        }
      }
    }
  }
})

