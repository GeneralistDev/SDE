'use strict';

const fs = require('fs');
const bb = require('bluebird');
const lodash = require('lodash');
const path = require('path');

class Migrator {
  constructor(db, migrationsPath) {
    this.db = db;
    this.migrationsPath = migrationsPath;
  }

  migrate() {
    try {
      console.log(this.migrationsPath);
      var migrations = require(path.join(this.migrationsPath, 'index.js'));

      var orderedMigrationMap = [];

      console.log(migrations);

      return bb.each(Object.keys(migrations), function (key) {
        var keySplit = key.split('_', 1);
        var sequence = parseInt(keySplit[0]);
        orderedMigrationMap.splice(sequence - 1, 0, migrations[key]);
      }).bind(this)
        .then(function () {
          var coll = bb.promisifyAll(this.db.collection('migrations'));

          var db = this.db;

          return bb.each(orderedMigrationMap, function (item) {
            return coll.findOneAsync({ migration_id: item.id })
              .then(function (data) {
                if (!data) {

                  var migrationThis = {
                    db: db
                  };

                  console.log('Running migration', item.id);

                  item.up.bind(migrationThis)();

                  return coll.insertAsync({
                    migration_id: item.id
                  });
                }
              })
              .catch(function (err) {
                console.log(err);
              });
          }).bind(this);
        });

    } catch (err) {
      throw new Error(err);
    }
  }
};

module.exports = Migrator;
