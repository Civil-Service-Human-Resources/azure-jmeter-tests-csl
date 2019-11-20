## Data Loader Guide
`app.js` is a node.js (>=v8) based application can load user data in batches into databases IDENTITY and CSRS.

### How to run
```
# To import dependencies
npm install
# To run the app 
# -- SHOULD_TRUNCATE: should truncate loaded data or not; default: true
# -- PAGE: it is in fact a batch number, used in conjunction with USERS_TO_LOAD: i.e. batch size; both are used to generate user's email
# -- ID_ROLE: identity role, e.g. 1->learner, 2-> learner manager
DB_HOST=db-host DB_USER=db-user DB_PASS=user-pwd SHOULD_TRUNCATE=false PAGE={1..n} ID_ROLE={1..n} USERS_TO_LOAD=1000 node app.js
```
