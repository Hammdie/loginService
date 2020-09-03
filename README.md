# Login Service

Clientside processing of sso token handling.  Use this service to handle SSO authentification based on JWT token.

![](var/imgs/states.jpeg)
(https://xstate.js.org/viz/?gist=9a731b21f882ce56eb846be73355188d)

## install
```
npm i @diemtarh/login-service
```

## Usage
```
    var loginService = require("@diemtarh/login-service")
    var moment = require("moment");

    loginService.loginService.subscribe(state => {
          switch (state.value) {
            case 'login':
              console.log('...handleLogin');
              console.log(state.context);
              break;
            case 'logout':
              console.log('...handleLogout');
              console.log(state.context);
              break;
            case 'expiration':
              console.log('...Show expiration message');
              console.log(state.context);
              break;
            default:
          }
    });
    
    const user = {
      firstName: 'Dietmar',
      lastName: 'Hamm',
      eMail: 'diemtarh@gmail.com',
      id: 1234666
    }
    //expire session after 5 sek.
    const session = {expire: moment().add(5, 's').unix()}
    loginService.onLogin({ user, session });
```
try it here 
https://runkit.com/hammdie/5e860b2ef924000013412ad0

**Login** and **logout** transitions are wrapped as typed functions "onLogin" and "onLogout". 
Handle "expiration" event to handle expiration-state. While expiration-state you can refresh your token and relogin with new expiration timestamp.  

Object "User" has to have the following format: 
```
  admin: boolean;
  firstName: string;
  lastName: string;
  eMail: string;
  id: string;
```

Use **IUser** interface to cust you payload data.
```
interface IUser {
  admin: boolean;
  firstName: string;
  lastName: string;
  eMail: string;
  id: string;
}
```

## Test it
```
npm test
```
Explore '**src/app.spec.ts**' for more understanding.  

