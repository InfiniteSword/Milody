<template>
    <div class="loading-ctn">
        <div class="spinner"></div>
    </div>
</template>

<script>
  export default {
    name: 'loading'
  };
</script>

<style lang="scss">
    .loading-ctn{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #e1e1e1;
        text-align: center;
        z-index: 99999;
    }

    .spinner {
        width: 40px;
        height: 40px;
        margin: 40vh auto;
        background-color: #FF4F4E;

        border-radius: 50%;
        animation: scaleout 2s infinite ease-out;
    }

    @keyframes scaleout {
        0% {
            transform: scale(0.0);
        }
        100% {
            transform: scale(1.0);
            opacity: 0;
        }
    }

</style>
