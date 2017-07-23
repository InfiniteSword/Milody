<template>
    <div>
        <loading v-if="loading"></loading>
        <panel :show.sync="showHelp" :title="'帮助'" :contents="helpContents"></panel>
        <span class="iconfont side-toggle-btn" :style="sideOn?'':'left:20px'" @click="toggleSide">{{sideOn?'&#xe604;':'&#xe660;'}}</span>
        <div class="sidebar" :style="sideOn?'':'left:-500px'">
            <h3 class="side-title">文件<span class="side-btn_help" @click="panelShow">帮助</span></h3>
            <form>
                <div class="side-form-section">
                    <h6>背景：</h6>
                    <label for="bg" class="side-input_file">
                        <span>选择文件</span>
                    </label>
                    <input id="bg" type="file" @change="choseBg" accept="image/png, image/jpeg, image/gif, image/jpg">
                </div>
                <div class="side-form-section">
                    <h6>音乐：</h6>
                    <label for="bgm" class="side-input_file">
                        <span>选择文件</span>
                    </label>
                    <input id="bgm" type="file" @change="choseMusic" accept="audio/x-mpeg">
                </div>
                <div class="side-form-section">
                    <h6>歌词：</h6>
                    <label for="lrc" class="side-input_file">
                        <span>选择文件</span>
                    </label>
                    <input id="lrc" type="file" @change="choseLrc" accept=".lrc">
                </div>
            </form>
            <h3 class="side-title">配置</h3>
            <form>
                <div class="side-form-section">
                    <h6>作品名 <span class="important">*</span></h6>
                    <div class="text side-title_text">
                        <label><input type="text" autocomplete="off" spellcheck="false" v-model="title"></label>
                    </div>
                    <br>
                    <h6>音乐名</h6>
                    <div class="text side-title_text">
                        <label><input type="text" autocomplete="off" spellcheck="false" v-model="bgm"></label>
                    </div>
                    <br>
                    <h6>音乐作者</h6>
                    <div class="text side-title_text">
                        <label><input type="text" autocomplete="off" spellcheck="false" v-model="singer"></label>
                    </div>
                    <br>
                    <h6>背景作者</h6>
                    <div class="text side-title_text">
                        <label><input type="text" autocomplete="off" spellcheck="false" v-model="bg"></label>
                    </div>
                    <br>
                    <h6>简介</h6>
                    <div class="text side-title_text">
                        <label><input type="text" autocomplete="off" spellcheck="false" v-model="describe"></label>
                    </div>
                    <!--<div class="textarea side-title_textarea">-->
                        <!--<label><textarea v-model="describe"></textarea></label>-->
                    <!--</div>-->
                    <br>
                    <h6>圆圈动画</h6>
                    <div class="switch side-title_switch">
                        <label><input type="checkbox" @change="toggleShow('circle')" :checked="options.circle.show"><span class="lever"></span></label>
                    </div>
                    <div class="side-input_options" v-show="options.circle.show">
                        <div class="side-input_option">
                            <span class="side-input_title">颜色(渐变)：</span>
                            <span class="side-input-add" @click="addColor('circle')">+</span>
                            <div v-for="(item, index) in options.circle.colors">
                                <div class="side-input_text side-input_text_stop">
                                    渐变点: <input type="text" @change="changeStop('circle', index, $event)" :value="item.stop" />
                                </div>
                                <div class="side-input_text side-input_text_color">
                                    渐变色: <input type="text" @change="changeColor('circle', index, $event)" :value="item.color" />
                                </div>
                                <span v-show="index!=0" @click="deleteColor('circle',index)" class="iconfont side-input-delete">&#xe604;</span>
                            </div>
                            <span>颜色(模糊)：</span>
                            <div>
                                <div class="side-input_text">
                                    模糊色: <input type="text" @change="changeBlur('circle', $event)" :value="options.circle.blurColor" />
                                </div>
                            </div>
                            <span>旋转：</span>
                            <div class="switch side-input_switch">
                                <label><input type="checkbox" @change="toggleRotate()" :checked="options.circle.rotate"><span class="lever"></span></label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="side-form-section">
                    <h6>线条动画</h6>
                    <div class="switch side-title_switch">
                        <label><input type="checkbox" @change="toggleShow('line')" :checked="options.line.show"><span class="lever"></span></label>
                    </div>
                    <div class="side-input_options" v-show="options.line.show">
                        <span class="side-input_title">颜色(渐变)：</span>
                        <span class="side-input-add" @click="addColor('line')">+</span>
                        <div v-for="(item, index) in options.line.colors">
                            <div class="side-input_text side-input_text_stop">
                                渐变点: <input type="text" @change="changeStop('line', index, $event)" :value="item.stop" />
                            </div>
                            <div class="side-input_text side-input_text_color">
                                渐变色: <input type="text" @change="changeColor('line', index, $event)" :value="item.color" />
                            </div>
                            <span v-show="index!=0" @click="deleteColor('line',index)" class="iconfont side-input-delete">&#xe604;</span>
                        </div>
                        <span>颜色(模糊)：</span>
                        <div>
                            <div class="side-input_text">
                                模糊色: <input type="text" @change="changeBlur('line', $event)" :value="options.line.blurColor" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="side-form-section">
                    <h6>光点动画</h6>
                    <div class="switch side-title_switch">
                        <label><input type="checkbox" @change="toggleShow('dots')" :checked="options.dots.show"><span class="lever"></span></label>
                    </div>
                    <div class="side-input_options" v-show="options.dots.show">
                        <span class="side-input_title">颜色：</span>
                        <div class="side-input_text side-input_text_color">
                            <input type="text" @change="changeColor('dots', 0, $event)" :value="options.dots.color" />
                        </div>
                        <br>
                        <span>随机颜色：</span>
                        <div class="switch side-input_switch">
                            <label><input type="checkbox" @change="toggleRandom()" :checked="options.dots.random"><span class="lever"></span></label>
                        </div>
                    </div>
                </div>
            </form>
            <div class="side-btn_finish" @click="backHome">返回</div>
            <div class="side-btn_finish" @click="sendData">确定</div>
        </div>
        <div class="work-preview" :style="bgUrl!==''?'background:url('+ bgUrl +') no-repeat center/cover;':''"></div>
        <canvas id="work-canvas-circle"></canvas>
        <canvas id="work-canvas-line"></canvas>
        <canvas id="work-canvas-dots"></canvas>
        <audio id="work-audio" :src="audioSrc" autoplay></audio>
        <span class="info_title">{{title}}</span>
        <span class="info_bgm" v-if="bgm != ''">Music: {{bgm}} <span v-if="singer != ''">-</span> {{singer}}</span>
        <span class="info_bg" v-if="bg !== ''">BG Artist: {{bg}}</span>
        <div class="work-result" v-show="uploading">
            <div class="work-result-box work-uploading" v-show="shareLink===''">
                上传文件中...
            </div>
            <div class="work-result-box" v-show="shareLink!==''">
                发布成功！将这个链接分享给朋友吧：<input autocomplete="off" spellcheck="false" type="text" :value="shareLink" />
                <div class="work-result-btn" @click="backHome">返回主页</div>
            </div>
        </div>
    </div>
