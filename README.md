adal-issue
==========

## Purpose
This repo serves to illustrate an ADAL issue documented [here](https://github.com/AzureAD/azure-activedirectory-library-for-js/issues/543). This has also been written up on StackOverflow [here](http://stackoverflow.com/questions/43552389/adal-js-doesnt-refresh-token-properly).

## Preflight
1. Clone the repository. `git clone https://github.com/bllfrnch/adal-issue.git`
2. `npm install`
3. Change to the `js` directory
4. Open the file  `index.js`
5. Edit the `AUTH_CONFIG` constant so it reflects values that reflect your own environment.

## NPM Scripts
* `npm run start` – starts the development web server on port 5000
* `npm run build` – builds the application to `build` directory
* `npm run watch` – runs webpack watch for development

## Seeing the problem
Once you've started the development web server, visit http://YOURHOST:5000/ – this will load index.html, and the Javascript will use adal.js to determine whether your user has a token or not, and if not will change the window.location to /login.html. Obviously this isn't a secure solution, but it illustrates the problem simply, without need for much aside from some simple applications setup.

Once your user has authenticated against AD, your browser will be redirected to whatever is set in the `AUTH_CONFIG` variable, and your user will be considered logged in. At this point, the application uses `window.setInterval` to call `adal.acquireToken()` every minute. Verbose logging has been enabled for adal.js, and the output is as follows. You can see that after 50 minutes, the application is no longer able to acquire a token. I've liberally removed anything that looks at all unique or sensitive, so please let me know if there's anything else you need to help identify what might be going on.

    Mon, 01 May 2017 22:00:57 GMT:1.0.14-VERBOSE: Expected state: 0217fd90-642d-4cd0-83a2-1dc717da244b startPage:<REDACTED>
    2017-05-01 18:00:57.854 web.otis.com:5000/build/index.js:1757 Mon, 01 May 2017 22:00:57 GMT:1.0.14-INFO: Navigate url:https://login.microsoftonline.com/<REDACTED>
    2017-05-01 18:00:57.855 <REDACTED>:1757 Mon, 01 May 2017 22:00:57 GMT:1.0.14-INFO: Navigate to:https://login.microsoftonline.com/<REDACTED>
    2017-05-01 18:00:59.131 Navigated to https://login.microsoftonline.com/<REDACTED>
    2017-05-01 18:01:04.921 Navigated to <REDACTED>
    2017-05-01 18:01:05.490 adal.js:1468 Mon, 01 May 2017 22:01:05 GMT:1.0.14-VERBOSE: State: <REDACTED>
    2017-05-01 18:01:05.495 adal.js:1468 Mon, 01 May 2017 22:01:05 GMT:1.0.14-INFO: Returned from redirect url
    2017-05-01 18:01:05.497 adal.js:1468 Mon, 01 May 2017 22:01:05 GMT:1.0.14-INFO: State status:true; Request type:LOGIN
    2017-05-01 18:01:05.498 adal.js:1468 Mon, 01 May 2017 22:01:05 GMT:1.0.14-INFO: State is right
    2017-05-01 18:01:05.499 adal.js:1468 Mon, 01 May 2017 22:01:05 GMT:1.0.14-INFO: Fragment has id token
    2017-05-01 18:01:05.522 adal.js:1468 Mon, 01 May 2017 22:01:05 GMT:1.0.14-INFO: Token is already in cache for resource:<REDACTED>
    2017-05-01 18:01:05.576 index.js:45 token acquired for user, forwarding to internal page that requires auth...
    2017-05-01 18:01:05.936 Navigated to <REDACTED>
    2017-05-01 18:01:06.413 adal.js:1468 Mon, 01 May 2017 22:01:06 GMT:1.0.14-INFO: Token is already in cache for resource:<REDACTED>
    2017-05-01 18:01:06.490 index.js:45 token acquired for user, forwarding to internal page that requires auth...
    2017-05-01 18:02:06.420 adal.js:1468 Mon, 01 May 2017 22:02:06 GMT:1.0.14-INFO: Token is already in cache for resource:<REDACTED>
    2017-05-01 18:02:06.422 index.js:62 Token acquired!
    2017-05-01 18:03:06.423 adal.js:1468 Mon, 01 May 2017 22:03:06 GMT:1.0.14-INFO: Token is already in cache for resource:<REDACTED>
    2017-05-01 18:03:06.426 index.js:62 Token acquired!
    2017-05-01 18:04:06.428 adal.js:1468 Mon, 01 May 2017 22:04:06 GMT:1.0.14-INFO: Token is already in cache for resource:<REDACTED>
    2017-05-01 18:04:06.430 index.js:62 Token acquired!

    This goes on for awhile until ...

    Token acquired!
    2017-05-01 18:53:06.597 adal.js:1468 Mon, 01 May 2017 22:53:06 GMT:1.0.14-INFO: Token is already in cache for resource:<REDACTED>
    2017-05-01 18:53:06.598 index.js:62 Token acquired!
    2017-05-01 18:54:06.604 adal.js:1468 Mon, 01 May 2017 22:54:06 GMT:1.0.14-INFO: Token is already in cache for resource:<REDACTED>
    2017-05-01 18:54:06.604 index.js:62 Token acquired!
    2017-05-01 18:55:06.594 adal.js:1468 Mon, 01 May 2017 22:55:06 GMT:1.0.14-INFO: Token is already in cache for resource:<REDACTED>
    2017-05-01 18:55:06.595 index.js:62 Token acquired!
    2017-05-01 18:56:06.612 adal.js:1468 Mon, 01 May 2017 22:56:06 GMT:1.0.14-WARNING: User login is required
    2017-05-01 18:57:06.599 adal.js:1468 Mon, 01 May 2017 22:57:06 GMT:1.0.14-WARNING: User login is required
    2017-05-01 18:58:06.668 adal.js:1468 Mon, 01 May 2017 22:58:06 GMT:1.0.14-WARNING: User login is required
    2017-05-01 18:59:06.596 adal.js:1468 Mon, 01 May 2017 22:59:06 GMT:1.0.14-WARNING: User login is required
    2017-05-01 19:00:06.611 adal.js:1468 Mon, 01 May 2017 23:00:06 GMT:1.0.14-WARNING: User login is required

That is, after 55 minutes, the application is unable to renew its token.
