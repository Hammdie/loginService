import * as app from './app';
import {interpret} from 'xstate';


describe('test app', () => {

  let service;

  beforeEach(() => {
    service = interpret(app.loginMachine);
  })

  it('initial state is logout', () => {
    service.start();
    expect(service.state.value).toBe('logout');
  })

  it('proc login', () => {
    service.start();
    const user = {
      admin: true,
      firstName: 'Dietmar',
      secondName: 'Hamm',
      eMail: 'hamm@detalex.de',
      id: '1234567890'
    }
    const session = {expire: '134'};

    service.send('LOGIN', {user, session});
    expect(service.state.value).toBe('login');
    expect(service.state.context.user).toBe(user);
    expect(service.state.context.session).toBe(session);
  })


})