</template>

<script>
  import Milody from '../scripts/Milody';
  import clientUrl from '../scripts/ClientUrl';
  import CircleAnimate from '../scripts/CircleAnimate';
  import LineAnimate from '../scripts/LineAnimate';
  import DotsAnimate from '../scripts/DotsAnimate';
  import showToast from '../scripts/showToast';
  import serverUrl from '../scripts/url';
  import Loading from './Loading.vue';
  import Panel from './Panel.vue';

  export default {
    components: { Loading, Panel },
    data: function () {
      return {
        showHelp: false,
        helpContents: ['1、您在使用"绘音"时，需要先选择您要分享的音乐文件(必要)，再按照您的需要添加背景图片以及lrc格式的歌词文件(可以不添加)。', '2、在配置选项中，作品名是必需的，它表示的是您作品的主题，其他相关信息请根据您的需要进行填写(可以不填写)。', '3、您有三种频谱动画可以选择，我们为您预设了一部分样式，您可以根据自己的喜好进行修改。', '4、渐变颜色中的渐变点是个0到1的值，它表示该颜色在屏幕相对右下角的位置进行渐变(右下角的位置为0)；渐变颜色中的渐变色能有两种格式，一种为16进制色(如：#66CCFF)，一种为rgb颜色(如：rgb(255,156,156))，假如您没有想好要用的颜色，您可以在http://materializecss.com/color.html选取您喜欢的颜色。'],
        shareLink: '',
        uploading: false,
        loading: true,
        bgUrl: '',
        audioSrc: '',
        logedIn: false,
        sideOn: true,
        userId: '',
        username: '',
        bg: '',
        bgm: '',
        title: '',
        singer: '',
        lrcUrl: '',
        describe: '',
        options: {
          circle: {
            show: true,
            colors: [{
              stop: '0.3',
              color: '#66CCFF'
            }, {
              stop: '0.5',
              color: '#CCFFCC'
            }, {
              stop: '0.7',
              color: '#CC66FF'
            }],
            blurColor: '#FFFFFF',
            rotate: false
          },
          dots: {
            show: false,
            color: '#FFFFFF',
            random: true
          },
          line: {
            show: false,
            colors: [{
              stop: '0.3',
              color: '#66CCFF'
            }, {
              stop: '0.5',
              color: '#CCFFCC'
            }, {
              stop: '0.7',
              color: '#CC66FF'
            }],
            blurColor: '#FFFFFF'
          }
        }
      };
    },
    watch: {
      audioSrc: function (v) {
        if (v) {
          const that = this;
          const audio = document.querySelector('#work-audio');
          const circle = document.querySelector('#work-canvas-circle');
          const line = document.querySelector('#work-canvas-line');
          const dots = document.querySelector('#work-canvas-dots');
          let milody = new Milody(audio);
          milody.init();
          let lastArrCircle = [];
          let lastArrLine = [];
          let lastArrDots = [];
          function animate () {
            const SCREEN_WIDTH = window.innerWidth;
            const SCREEN_HEIGHT = window.innerHeight;
            that.array = milody.analyse();
            if (that.options.circle.show) {
              lastArrCircle = CircleAnimate(circle, that.array, lastArrCircle, {
                colors: that.options.circle.colors,
                blurColor: that.options.circle.blurColor,
                rotate: that.options.circle.rotate
              });
            } else {
              circle.getContext('2d').clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            }
            if (that.options.line.show) {
              lastArrLine = LineAnimate(line, that.array, lastArrLine, {
                colors: that.options.line.colors,
                blurColor: that.options.line.blurColor
              });
            } else {
              line.getContext('2d').clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            }
            if (that.options.dots.show) {
              lastArrDots = DotsAnimate(dots, that.array, lastArrDots, {
                color: that.options.dots.color,
                random: that.options.dots.random
              });
            } else {
              dots.getContext('2d').clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            }
            window.requestAnimationFrame(animate);
          }
          window.requestAnimationFrame(animate);
        }
      }
    },
    created: function () {
      let that = this;
      fetch(serverUrl + '/api/loggedIn', {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        cache: 'default'
      }).then((res) => {
        return res.json();
      }).then((data) => {
        if (typeof data.id !== 'undefined') {
          that.userId = data.id;
          that.username = data.username;
          that.logedIn = true;
        } else {
          showToast('请先登录！');
          that.$router.push('/');
        }
        that.loading = false;
      }).catch((err) => {
        return err.toString();
      });
    },
    methods: {
      panelShow: function () {
        this.showHelp = true;
      },
      toggleSide: function () {
        this.sideOn = !this.sideOn;
      },
      choseBg: function (e) {
        let file = e.target.files[0];
        this.bgUrl = URL.createObjectURL(file);
      },
      choseLrc: function (e) {
        let file = e.target.files[0];
        this.lrcUrl = URL.createObjectURL(file);
      },
      choseMusic: function (e) {
        let file = e.target.files[0];
        let temp = file.name.split('.');
        let str = '';
        for (let i = 0; i < temp.length - 1; i++) {
          if (i === 0) {
            str = str + temp[i];
          } else {
            str = '.' + str + temp[i];
          }
        }
        this.bgm = str;
        this.audioSrc = URL.createObjectURL(file);
      },
      addColor: function (type) {
        switch (type) {
          case 'circle':
            this.options.circle.colors.push({
              stop: '1',
              color: '#FFFFFF'
            });
            break;
          case 'line':
            this.options.line.colors.push({
              stop: '1',
              color: '#FFFFFF'
            });
            break;
          case 'dots':
            this.options.dots.colors.push({
              stop: '1',
              color: '#FFFFFF'
            });
            break;
        }
      },
      deleteColor: function (type, i) {
        switch (type) {
          case 'circle':
            this.options.circle.colors.splice(i, 1);
            break;
          case 'line':
            this.options.line.colors.splice(i, 1);
            break;
          case 'dots':
            this.options.dots.colors.splice(i, 1);
            break;
        }
      },
      changeStop: function (type, i, e) {
        let v = e.target.value;
        v = v - 0;
        if (v > 1 || v < 0) {
          showToast('请输入 0 ~ 1 的小数');
          e.target.value = this.options.circle.colors[i].stop;
          return true;
        }
        switch (type) {
          case 'circle':
            this.options.circle.colors[i].stop = v;
            break;
          case 'line':
            this.options.line.colors[i].stop = v;
            break;
        }
      },
      changeColor: function (type, i, e) {
        switch (type) {
          case 'circle':
            this.options.circle.colors[i].color = e.target.value;
            break;
          case 'line':
            this.options.line.colors[i].color = e.target.value;
            break;
          case 'dots':
            this.options.dots.color = e.target.value;
            break;
        }
      },
      changeBlur: function (type, e) {
        switch (type) {
          case 'circle':
            this.options.circle.blurColor = e.target.value;
            break;
          case 'line':
            this.options.line.blurColor = e.target.value;
            break;
          case 'dots':
            this.options.dots.blurColor = e.target.value;
            break;
        }
      },
      toggleShow: function (type) {
        switch (type) {
          case 'circle':
            this.options.circle.show = !this.options.circle.show;
            break;
          case 'line':
            this.options.line.show = !this.options.line.show;
            break;
          case 'dots':
            this.options.dots.show = !this.options.dots.show;
            break;
        }
      },
      toggleRotate: function () {
        this.options.circle.rotate = !this.options.circle.rotate;
      },
      toggleRandom: function () {
        this.options.dots.random = !this.options.dots.random;
      },
      backHome: function () {
        this.$router.push('/');
      },
      sendData: function () {
        if (this.title === '') {
          showToast('作品名必须填哦！');
          return false;
        }
        this.uploading = true;
        let that = this;
        let data = new FormData();
        let bgFile = document.querySelector('#bg');
        let bgmFile = document.querySelector('#bgm');
        let lrcFile = document.querySelector('#lrc');
        data.append('userId', this.userId);
        data.append('bg', this.bg);
        data.append('bgm', this.bgm);
        data.append('title', this.title);
        data.append('singer', this.singer);
        data.append('describe', this.describe);
        data.append('options', JSON.stringify(this.options));
        data.append('bg_file', bgFile.files[0]);
        data.append('bgm_file', bgmFile.files[0]);
        data.append('lrc_file', lrcFile.files[0]);
        fetch(serverUrl + '/api/addWork', {
          method: 'POST',
          body: data,
          mode: 'cors',
          cache: 'default'
        }).then(function (res) {
          return res.json();
        }).then(function (data) {
          showToast('上传成功', '#69f0ae');
          that.shareLink = clientUrl + '/#/' + that.userId + '/' + data.id;
        });
      }
    }
  };
