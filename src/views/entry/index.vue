<template>
  <div class="entry-wrapper">
    <div class="container">
      <p id="title"></p>
      <div class="btn" @click="onGoClick"></div>
    </div>
  </div>
</template>

<script>
import Snow from 'magic-snowflakes'
import Typed from 'typed.js'

export default {
  name: 'Entry',

  data() {
    return {}
  },

  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },

  methods: {
    init() {
      new Snow({
        color: '#fff',
        minSize: 10, // Default: 8
        maxSize: 30,
        wind: true
      })
      new Typed('#title', {
        strings: [`暴风雨已经来临，你必须努力向前，抢救那些数据！\n为了部落！Lok'tar ogar!`],
        loop: true,
        loopCount: Infinity,
        typeSpeed: 50,
        backSpeed: 0,
        fadeOut: true
      })
    },

    onGoClick() {
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="less" scoped>
.entry-wrapper {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background: url(./img/bg.png) no-repeat;
  background-size: 100% 100%;
  position: relative;

  .container {
    width: 100%;
    text-align: center;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-flow: column nowrap;
    #title {
      color: #fff;
      font-size: 40px;
      font-weight: 700;
      white-space: pre-wrap;
      line-height: 60px;
      height: 120px;
    }

    .btn {
      width: 100%;
      height: 85px;
      background: url(./img/btn.png) no-repeat center;
      cursor: pointer;
    }
  }
}
</style>
