'use strict';
const moment = require('moment');
const faker = require('faker');

var dbm;
var type;
var seed;


function escape(str) {
  return str.replace(/'/, "\\'")
}
/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const RANDOM_FIELDS = 10e5;
exports.up = function(db) {
  let sql = 'INSERT INTO books (title, date, autor, description, image) VALUES'
  for (let i = 0; i < RANDOM_FIELDS; i++) {
    sql = sql +
      `('${escape(faker.name.title())}', '${moment(faker.date.recent()).format('YYYY-MM-DD HH:mm:ss')}', '${escape(faker.name.firstName())}', '${escape(faker.lorem.lines(1))}', '${escape(faker.system.commonFileName())}')`;
    if (i !== RANDOM_FIELDS - 1) {
      sql = sql + ',';
    }
  }
  return db.runSql(sql + ';');
};

exports.down = function(db) {
  return db.runSql('TRUNCATE TABLE books;');
};

exports._meta = {
  "version": 1
};
