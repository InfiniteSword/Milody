<template>
    <div class="share-ctn">
        <loading v-if="loading"></loading>
        <div class="share-preview" :style="bgUrl!==''?'background:url('+ bgUrl +') no-repeat center/cover;':''"></div>
        <canvas id="share-canvas-circle"></canvas>
        <canvas id="share-canvas-line"></canvas>
        <canvas id="share-canvas-dots"></canvas>
        <audio id="share-audio" @timeupdate="showLyric" :src="bgmUrl" crossOrigin="anonymous" loop autoplay></audio>
        <span class="info_title">{{title}}</span>
        <span class="info_bgm" v-show="bgm">Music: {{bgm}} <span v-if="singer != ''">-</span> {{singer}}</span>
        <span class="info_bg" v-show="bg">BG Artist: {{bg}}</span>
        <span class="icon iconfont ctrl" @click="toggleMusic">{{musicPlay?'&#xe640;':'&#xe778;'}}</span>
        <a :href="bgmUrl" class="icon iconfont download" download>&#xe642;</a>
        <span class="icon iconfont home" @click="backHome">&#xe613;</span>
        <div class="lyric-ctn">
            <p>{{lyricNow}}</p>
        </div>
        <div class="time">
            <span>{{currentTime}}/{{totalTime}}</span>
        </div>
    </div>
</template>

<script>
  import Milody from '../scripts/Milody';
  import showToast from '../scripts/showToast';
  import serverUrl from '../scripts/url';
  import CircleAnimate from '../scripts/CircleAnimate';
  import LineAnimate from '../scripts/LineAnimate';
  import DotsAnimate from '../scripts/DotsAnimate';
  import parseLyric from '../scripts/lrcParser';
  import stringifyTime from '../scripts/stringifyTime';
  import Loading from './Loading.vue';
  const SCREEN_WIDTH = window.innerWidth;
  const SCREEN_HEIGHT = window.innerHeight;

  export default {
    components: { Loading },
    data: function () {
      return {
        loading: true,
        musicPlay: true,
        audioDom: null,
        animationFrame: null,
        userId: '',
        bgUrl: '',
        bgmUrl: '',
        bg: '',
        bgm: '',
        title: '',
        singer: '',
        describe: '',
        lyric: null,
        lyricNow: '',
        totalTime: '00:00',
        currentTime: null,
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
            colors: [{stop: '', color: ''}],
            blurColor: ''
          },
          line: {
            show: false,
            colors: [{stop: '', color: ''}],
            blurColor: ''
          }
        }
      };
    },
    watch: {
      '$route' (to, from) {
        let that = this;
        this.loading = true;
        let data = {
          userId: this.$route.params.user_id,
          id: this.$route.params.work_id
        };
        fetch(serverUrl + '/api/getWork', {
          method: 'POST',
          body: JSON.stringify(data),
          mode: 'cors',
          cache: 'default'
        }).then(function (res) {
          return res.json();
        }).then(function (data) {
          if (data.status === 'error') {
            showToast(data.message);
          } else {
            that.bgm = data.bgm;
            that.bg = data.bg;
            that.bgUrl = data.bgUrl;
            that.bgmUrl = data.bgmUrl;
            that.singer = data.singer;
            that.title = data.title;
            that.username = data.username;
            that.options = data.options;
            if (data.lrcUrl) {
              let myHeaders = new Headers();
              myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
              fetch(data.lrcUrl, {
                method: 'GET',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default'
              }).then(function (res) {
                return res.text();
              }).then(function (data) {
                that.lyric = parseLyric(data);
              }).catch(function (err) {
                return err.toString();
              });
            }
            that.loading = false;
            that.start();
          }
        }).catch(function (err) {
          return err.toString();
        });
      }
    },
    created: function () {
      if (this.animationFrame) {
        window.cancelAnimationFrame(this.animationFrame);
      }
      let that = this;
      let data = {
        userId: this.$route.params.user_id,
        id: this.$route.params.work_id
      };
      fetch(serverUrl + '/api/getWork', {
        method: 'POST',
        body: JSON.stringify(data),
        mode: 'cors',
        cache: 'default'
      }).then(function (res) {
        return res.json();
      }).then(function (data) {
        if (data.status === 'error') {
          showToast(data.message);
          that.$router.push('/');
        } else {
          that.bgm = data.bgm;
          that.bg = data.bg;
          that.bgUrl = data.bgUrl;
          that.bgmUrl = data.bgmUrl;
          that.singer = data.singer;
          that.title = data.title;
          that.username = data.username;
          that.options = data.options;

          if (data.lrcUrl) {
            let myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
            fetch(data.lrcUrl, {
              method: 'GET',
              headers: myHeaders,
              mode: 'cors',
              cache: 'default'
            }).then(function (res) {
              return res.text();
            }).then(function (data) {
              that.lyric = parseLyric(data);
            }).catch(function (err) {
              return err.toString();
            });
          }

          that.start();
        }
      }).catch(function (err) {
        return err.toString();
      });
    },
    methods: {
      start: function () {
        const that = this;
        this.audioDom = document.querySelector('#share-audio');
        const circle = document.querySelector('#share-canvas-circle');
        const line = document.querySelector('#share-canvas-line');
        const dots = document.querySelector('#share-canvas-dots');
        let milody = new Milody(this.audioDom);
        milody.init();
        let lastArrCircle = [];
        let lastArrLine = [];
        let lastArrDots = [];
        function animate () {
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
          that.animationFrame = window.requestAnimationFrame(animate);
        }
        that.animationFrame = window.requestAnimationFrame(animate);
      },
      showLyric: function (e) {
        let currentTime = e.target.currentTime;
        if (this.totalTime === '00:00') {
          let t = Math.round(e.target.duration);
          if (t) {
            this.totalTime = stringifyTime(t);
            this.loading = false;
          }
        }
        this.currentTime = stringifyTime(parseInt(currentTime));
        let lyric = this.lyric;
        if (!lyric) {
          return;
        }
        let lrc = lyric[Math.round(currentTime)];
        if (!lrc) return;
        this.lyricNow = lrc;
      },
      toggleMusic: function () {
        this.musicPlay = !this.musicPlay;
        if (!this.musicPlay) {
          this.audioDom.pause();
        } else {
          this.audioDom.play();
        }
      },
      backHome: function () {
        this.$router.push('/');
      }
    }
  };
