# CanteenApp

### Setup (its fucked up)

```bash
nvm install 16.14
npm install yarn -g
yarn global add create-react-app
```

MITS color: #FAB317
Font to use: https://fonts.google.com/specimen/Inter/tester - Tinkerhub font

- https://fonts.google.com/specimen/Poppins

Todo:

- Create a bottom Navbar
- https://codepen.io/chrisgannon/pen/KyzNoa
  References:

https://dev.to/supabase/what-is-oauth-setting-up-github-oauth-with-supabase-44le

https://supabase.com/docs/guides/auth/auth-user-management

Retrieve a user:

const user = await supabase.auth.getSession();
console.log(user.data.session.user.user_metadata.full_name);

Gets the current user details if there is an existing session.

    This method fetches the user object from the database instead of local session.
    This method is useful for checking if the user is authorized because it validates the user's access token JWT on the server.
    Should always be used when checking for user authorization on the server. On the client, you can instead use getSession().session.user for faster results. getSession is insecure on the server.
