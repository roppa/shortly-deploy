var db = require('../config');
var crypto = require('crypto');

var Links = new db.Schema({
  visits : Number,
  code: String,
  createdDate: { type: Date, default: Date.now }
});

module.exports = Links;

/*
{
  tableName: 'urls',
  hasTimestamps: true,
  defaults: {
    visits: 0
  },
  initialize: function(){
    this.on('creating', function(model, attrs, options){

      var shasum = crypto.createHash('sha1');
      shasum.update(model.get('url'));
      this.code = shasum.digest('hex').slice(0, 5));

    });
  }
}
*/
*

module.exports = Link;