</script>

<style lang="scss">
    .share-preview{
        width: 100vw;
        height: 100vh;
        background: url("../assets/img/geometry2.png");
    }
    #share-canvas-circle{
        position: absolute;
        background: none;
        top: 0;
        left: 0;
    }
    #share-canvas-line{
        position: absolute;
        background: none;
        top: 0;
        left: 0;
    }
    #share-canvas-dots{
        position: absolute;
        background: none;
        top: 0;
        left: 0;
    }
    .icon{
        transition: .3s;
    }
    .icon:hover{
        text-shadow: 0 0 10px rgba(0,0,0,.5);
    }
    .ctrl{
        position: absolute;
        top: 20px;
        right: 60px;
        color: #fff;
        text-shadow: 0 0 5px rgba(0,0,0,.5);
        cursor: pointer;
        user-select: none;
    }
    .download{
        position: absolute;
        top: 20px;
        right: 30px;
        color: #fff;
        text-shadow: 0 0 5px rgba(0,0,0,.5);
        cursor: pointer;
        user-select: none;
    }
    .home{
        position: absolute;
        top: 20px;
        right: 90px;
        color: #fff;
        text-shadow: 0 0 5px rgba(0,0,0,.5);
        cursor: pointer;
        user-select: none;
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
    .lyric-ctn{
        position: absolute;
        bottom: 40px;
        left: 50px;
        color: #fff;
        text-shadow: 0 0 5px rgba(0,0,0,.5);
    }
    .time{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        font-size: 28px;
        width: 300px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        text-shadow: 0 0 5px rgba(0,0,0,.5);
    }

</style>
