const mongoose = require('mongoose');

const NewProductSchema = mongoose.Schema({
   // _id:mongoose.Schema.Types.ObjectId,
    name:{type: String,required:true},
    price:{type: Number,required:true},
    feature:{type: Number,required:true},
    rating:{type: Number,default:4.0},
    createdAt:{type:Date,default:Date.now()},
    company:{type: String,enum:{
values:["apple","samsung","mi","dell"],
message:'{VALUE} is not supported',
    },},
});
module.exports = mongoose.model('NewProducts',NewProductSchema);