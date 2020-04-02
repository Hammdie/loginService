"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xstate_1 = require("xstate");
var moment_1 = __importDefault(require("moment"));
var loginMachine = xstate_1.Machine({
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
                xstate_1.assign(function (context, event) {
                    return {
                        user: event.loginContext.user,
                        session: event.loginContext.session
                    };
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
                xstate_1.assign(function (_) {
                    return {
                        user: undefined,
                        session: undefined
                    };
                }),
            ],
            on: {
                LOGIN: {
                    target: 'login',
                }
            }
        }
    }
});
function calcExpirationTimeout(session) {
    var difference = moment_1.default.duration(moment_1.default(session.expire * 1000).diff(moment_1.default()));
    if (difference.asMilliseconds() < 0) {
        throw 'Login with expired session';
    }
    return difference.asMilliseconds();
}
function createExpirationActivity(session, expirationDelay) {
    var expTimeout = calcExpirationTimeout(session);
    var expirationTimeout = expTimeout - expirationDelay;
    return setTimeout(function () {
        onExpiration();
    }, expirationTimeout);
}
function createExpiredActivity(session) {
    var expTimeout = calcExpirationTimeout(session);
    return setTimeout(function () {
        onLogout();
    }, expTimeout);
}
var logoutTimeout;
var expirationTimeout;
function onLogin(loginContext, expirationDelay) {
    if (expirationDelay === void 0) { expirationDelay = 300000; }
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
    exports.loginService.send('LOGIN', { loginContext: loginContext });
}
exports.onLogin = onLogin;
function onLogout() {
    if (logoutTimeout) {
        clearTimeout(logoutTimeout);
    }
    if (expirationTimeout) {
        clearTimeout(expirationTimeout);
    }
    exports.loginService.send('LOGOUT');
}
exports.onLogout = onLogout;
function onExpiration() {
    if (expirationTimeout) {
        clearTimeout(expirationTimeout);
    }
    exports.loginService.send('EXPIRATION');
}
function init() {
    exports.loginService = xstate_1.interpret(loginMachine).start();
    return exports.loginService;
}
exports.init = init;
init();
//# sourceMappingURL=app.js.map