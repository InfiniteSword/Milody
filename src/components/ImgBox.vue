<template>
    <div class="img-ctn">
        <div class="img-box" :style="'background:url('+item.bgUrl+');background-size: cover;'">
            <div class="img-info">
                <h3 class="img-link" @click="goToShare">{{item.title}}</h3>
                <p class="info-bgm" v-if="item.bgm != ''">Music：<span>{{item.bgm}}</span></p>
                <p class="info-desc" v-if="item.describe != ''" :title="item.describe">{{item.describe}}</p>
                <br>
            </div>
        </div>
    </div>
</template>

<script>

  export default {
    name: 'ImgBox',
    props: ['item', 'username', 'id', 'work'],
    methods: {
      goToShare: function () {
        this.$router.push('/' + this.item.userId + '/' + this.item.id);
      }
    }
  };

</script>

<style lang="scss">
    .img-ctn{
        display: inline-block;
        width: 33.333333%;
        text-align: center;
        padding: 30px 0;
        @media (max-width: 840px) {
            width: 50%;
        }
        @media (max-width: 600px) {
            width: 100%;
        }
    }
    .img-box{
        position: relative;
        width: 260px;
        height: 180px;
        display: inline-block;
        z-index: 20;
        border: 1px #fff solid;
        border-radius: 5px;
        overflow: hidden;
        transition: box-shadow .3s;
    }
    .img-info{
        position: absolute;
        display: inline-block;
        top: 0;
        left: 0;
        font-size: 16px;
        width: 260px;
        height: 180px;
        padding: 20px;
        box-sizing: border-box;
        line-height: 36px;
        color: #faf8f9;
        background: rgba(0,0,0,.1);
        text-shadow: 0 0 5px rgba(0,0,0,.7);
        transition: background .3s;
    }
    .img-box:hover{
        box-shadow: 0 0 5px 1px #fff;
    }
    .img-box:hover > .img-info{
        background: rgba(0,0,0,.5);
    }
    .img-magnify{
        position: absolute;
        right: 10px;
        bottom: 0;
        cursor: pointer;
    }
    .img-link{
        cursor: pointer;
        transition: text-shadow .3s;
    }
    .info-bgm{
        opacity: 1;
        transition: opacity .3s;
    }
    .info-desc{
        position: absolute;
        top: 100%;
        left: 0;
        font-size: 16px;
        line-height: 24px;
        padding: 0 10px;
        transition: top .3s;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
    }
    .img-box:hover > .img-info > .info-desc{
        top: 70px;
    }
    .img-box:hover > .img-info > .info-bgm{
        opacity: 0;
        text-shadow: 0 0 5px rgba(255,255,255,.5);
    }
    .img-box:hover > .img-info > .img-link{
        text-shadow: 0 0 5px rgba(255,255,255,.5);
    }


</style>
