'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.runSql(`
    CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(256),
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      autor VARCHAR(350),
      description TEXT,
      image VARCHAR(1024)
    );
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DROP TABLE IF EXISTS books;
  `);
};

exports._meta = {
  "version": 1
};
