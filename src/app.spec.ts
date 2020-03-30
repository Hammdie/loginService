import * as app from './app';

const moment = require('moment');

describe('test app', () => {

  let service;
  const user = {
    admin: true,
    firstName: 'Dietmar',
    lastName: 'Hamm',
    eMail: 'hamm@detalex.de',
    id: '1234567890'
  };

  beforeEach(() => {
    app.init();
  })

  it('initial state is idle', () => {
    expect(app.loginService.state.value).toBe('idle');
  })

  it('proc login', () => {
    const session = {expire: moment().add(2, 's').unix()};
    app.onLogin({user, session}, 1000000);
    expect(app.loginService.state.value).toBe('login');
    expect(app.loginService.state.context.user).toBe(user);
    app.onLogout();
    expect(app.loginService.state.value).toBe('logout');
  });

  it('proc expiration and autologout', (done) => {
    const session = {expire: moment().add(2, 's').unix()};
    app.loginService.init({});
    app.loginService.subscribe((state) => {
      if (state.value === 'login') {
        expect(state.context).toEqual({user, session});
      }
      if (state.value === 'logout') {
        expect(state.context).toEqual({user: undefined, session: undefined});
      }
    })
    app.onLogin({user, session}, 1000);
    setTimeout(() => {
      expect(app.loginService.state.value).toBe('expiration');
    }, 1200);
    setTimeout(() => {
      expect(app.loginService.state.value).toBe('logout');
      expect(app.loginService.state.context).toEqual({user: undefined, session: undefined});
      done();
    }, 2500);
  })

  it('login with expired session', () => {
    const session = {expire: moment().subtract(2, 'm').unix()};
    app.loginService.init({});
    expect(()=> {
      app.onLogin({user, session}, 1000)
    }).toThrow();
  })


})


