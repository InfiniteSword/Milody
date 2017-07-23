const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
  id: String,
  userId: String,
  bg: String,
  bgUrl: String,
  bgmUrl: String,
  lrcUrl: String,
  bgm: String,
  title: String,
  singer: String,
  describe: String,
  options: {
    circle: {
      show: Boolean,
      colors: [{stop: String, color: String}],
      blurColor: String,
      rotate: Boolean
    },
    dots: {
      show: Boolean,
      colors: [{stop: String, color: String}],
      random: Boolean
    },
    line: {
      show: Boolean,
      colors: [{stop: String, color: String}],
      blurColor: String
    }
  }
});

workSchema.statics.add = async function (ctx, work) {
  await work.save();
  return { status: 'success', msg: '发布成功', work };
};

workSchema.statics.get = async function (ctx, id, userId) {
  let work = await this.findOne({ id });
  if (work && work.userId === userId) {
    return { status: 'success', msg: '已找到', work };
  }
  return { status: 'error', msg: '找不到这个作品哎! (* . * )', work };
};

workSchema.statics.getAll = async function (ctx, userId) {
  let works = await this.find({ userId });
  if (works) {
    return { status: 'success', msg: '已找到', works };
  }

  return { status: 'error', msg: '无作品', works };
};

let Work = mongoose.model('Work', workSchema);

module.exports = { Work };
