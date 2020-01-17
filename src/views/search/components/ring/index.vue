<template>
  <div class="pie-wrapper">
    <div :id="id" class="container"></div>
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import echarts from 'echarts'

export default {
  name: 'Pie',

  props: {
    legend: {
      type: Array,
      required: true
    },
    chartData: {
      type: Array,
      required: true
    },
    series: {
      type: String
    }
  },

  data() {
    return {
      id: 'pie-chart'
    }
  },

  created() {
    this.id = uuid()
  },

  mounted() {
    this.$nextTick(() => {
      this.initData()
    })
  },

  watch: {
    chartData() {
      this.initData()
    }
  },

  methods: {
    initData() {
      const localLegend = JSON.parse(JSON.stringify(this.legend)).reverse()

      const option = {
        tooltip: {
          trigger: 'item',
          position: 'inside'
        },
        color: ['#00ccf2', '#ff8600', '#f2ef00', '#7c6dfd', '#f35853', '#52cc64', '#4d7aff'],
        legend: {
          type: 'scroll',
          textStyle: {
            color: '#fff'
          },
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: localLegend
        },
        series: [
          {
            name: this.series || '分类',
            type: 'pie',
            radius: '40%',
            center: ['30%', '45%'],
            data: this.chartData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      console.log(option)
      const chart = echarts.init(document.getElementById(this.id))
      chart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
.pie-wrapper {
  .container {
    width: 390px;
    height: 180px;
  }
}
</style>
