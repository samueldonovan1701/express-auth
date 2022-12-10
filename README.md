# express-cookie-session-auth

`express-cookie-session-auth` is a simple, customizable authentication and authorization manager for express-based applications.

While `express-cookie-session-auth` provides default in-memory user, group, and session managers, these can easily be overridden with developer-provided interfaces.

<hr/>

<table>
<tr>
    <td><A href="https://github.com/samueldonovan1701/express-cookie-session-auth">GitHub</a></td>
</tr>
<tr>
    <td><A href="https://github.com/samueldonovan1701/express-cookie-session-auth/wiki">Wiki</a></td>
</tr>
<tr>
    <td><A href="">npm</a></td>
</tr>
<tr>
    <td><A href="https://github.com/samueldonovan1701/express-cookie-session-auth/issues">Report an Issue</a></td>
</tr>
<tr>
    <td>Author: <a href="https://github.com/samueldonovan1701">Samuel Donovan</a></td>
</tr>
<tr>
    <td>License: <a href="http://creativecommons.org/licenses/by-sa/3.0/us/">Creative Commons Attribution-ShareAlike 3.0 United States License</a></td>
</tr>
</table>

# Install
<pre><code>
npm install express-cookie-session-auth
</code></pre>

# Setup
<pre><code>
const express = require('express');
const app = express();

app.use(express.json()); //Not always needed

const cookieParser = require('cookie-parser');
app.use(cookieParser("secret"));

const auth = require('express-cookie-session-auth');
app.use(auth);
</code></pre>

# Examples
### Get User
<pre><code>
app.get('/', (req, res) => {
    if(req.user)
        res.send(`Logged in as ${req.user.id}`);
    else
        res.send(`Not logged in`);
});
</code></pre>

### Users & Groups
<pre><code>
auth.users.add("John Doe", "password1234", {
    address: "1234 Main St.",
    phone: "(000)000-000"
});

auth.groups.new("example group", ["John Doe"]);

console.log(auth.users.get("John Doe");
console.log(auth.groups.with("John Doe");
</code></pre>

### Logging in/out
<pre><code>
app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.username;
    let loggedIn = auth.login(req, res, username, password);
    ...
});

app.post('/logout', (req, res) => {
    let loggedOut = auth.logout(req, res);
    ...
});
</code></pre>

### Restricting Access
<pre><code>
app.use("/admin", auth.onlyUsers("admin"));

app.use("/manage-users", auth.onlyGroups("managers"));
</code></pre>
# Dependencies

### <a href="https://expressjs.com/">Express</a>
`express-cookie-session-auth` is built specifically to be used with Express web framework for Node.js

Express is distributed under the <a href="https://creativecommons.org/licenses/by-sa/3.0/us/">Creative commons license</a>.

### <a href="https://www.npmjs.com/package/cookie-parser">cookie-parser</a>
`express-cookie-session-auth` uses cookies to track sessions, and `cookie-parser` makes this easier, as well as allow for the use of signed cookies.

`cookie-parser` is distributed under the <a href="https://github.com/expressjs/cookie-parser/blob/HEAD/LICENSE">MIT license</a>.

### <a href="https://expressjs.com/en/api.html#express.json">express.json()</a>
Used by the `auth.login.endpoint` for the username and password. Does not need to be used if `auth.login.endpoint` is never used.

This module is included with Express.

# License
This work is licensed under a <a href="http://creativecommons.org/licenses/by-sa/3.0/us/">Creative Commons Attribution-ShareAlike 3.0 United States License</a>.

# TODO
- Add `inEveryGroup` middleware and rename `onlyGroups` to `inOneGroup`
- Document built-in endpoints better
- Add req.isLoggedIn
- Document that req.user and req.groups are getters