**Interview test task**


**Client**

Run `npm run build` to build analytics.js (output director - 'server/public/dist')

Add `var ANALYTICS_OPTIONS = {registerClicks:true};` before you include analytics.js to enable click event logging 

**Server API**

`Preconfigured MongoDB for test usage.`

Run `node ./bin/www.js` to start localhost:3000 server

Run `http://localhost:3000/` for demo

Run `npm run test` to start jest tests

`post    /init - init new user and page session`
   
`post    /collect - collect event data`

`get /search/byPageID (PageID) - get data by page ID`

`get /search/byBrowserName (browserName) - get data by browser name`

`get /search/byCountry (country) - get data by country name`

`get /search/byReturning - return session stats. Example {"new":0,"returning":4,"total":4,"rate":1}`

`get /clear - clear session data (only for testing)`
