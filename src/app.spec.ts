import * as app from './app';
import {service} from './app';

const moment = require('moment');

describe('test app', () => {

  let service;
  const user = {
    admin: true,
    firstName: 'Dietmar',
    secondName: 'Hamm',
    eMail: 'hamm@detalex.de',
    id: '1234567890'
  };

  beforeEach(() => {
    app.onLogout();
  })

  it('initial state is logout', () => {
    expect(app.service.state.value).toBe('logout');
  })

  it('proc login', () => {
    const session = {expire: moment().add(2, 's').unix()};
    app.onLogin({user, session}, 1000000);
    expect(app.service.state.value).toBe('login');
    expect(app.service.state.context.user).toBe(user);
    app.onLogout();
    expect(app.service.state.value).toBe('logout');
  });

  it('proc expiration and autologout', (done) => {
    app.service.init({});
    const session = {expire: moment().add(2, 's').unix()};
    app.onLogin({user, session}, 1000);
    setTimeout(() => {
      expect(app.service.state.value).toBe('expiration');
    }, 1200);
    setTimeout(() => {
      expect(app.service.state.value).toBe('logout');
      expect(app.service.state.context).toEqual({ user: undefined, session: undefined });
      done();
    }, 2500);

  })

})


