const qs = require('qs');
const joi = require('joi');
const Router = require('koa-router');
const validate = require('koa-joi-validate');

const {createFilterQuery, createSortQuery, createInsertQuery, createUpdateQuery} = require('../lib/db/queryBuilder');
const {cacheBooks, cacheEventEmitter} = require('../lib/cache');

const INSERT_SCHEMA = {
    title: joi.string(),
    date: joi.date(),
    autor: joi.string(),
    description: joi.string(),
    image: joi.string(),
};
const TABLE = 'books';

const bookInsertValidator = validate({
    body: INSERT_SCHEMA
});
const bookUpdateValidator = validate({
    body: {...INSERT_SCHEMA, id: joi.number().required()}
});

const books = new Router();

books.get('/', cacheBooks('addCache', 'removeAllCache'), async ctx => {
    try {
        let sql = `SELECT * FROM ${TABLE}`;
        const {querystring} = ctx.request;
        const query = qs.parse(querystring);
        const {title, id, date, autor, description, image, limit = 1000, offset = 0, sort,} = query;
        const filterQuery = createFilterQuery({
            title, id, date, autor, description, image
        }, ctx.db);

        if (filterQuery.length) {
            sql = `${sql} WHERE ${filterQuery}`;
        }

        if (sort) {
            sql = `${sql} ${createSortQuery(sort)}`;
        }

        sql = `${sql} LIMIT ${limit} OFFSET ${offset};`;

        const result = await ctx.db.query(sql);
        const originalUrl = ctx.request.originalUrl;
        cacheEventEmitter.emit('addCache', {data: result, key: originalUrl});
        ctx.body = result;
    } catch (err) {
        console.error(err);
        ctx.throw(500, err.message);
    }
});

books.post('/', bookInsertValidator, async ctx => {
    try {
        const newBook = ctx.request.body;
        const sql = `INSERT INTO ${TABLE} ${createInsertQuery(newBook)}`;
        await ctx.db.query(sql);
        cacheEventEmitter.emit('removeAllCache');
        ctx.body = 'success';
    } catch (err) {
        console.error(err);
        ctx.throw(500, err.message);
    }
});

books.put('/', bookUpdateValidator, async ctx => {
    try {
        const updateBook = ctx.request.body;

        const {id} = updateBook;
        const filterQuery = createFilterQuery({
            id: {
                eq: id,
            },
        });
        const searchBookQuery = `SELECT * FROM ${TABLE} WHERE ${filterQuery}`;
        const [book] = await ctx.db.query(searchBookQuery);
        if (!book) {
            ctx.status = 404;
            ctx.body = `Couldn't found book with id=${id}`;
            return;
        }

        delete updateBook.id;
        const updateSql = `UPDATE ${TABLE} SET ${createUpdateQuery(updateBook)} WHERE ${filterQuery}`;
        await ctx.db.query(updateSql);

        const [updatedBook] = await ctx.db.query(searchBookQuery);
        cacheEventEmitter.emit('removeAllCache');
        ctx.body = updatedBook;
    } catch (err) {
        console.error(err);
        ctx.throw(500, err.message);
    }
});

module.exports = books;
