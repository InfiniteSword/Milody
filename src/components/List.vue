<template>
    <div class="list-ctn">
        <span class="list-back" @click="goBack">返回</span>
        <div class="list-items">
            <template v-for="item in list" >
                <img-box :item="item" :username="user"></img-box>
            </template>
        </div>
        <div class="list-empty" v-if="list.length === 0">
            <span>暂无作品</span>
        </div>
    </div>
</template>

<script>
  import ImgBox from './ImgBox.vue';

  export default {
    name: 'list',
    components: {ImgBox},
    props: ['list', 'show', 'user'],
    methods: {
      goBack: function () {
        this.$emit('update:show', false);
      }
    }
  };
</script>

<style lang="scss">
    .list-ctn{
        position: absolute;
        top: 100vh;
        left: 0;
        width: 100vw;
        height: 100vh;
        transition: .3s;
        overflow-y: scroll;
    }
    .list-items{
        max-width: 980px;
        margin: auto;
    }
    .list-back{
        display: inline-block;
        margin: 20px 0 10px 100px;
        font-size: 24px;
        color: #fff;
        cursor: pointer;
        transition: .3s;
        text-shadow: 0 0 5px rgba(0,0,0,.4);
        @media (max-width:400px) {
            margin-left: 40px;
        }
    }
    .list-back:hover{
        text-shadow: 0 0 5px rgba(255,255,255,.4);
    }
    .list-empty{
        margin-top: 150px;
        text-align: center;
        color: #fff;
        font-size: 20px;
        letter-spacing: 5px;
        text-indent: 5px;
    }
</style>
