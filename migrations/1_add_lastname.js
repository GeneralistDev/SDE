var bb = require('bluebird');

module.exports.id = 'add_lastname';

module.exports.up = function(done) {
  var coll = this.db.collection('entries');
  var cursor = coll.find();

  cursor.each(function(err, item) {
    console.log(item);
    if (item) {
      var fullNameParts = item.fullName.split(" ");
      if (fullNameParts.length === 2) {
        item.firstName = fullNameParts[0];
        item.lastName = fullNameParts[1];
      } else if (fullNameParts.length > 2) {
        item.lastName = fullNameParts.pop();
        fullNameParts.forEach(function(element) {
          if (!item.firstName) {
            item.firstName = element;
          } else {
            item.firstName = item.firstName + ' ' + element;
          }
        });
      } else {
        item.firstName = item.fullName;
        item.lastName = '';
      }

      delete item.fullName;
      coll.update({_id: item._id}, item);
    }
  });
};

module.exports.down = function(done) {
  var coll = this.db.collection('entries');

  coll.remove({}, done);
};
