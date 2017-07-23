const mongoose = require('mongoose');
const md5 = require('../utils/md5');

const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  avatar: String,
  thumb: String,
  email: String,
  password: String
});
userSchema.statics.add = async function (ctx, user) {
  let emailAlreadyIn = await this.findOne({ email: user.email });
  if (emailAlreadyIn) {
    return { status: 'error', msg: '此邮箱已注册' };
  }
  user.password = md5(user.password);
  await user.save();
  user.password = null;
  return { status: 'success', msg: '注册成功', user };
};
userSchema.statics.change = async function (ctx, id, content) {
  await this.update({id: id}, {$set: content});
  let user = await this.findOne({ id });
  user.password = null;
  return { status: 'success', msg: '修改成功', user };
};
userSchema.statics.get = async function (ctx, id) {
  let user = await this.findOne({ id });
  if (!user) {
    return { status: '404', msg: '找不到这位创作者呢! (x . x )' };
  }
  user.password = null;
  return { status: 'success', msg: '注册成功', user };
};
userSchema.statics.login = async function (ctx, email, password) {
  let user = await this.findOne({ email });
  if (user) {
    if (md5(password) === user.password) {
      user.password = null;
      return { status: 'success', msg: '登录成功', user };
    }
    return { status: 'error', msg: '密码错误', user };
  }
  return { status: 'error', msg: '邮箱未注册', user };
};
let User = mongoose.model('User', userSchema);

module.exports = { User };
