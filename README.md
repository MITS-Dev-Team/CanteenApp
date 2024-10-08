# CanteenApp

### Setup (Development)
```bash
npm i
npm start
```

### Deployment
```
npm run build
```



MITS color: #FAB317
Font to use: https://fonts.google.com/specimen/Inter/tester - Tinkerhub font

Gets the current user details if there is an existing session.

    This method fetches the user object from the database instead of local session.
    This method is useful for checking if the user is authorized because it validates the user's access token JWT on the server.
    Should always be used when checking for user authorization on the server. On the client, you can instead use getSession().session.user for faster results. getSession is insecure on the server.
