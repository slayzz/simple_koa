# Simple koa server
## Requirements
- nodejs
- docker & docker-compose

## Install
1. `Run npm install`
2. `docker-compose up`
3. `npm run migate \-- up` (To fill database)
4.  `node app.js`

# Features

###`GET /books?id[eq]=1&title[gte]=Van` 

Query with filter, sort, limits, offset (to filter by column - id[eq]=1 or title[lte]=Van)
##### Example
> - To filter syntax: id[eq]=100, title[gte]=Van
> - To sort: sort=title.desc
> - To limit and offset: limit=100&offset=10

### `POST /books`
To add new book , use raw Json, names of columns identical as in MySQL db.
##### Example
>`
	{ "title": "Hello", "description": "best book", ...}
`

### `PUT /books`
 To update book you alwayss need to use id in that case.
##### Example
>`
	{"id": 3, "title": "Hello", "description": "best book", ...}
`
