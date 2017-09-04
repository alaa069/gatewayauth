const mongoose = require('mongoose')
    , Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

var token = new Schema({
      token        : { type: String}
    , created_at   : { type: Date, default: Date.now, expires: '7d'}
})

var user_list = new Schema({
      username       : { type: String, required: true, unique : true}
    , password       : { type: String, required: true}
    , token          : token
    , idUser         : { type: String }
    , role           : { type: String }
    , created_at     : { type: Date, default: Date.now}
    , timeUpdate     : { type: String}
    , updated_at     : { type: Date, expires: '360d'}
})

user_list.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

user_list.plugin(mongoosePaginate)

var user  = mongoose.model('gatewayUsers', user_list);

module.exports = {
  GU: user
};
