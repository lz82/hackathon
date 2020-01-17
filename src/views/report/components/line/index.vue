<template>
  <div class="stack-line-wrapper">
    <div :id="id" class="container"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import uuid from 'uuid/v4'
import echarts from 'echarts'

import { innovationActivity } from '@/service'

export default {
  name: 'Line',

  data() {
    return {
      id: 'line-chart'
    }
  },

  computed: {
    ...mapGetters(['currentQuery'])
  },

  watch: {
    language() {
      this.initData()
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

  methods: {
    async initData() {
      try {
        const postData = {
          query: this.currentQuery.keyword,
          regional: this.currentQuery.region.join(','),
          org: this.currentQuery.org
        }
        const { applicantCount, patentCount } = await innovationActivity(postData)
        const option = {
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              }, //区域缩放，区域缩放还原
              dataView: {
                readOnly: false
              }, //数据视图
              magicType: {
                type: ['line', 'bar']
              }, //切换为折线图，切换为柱状图
              restore: {}, //还原
              saveAsImage: {} //保存为图片
            }
          },
          title: {
            text: '',
            bottom: 0,
            left: this.language === 'en' ? '22%' : '40%'
          },
          color: ['#00ccf2', '#ff8600', '#f2ef00', '#7c6dfd', '#f35853', '#52cc64', '#4d7aff'],
          tooltip: {
            trigger: 'axis',
            position: ['35%', 0]
          },
          legend: {
            data: ['专利数量', '申请人数量'],
            left: 30,
            right: 30,
            padding: [0, 20, 0, 0],
            textStyle: {
              color: '#fff'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '6%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['2015', '2016', '2017', '2018', '2019'],
            axisLabel: {
              color: '#fff'
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '专利数量',
              type: 'line',
              data: [
                patentCount[2015],
                patentCount[2016],
                patentCount[2017],
                patentCount[2018],
                patentCount[2019]
              ]
            },
            {
              name: '申请人数量',
              type: 'line',
              data: [
                applicantCount[2015],
                applicantCount[2016],
                applicantCount[2017],
                applicantCount[2018],
                applicantCount[2019]
              ]
            }
          ]
        }
        const chart = echarts.init(document.getElementById(this.id))
        chart.setOption(option)
      } catch (err) {
        this.$message.error('数据有误，请重新查询!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.stack-line-wrapper {
  .container {
    width: 1180px;
    height: 460px;
  }
}
</style>