</script>

<style lang="scss">
    .work-preview{
        width: 100vw;
        height: 100vh;
        background: url("../assets/img/geometry2.png");
    }
    #work-canvas-circle{
        position: absolute;
        background: none;
        top: 0;
        left: 0;
    }
    #work-canvas-line{
        position: absolute;
        background: none;
        top: 0;
        left: 0;
    }
    #work-canvas-dots{
        position: absolute;
        background: none;
        top: 0;
        left: 0;
    }

    .sidebar{
        font-family: Exo,'-apple-system','Open Sans',HelveticaNeue-Light,'Helvetica Neue Light','Helvetica Neue','Hiragino Sans GB','Microsoft YaHei',Helvetica,Arial,sans-serif;
        position: fixed;
        top: 0;
        left: -50px;
        width: 500px;
        height: 100vh;
        overflow-y: scroll;
        color: #333;
        box-sizing: border-box;
        padding-left: 70px;
        background: rgba(255,255,255,.5);
        box-shadow: 0 0 10px 2px rgba(0,0,0,.3);
        transition: .6s cubic-bezier(.87,-0.45,.41,1.42);
        z-index: 99;
        @media(max-width: 500px){
            padding-top: 20px;
            width: 100%;
            left: 0;
            padding-left: 10px;
            font-size: .8em;
        }
    }
    .side-btn_help{
        float: right;
        margin-right: 20px;
        font-size: 18px;
        line-height: 36px;
        color: #66ccff;
        cursor: pointer;
    }
    .side-title_text{
        float: right;
        margin-right: 100px;
        @media(max-width: 500px){
            margin-right: 30px;
        }
    }
    .side-title_textarea textarea{
        width: 169px;
        max-width: 169px;
        height: 75px;
        margin-top: -20px;
        margin-left: 155px;
        resize:none;
        border: none;
        border-bottom: 1px #666 solid;
        @media(max-width: 500px){
            float: right;
            margin-right: 30px;
        }
    }
    .side-toggle-btn{
        position: fixed;
        z-index: 999;
        top: 10px;
        left: 470px;
        font-size: 24px;
        text-shadow: 0 0 10px rgba(0,0,0,.6);
        color: rgba(255,255,255,.7);
        cursor: pointer;
        transition: .6s cubic-bezier(.87,-0.45,.41,1.42);
        @media(max-width: 500px){
            top: 10px;
            left: 90%;
        }
    }
    .side-toggle-btn:hover{
        text-shadow: 0 0 10px rgba(0,0,0,.6);
    }
    .side-title{
        font-size: 24px;
        font-weight: 200;
    }
    .side-form-section{
        line-height: 40px;
        vertical-align: middle;
    }
    .side-form-section h6{
        display: inline-block;
        vertical-align: middle;
        margin: 0 15px;
        font-size: 16px;
    }
    .side-input_file{
        position: relative;
        width: 100px;
        height: 30px;
        display: inline-block;
        vertical-align: middle;
        box-sizing: border-box;
        border: 1px #333 solid;
        overflow: hidden;
        text-align: center;
        line-height: 30px;
        transition: .3s;
        cursor: pointer;
    }
    .side-input_file+input[type=file]{
        display: none;
    }
    .side-input_file:hover{
        box-shadow: 0 0 5px 1px rgba(0,0,0,.3);
    }
    .side-input-add{
        color: #69f0ae;
        font-size: 24px;
        cursor: pointer;
        float: right;
        margin-right: 25px;
    }
    .side-input-delete{
        color: #ff5252;
        font-size: 12px;
        cursor: pointer;
        float: right;
        margin-right: 25px;
    }
    .side-input_text{
        display: inline-block;
        margin: 0 10px;
    }
    .side-input_text input[type=text]{
        border: 0;
        border-bottom: 1px #eee solid;
        box-sizing: border-box;
        padding-left: 5px;
        background: none;
    }
    .side-input_text_stop input[type=text]{
        width: 50px;
    }
    .side-input_text_color input[type=text]{
        width: 100px;
    }
    .side-title_switch{
        display: inline-block;
        float: right;
    }
    .side-input_switch{
        display: inline-block;
        transform: scale(.7);
    }
    .side-input_options{
        box-sizing: border-box;
        padding-left: 30px;
    }
    .side-input_option{
        box-sizing: border-box;
    }

    .side-btn_finish{
        width: 100px;
        height: 30px;
        margin: 100px 0 100px 75px;
        display: inline-block;
        box-sizing: border-box;
        border: 1px #333 solid;
        overflow: hidden;
        text-align: center;
        cursor: pointer;
        line-height: 30px;
        transition: .3s;
        @media(max-width: 500px){
            margin: 100px 0 100px 25%;
            transform: translateX(-50%);
        }
        @media(max-width: 430px){
            margin: 20px 0 20px 50%;
            transform: translateX(-50%);
        }
    }
    .side-btn_finish:hover{
        box-shadow: 0 0 5px 1px rgba(0,0,0,.3);
    }

    .work-result{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        background: rgba(0,0,0,.4);
        color: #666;
    }
    .work-result-box{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 400px;
        height: 230px;
        margin: auto;
        background: rgba(255,255,255,.8);
        box-shadow: 0 0 10px 2px rgba(255,255,255,.3);;
        border-radius: 5px;
        box-sizing: border-box;
        padding: 10px;
    }
    .work-uploading{
        padding-top: 100px;
        text-align: center;
    }
    .work-result-box input{
        display: block;
        text-align: center;
        margin: 50px auto;
        background: none;
        border: 0;
        width: 100%;
        color: #666;
    }
    .work-result-box input:hover{
        text-decoration: underline;
    }
    .work-result-btn{
        width: 100px;
        height: 30px;
        margin: 0 140px;
        display: inline-block;
        box-sizing: border-box;
        border: 1px #333 solid;
        overflow: hidden;
        text-align: center;
        cursor: pointer;
        line-height: 30px;
        transition: .3s;
    }
    .work-result-btn:hover{
        box-shadow: 0 0 5px 1px rgba(0,0,0,.3);
    }

    .info_title{
        position: absolute;
        top: 20px;
        left: 30px;
        font-size: 28px;
        color: #fff;
        text-shadow: 0 0 5px rgba(0,0,0,.5);
    }
    .info_bgm{
        position: absolute;
        top: 60px;
        left: 30px;
        font-size: 16px;
        color: #fff;
        text-shadow: 0 0 5px rgba(0,0,0,.5);
    }
    .info_bg{
        position: absolute;
        bottom: 20px;
        right: 30px;
        color: #fff;
        text-shadow: 0 0 5px rgba(0,0,0,.5);
    }
</style>
