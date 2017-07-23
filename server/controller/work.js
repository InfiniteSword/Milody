const multer = require('koa-multer');
const {Work} = require('../model/work');
const {ID} = require('../model/id');
const serverUrl = require('../config');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.dirname(require.main.filename) + '/upload/');
  },
  filename: function (req, file, cb) {
    let fileFormat = (file.originalname).split('.');
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1]);
  }
});
const upload = multer({storage: storage});
const files = upload.fields([{ name: 'bg_file', maxCount: 1 }, { name: 'bgm_file', maxCount: 1 }, { name: 'lrc_file', maxCount: 1 }]);

module.exports = function workAPI (router) {
  router.post('/api/addWork', files, async (ctx, next) => {
    let {
      userId,
      bg,
      bgm,
      title,
      singer,
      describe,
      options
    } = ctx.req.body;
    let lrcUrl = '';
    let bgUrl = '';
    let bgmUrl = '';
    if (ctx.req.files['lrc_file']) {
      lrcUrl = serverUrl + '/' + ctx.req.files['lrc_file'][0].filename;
    }
    if (ctx.req.files['bg_file']) {
      bgUrl = serverUrl + '/' + ctx.req.files['bg_file'][0].filename;
    }
    if (ctx.req.files['bgm_file']) {
      bgmUrl = serverUrl + '/' + ctx.req.files['bgm_file'][0].filename;
    }
    let _options = JSON.parse(options);

    let id = await ID.get(ctx, 'work');

    if (id.status === 'success') {
      await ID.add(ctx, 'work');
    }
    if (id.status === 'error') {
      let id = new ID({
        type: 'work',
        value: 1
      });
      await ID.create(ctx, id);
    }

    let idV = id.value || id.id.value;

    let work = new Work({
      id: idV,
      userId,
      bg,
      bgm,
      bgUrl,
      bgmUrl,
      lrcUrl,
      title,
      singer,
      describe,
      options: _options
    });

    let res = await Work.add(ctx, work);

    if (res.status === 'success') {
      ctx.response.body = JSON.stringify(res.work);
      return true;
    }
    if (res.status === 'error') {
      ctx.response.body = 'error';
      return false;
    }
  });
  router.post('/api/getWork', async (ctx, next) => {
    let {
      userId,
      id
    } = JSON.parse(ctx.request.body);

    let res = await Work.get(ctx, id, userId);

    if (res.status === 'success') {
      ctx.body = JSON.stringify(res.work);
      return true;
    }
    if (res.status === 'error') {
      ctx.body = JSON.stringify({status: res.status, message: res.msg});
      return false;
    }
  });
  router.post('/api/getWorksByUser', async (ctx, next) => {
    let {
      id
    } = JSON.parse(ctx.request.body);

    let res = await Work.getAll(ctx, id);

    if (res.status === 'success') {
      ctx.body = JSON.stringify({status: res.status, message: res.msg, works: res.works});
      return true;
    }
    if (res.status === 'error') {
      ctx.body = JSON.stringify({status: res.status, message: res.msg});
      return false;
    }
  });
};
