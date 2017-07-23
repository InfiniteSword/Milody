<template>
    <transition name="fade">
        <div v-show="show" @click.self="panelClose" class="panel-ctn">
            <transition name="scale">
                <div class="panel-content" v-show="show">
                    <h3>{{title}}</h3>
                    <template v-for="content in contents">
                        <p>{{content}}</p>
                    </template>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
  export default {
    name: 'panel',
    props: ['show', 'title', 'contents'],
    methods: {
      panelClose: function () {
        this.$emit('update:show', false);
      }
    }
  };
</script>

<style lang="scss">
    .panel-ctn{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,.5);
        z-index: 9999;
    }
    .panel-content{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        max-width: 600px;
        width: 80%;
        height: 400px;
        background: #fff;
        border-radius: 4px;
        margin: auto;
        padding: 0 20px;
        box-sizing: border-box;
        overflow-y: scroll;
    }
    .panel-content h3{
        text-align: center;
    }

    .fade-enter-active, .fade-leave-active{
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-active{
        opacity: 0;
    }
    .scale-enter-active, .scale-leave-active{
        transition: .5s;
    }
    .scale-enter, .scale-leave-active{
        transform: scale(1.1,1.1);
    }
</style>
