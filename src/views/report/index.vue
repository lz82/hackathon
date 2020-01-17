<template>
  <div class="report-wrapper">
    <header>
      <div class="header-content">
        <div class="logo" @click="onLogoClick"></div>
      </div>
    </header>

    <div class="map-wrapper">
      <chart-map />
    </div>

    <div class="line-wrapp">
      <chart-line />
    </div>

    <div class="bar-wrapper">
      <chart-bar />
    </div>
  </div>
</template>

<script>
import ChartMap from './components/map'
import ChartLine from './components/line'
import ChartBar from './components/bar'

import { mapGetters } from 'vuex'

export default {
  name: 'Report',

  components: {
    ChartMap,
    ChartLine,
    ChartBar
  },

  data() {
    return {}
  },

  computed: {
    ...mapGetters(['currentQuery'])
  },

  mounted() {
    this.$nextTick(() => {
      if (!this.checkQuery()) {
        this.$router.push('/home')
      }
    })
  },

  methods: {
    onLogoClick() {
      this.$router.go(-1)
    },

    checkQuery() {
      const { keyword, region, org } = this.currentQuery
      if (!keyword.trim() && region.length === 0 && !org.trim()) {
        return false
      } else {
        return true
      }
    }
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

  .map-wrapper {
    width: 1200px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 0 10px 10px 10px;
    padding: 10px;
    margin-top: 20px;
  }

  .line-wrapp {
    width: 1200px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 0 10px 10px 10px;
    padding: 10px;
    margin: 20px 0;
  }

  .bar-wrapper {
    width: 1200px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 0 10px 10px 10px;
    padding: 10px;
    margin-bottom: 20px;
  }
}
</style>
