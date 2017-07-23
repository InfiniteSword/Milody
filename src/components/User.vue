<template>
    <div class="home-ctn">
        <loading v-if="loading"></loading>
        <div class="home-bg"></div>
        <div class="user-ctn" :style="showList?'top:-100vh':'top:0'">
            <div class="user-avatar" @click="showAvatar" :style="user.thumb?'background:url('+ user.thumb +') no-repeat center/cover;':''">
                <span class="iconfont default-avatar" v-if="!user.thumb">&#xe655;</span>
            </div>
            <magnifier v-show="magnifying" :pic="user.avatar"></magnifier>
            <div class="user-info">
                <span>{{user.name}}</span>
            </div>
            <div class="home-btns">
                <div class="home-btn" @click="goToList">作品</div>
                <div class="home-btn" @click="goToHome">回到主页</div>
            </div>
        </div>
        <list :style="showList?'top:0':''" :show.sync="showList" :list="works"></list>
    </div>
</template>

<script>
  import Login from './Login.vue';
  import Loading from './Loading.vue';
  import List from './List.vue';
  import Magnifier from './Magnifier.vue';
  import showToast from '../scripts/showToast';
  import serverUrl from '../scripts/url';

  export default {
    components: { Login, Loading, List, Magnifier },
    data: function () {
      return {
        loading: true,
        showList: false,
        magnifying: false,
        user: {
          id: null,
          name: '',
          email: '',
          avatar: '',
          thumb: ''
        },
        works: []
      };
    },
    watch: {
      '$route' (to, from) {
        let that = this;
        let data = {
          id: this.$route.params.user_id
        };
        fetch(serverUrl + '/api/getUser', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(data),
          mode: 'cors',
          cache: 'default'
        }).then((res) => {
          return res.json();
        }).then((data) => {
          if (data.status === 'success') {
            if (data.message === 'self') {
              that.$router.push('/');
            } else {
              that.user.name = data.user.username;
              that.user.id = data.user.id;
              that.user.email = data.user.email;
              that.user.avatar = data.user.avatar;
              that.user.thumb = data.user.thumb;
              that.loading = false;
            }
          } else {
            showToast(data.message);
            that.$router.push('/');
          }
        }).catch((err) => {
          return err.toString();
        });
        fetch(serverUrl + '/api/getWorksByUser', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(data),
          mode: 'cors',
          cache: 'default'
        }).then((res) => {
          return res.json();
        }).then((data) => {
          if (data.status === 'success') {
            that.works = data.works;
          }
        }).catch((err) => {
          return err.toString();
        });
      }
    },
    created: function () {
      let that = this;
      let data = {
        id: this.$route.params.user_id
      };
      fetch(serverUrl + '/api/getUser', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        mode: 'cors',
        cache: 'default'
      }).then((res) => {
        return res.json();
      }).then((data) => {
        if (data.status === 'success') {
          if (data.message === 'self') {
            that.$router.push('/');
          } else {
            that.user.name = data.user.username;
            that.user.id = data.user.id;
            that.user.email = data.user.email;
            that.user.avatar = data.user.avatar;
            that.user.thumb = data.user.thumb;
            that.loading = false;
          }
        } else {
          showToast(data.message);
          that.$router.push('/');
        }
      }).catch((err) => {
        return err.toString();
      });
      fetch(serverUrl + '/api/getWorksByUser', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        mode: 'cors',
        cache: 'default'
      }).then((res) => {
        return res.json();
      }).then((data) => {
        if (data.status === 'success') {
          that.works = data.works;
        }
      }).catch((err) => {
        return err.toString();
      });
    },
    methods: {
      goToList: function () {
        this.showList = true;
      },
      goToHome: function () {
        this.$router.push('/');
      },
      showAvatar: function () {
        if (this.user.avatar) {
          this.magnifying = true;
        }
      }
    }
  };
</script>

<style>
    .home-ctn{
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: rgba(0,0,0,.3);
        user-select: none;
    }
    .user-ctn{
        position: absolute;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        text-align: center;
        transition: .3s;
    }
    .login-ctn{
        text-align: center;
    }
    .user-setting{
        position: absolute;
        right: 20px;
        top: 80px;
        background: rgba(255,255,255,.8);
        width: 250px;
        height: 350px;
        box-shadow: 0 0 20px 1px rgba(0,0,0,.5);
    }
    .user-setting-btn{
        position: absolute;
        right: 40px;
        top: 20px;
        cursor: pointer;
        font-size: 24px;
        color: #fff;
        transition: .3s;
    }
    .user-setting-btn:hover{
        text-shadow: 0 0 5px rgba(255,255,255,.6);
    }
    .user-avatar{
        display: inline-block;
        width: 150px;
        height: 150px;
        line-height: 150px;
        margin-top: 100px;
        margin-bottom: 50px;
        border: 4px #fff solid;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
        transition: .3s;
    }
    .user-avatar:hover{
        box-shadow: 0 0 10px 2px rgba(255,255,255,.6);
        text-shadow: 0 0 5px rgba(255,255,255,.6);
    }
    .default-avatar{
        font-size: 120px;
        font-weight: 100;
        color: #fff;
    }
    .user-info{
        color: #fff;
        font-size: 34px;
        letter-spacing: 5px;
        text-indent: 5px;
    }
    .home-desc_top{
        font-family: 'Wawati SC',sans-serif;
        position: absolute;
        top: 30px;
        left: 50px;
        font-size: 20px;
        color: #fff;
    }
    .home-desc_bottom{
        font-family: 'Wawati SC',sans-serif;
        position: absolute;
        bottom: 30px;
        right: 50px;
        font-size: 20px;
        color: #fff;
    }
    .home-bg{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        background: url("../assets/img/huiyin.jpg");
        background-size: cover;
        z-index: -1;
        filter: blur(10px);
    }
    .home-title{
        display: inline-block;
        font-size: 44px;
        color: #fff;
        line-height: 1;
        margin-top: 30vh;
        letter-spacing: 50px;
        text-indent: 50px;
    }
    .home-btns{
        margin-top: 50px;
        text-align: center;
    }
    .home-btn{
        display: inline-block;
        width: 120px;
        height: 40px;
        margin: 0 30px;
        color: #fff;
        border: 1px #fff solid;
        line-height: 40px;
        cursor: pointer;
        transition: .3s;
    }
    .home-btn:hover{
        box-shadow: 0 0 10px 1px rgba(255,255,255,.6);
        text-shadow: 0 0 5px rgba(255,255,255,.6);
    }
    .home-btn_logout{
        position: absolute;
        left: 40px;
        bottom: 20px;
        border: 1px #ef5350 solid;
        cursor: pointer;
        color: #ef5350;
    }
    .home-btn_logout:hover{
        box-shadow: 0 0 10px 1px rgba(255,0,0,.3);
        text-shadow: 0 0 5px rgba(255,0,0,.3);
    }


    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .3s ease;
    }
    .slide-fade-enter, .slide-fade-leave-active {
        transform: translateY(-20px);
        opacity: 0;
    }
</style>
