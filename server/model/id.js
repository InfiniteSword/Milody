const mongoose = require('mongoose');

const idSchema = new mongoose.Schema({
  type: String,
  value: {type: Number, default: 1}
});

idSchema.statics.add = async function (ctx, type) {
  let i = await this.findOne({ type });
  await this.update({type: type}, {$set: {value: i.value + 1}});
  return { status: 'success', msg: 'value自增', id: i };
};

idSchema.statics.create = async function (ctx, id) {
  await id.save();
  return { status: 'success', msg: 'value自增', id: id };
};

idSchema.statics.get = async function (ctx, type) {
  let i = await this.findOne({ type });
  if (i) {
    return { status: 'success', msg: '已找到', id: i };
  }
  return { status: 'error', msg: '没有该类别', id: i };
};

let ID = mongoose.model('ID', idSchema);

module.exports = { ID };
