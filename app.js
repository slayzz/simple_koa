const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');

const MysqlDB = require('./src/lib/db/db');
const booksRoutes = require('./src/routes/books');

const books = new Router();
const app = new Koa();

app.context.db = new MysqlDB({ host: 'localhost', database: 'db', user: 'user', password: 'password' });

app.use(koaBody());

books.use('/books', booksRoutes.routes(), booksRoutes.allowedMethods());
app.use(books.routes())

app.listen(3000);
