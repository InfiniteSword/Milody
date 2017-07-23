<template>
    <div>
        <div class="login-box" :style="show == 'login' ? 'width:100vw;height:100vh' : ''">

            <form class="form" id="login-form" method="post" action="">
                <span class="return" @click="close">返回</span>
                <span class="to-register" @click="showRegister">去注册 »</span>
                <div class="form-group">
                    <label for="login-id" class="col-sm-2 control-label">邮箱</label>
                    <input id="login-id" v-model="loginData.email" type="text" autocomplete="off" spellcheck="false" name="id" class="form-control" placeholder="Email">
                </div>
                <div class="form-group">
                    <label for="login-psw" class="col-sm-2 control-label">密码</label>
                    <input id="login-psw" v-model="loginData.password" type="password" name="password" class="form-control" placeholder="Password">
                </div>

                <div class="form-group submit-ctn">
                    <div id="login-submit" @click="fetchLogin" class="btn">登录</div>
                </div>

            </form>

        </div>

        <div class="register-box" :style="show == 'register' ? 'width:100vw;height:100vh' : ''">
            <form class="form" name="register-form" id="register-form" method="post">
                <span class="return" @click="close">返回</span>
                <span class="to-login" @click="showLogin">去登录 »</span>
                <div class="form-group">
                    <label for="register-name" class="col-sm-2 control-label">用户名</label>
                    <input id="register-name" v-model="registerData.username" type="text" autocomplete="off" spellcheck="false" name="username" class="form-control" placeholder="Username">
                </div>
                <div class="form-group">
                    <label for="register-name" class="col-sm-2 control-label">邮箱</label>
                    <input id="register-email" v-model="registerData.email" type="text" autocomplete="off" spellcheck="false" name="email" class="form-control" placeholder="Email">
                </div>
                <div class="form-group">
                    <label for="register-psw" class="col-sm-2 control-label">密码</label>
                    <input id="register-psw" v-model="registerData.password" type="password" name="password" class="form-control" placeholder="Password">
                </div>

                <div class="form-group submit-ctn">
                    <div id="register-submit" @click="fetchRegister" class="btn">注册</div>
                </div>

            </form>
        </div>
    </div>
</template>

<script>
  import showToast from '../scripts/showToast';
  import serverUrl from '../scripts/url';

  export default {
    name: 'login',
    data: function () {
      return {
        registerData: {
          username: '',
          email: '',
          password: ''
        },
        loginData: {
          email: '',
          password: ''
        }
      };
    },
    props: ['show'],
    methods: {
      close: function () {
        this.$parent.show = 'none';
      },
      showRegister: function () {
        this.$parent.show = 'register';
      },
      showLogin: function () {
        this.$parent.show = 'login';
      },
      fetchRegister: function () {
        let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        let emailTest = reg.test(this.registerData.email);
        if (emailTest) {
          let that = this;
          let data = this.registerData;
          fetch(serverUrl + '/api/register', {
            method: 'POST',
            body: JSON.stringify(data),
            credentials: 'include',
            mode: 'cors',
            cache: 'default'
          }).then(function (res) {
            return res.json();
          }).then(function (data) {
            if (data.status === 'error') {
              showToast(data.message);
            } else {
              that.$parent.user.name = data.username;
              that.$parent.user.id = data.id;
              that.$parent.user.email = data.email;
              that.$parent.logedIn = true;
            }
          }).catch(function (err) {
            return err.toString();
          });
        } else {
          showToast('邮箱格式错误');
        }
      },
      fetchLogin: function () {
        let that = this;
        let data = this.loginData;
        fetch(serverUrl + '/api/login', {
          method: 'POST',
          body: JSON.stringify(data),
          credentials: 'include',
          mode: 'cors',
          cache: 'default'
        }).then(function (res) {
          return res.json();
        }).then(function (data) {
          if (data.status === 'error') {
            showToast(data.message);
          } else {
            that.$parent.user.id = data.id;
            that.$parent.user.name = data.username;
            that.$parent.user.email = data.email;
            that.$parent.user.avatar = data.avatar;
            that.$parent.user.thumb = data.thumb;
            that.$parent.logedIn = true;
          }
        }).catch(function (err) {
          return err.toString();
        });
      }
    }
  };
</script>

<style lang="scss">
    .btn{
        display: inline-block;
        box-sizing: border-box;
        width: 100px;
        height: 40px;
        line-height: 40px;
        border-radius: 4px;
        cursor: pointer;
        transition: .3s;
    }
    .btn:hover{
        box-shadow: 0 0 10px 2px #ccc;
    }

    .login-box,.register-box{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 0;
        height: 0;
        background: rgba(0,0,0,.5);
        z-index: 9;
        overflow: hidden;
        transition: width .3s,height .3s;
    }
    .form{
        color: #000;
        width: 40vw;
        margin: 20vh auto;
        background: rgb(255,255,255);
        box-shadow: 0 0 10px 2px #ccc;
        box-sizing: border-box;
        border-radius: 5px;
        padding: 20px;
        @media (max-width: 400px){
            width: 90%
        }
    }
    .return{
        display: inline-block;
        margin: 10px;
        float: right;
        transition: color .3s;
        cursor: pointer;
    }
    .return:hover{
        color: #FF6666;
    }
    .to-register{
        display: inline-block;
        margin: 10px;
        float: left;
        transition: color .3s;
        cursor: pointer;
    }
    .to-register:hover{
        color: #66CCFF;
    }
    .to-login{
        display: inline-block;
        margin: 10px;
        float: left;
        transition: color .3s;
        cursor: pointer;
    }
    .to-login:hover{
        color: #33FF99;
    }
    .form-group{
        width: 100%;
        margin: 20px 0;
        font-size: 16px;
        box-sizing: border-box;
        clear: both;
    }
    .form-group label{
        display: inline-block;
        width: 30%;
        height: 30px;
        line-height: 30px;
    }
    .form-control{
        display: inline-block;
        width: 65%;
        height: 30px;
        border: none;
        border-bottom: 1px #000000 solid;
        background: none;
        font-size: 16px;
    }
    .form-control:focus{
        outline: none;
    }
    .submit-ctn{
        text-align: center;
        margin-top: 40px;
    }
    #login-submit{
        background: #33FF99;
        border: none;
        box-sizing: border-box;
        color: #666;
    }

    #register-submit{
        background: #66CCFF;
        border: none;
        color: #fff;
        box-sizing: border-box;
    }

    .register-sex-box{
        display: inline-block;
        width: 65%;
        height: 30px;
        border: none;
        line-height: 30px;
        background: none;
        font-size: 16px;
    }
</style>
