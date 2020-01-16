<template>
  <div class="report-wrapper">
    <header>
      <div class="header-content">
        <div class="logo" @click="onLogoClick"></div>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: 'Report',

  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.report-wrapper {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  position: relative;

  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: url(./img/bg.png) no-repeat fixed;
  background-size: cover;

  header {
    width: 100%;
    height: 60px;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;

    .header-content {
      width: 1200px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;

      .logo {
        width: 46px;
        height: 21px;
        background: url(./img/logo.png);
        margin-right: 15px;
        cursor: pointer;
      }
    }
  }
}
</style>
