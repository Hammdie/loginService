"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var app = __importStar(require("./app"));
var moment = require('moment');
describe('test app', function () {
    var user = {
        admin: true,
        firstName: 'Dietmar',
        lastName: 'Hamm',
        eMail: 'hamm@detalex.de',
        id: '1234567890'
    };
    beforeEach(function () {
        app.init();
    });
    it('initial state is idle', function () {
        expect(app.loginService.state.value).toBe('idle');
    });
    it('proc login', function () {
        var session = { expire: moment().add(2, 's').unix() };
        app.onLogin({ user: user, session: session }, 1000000);
        expect(app.loginService.state.value).toBe('login');
        expect(app.loginService.state.context.user).toBe(user);
        app.onLogout();
        expect(app.loginService.state.value).toBe('logout');
    });
    it('proc expiration and autologout', function (done) {
        var session = { expire: moment().add(2, 's').unix() };
        app.loginService.init({});
        app.loginService.subscribe(function (state) {
            if (state.value === 'login') {
                expect(state.context).toEqual({ user: user, session: session });
            }
            if (state.value === 'logout') {
                expect(state.context).toEqual({ user: undefined, session: undefined });
            }
        });
        app.onLogin({ user: user, session: session }, 1000);
        setTimeout(function () {
            expect(app.loginService.state.value).toBe('expiration');
        }, 1200);
        setTimeout(function () {
            expect(app.loginService.state.value).toBe('logout');
            expect(app.loginService.state.context).toEqual({ user: undefined, session: undefined });
            done();
        }, 2500);
    });
    it('login with expired session', function () {
        var session = { expire: moment().subtract(2, 'm').unix() };
        app.loginService.init({});
        expect(function () {
            app.onLogin({ user: user, session: session }, 1000);
        }).toThrow();
    });
});
//# sourceMappingURL=app.spec.js.map