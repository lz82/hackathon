<template>
  <div class="bar-line-wrapper">
    <div :id="id" class="container"></div>
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import echarts from 'echarts'
import { mapGetters } from 'vuex'

import { techTalent } from '@/service'

export default {
  name: 'BarLine',

  data() {
    return {
      id: 'bar-line'
    }
  },

  computed: {
    ...mapGetters(['currentQuery'])
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
        const { techTalent: resData } = await techTalent(postData)

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
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none'
            }
          },
          color: ['#00ccf2', '#ff8600', '#f2ef00', '#7c6dfd', '#f35853', '#52cc64', '#4d7aff'],
          legend: {
            data: ['论文数量']
          },
          xAxis: [
            {
              type: 'category',
              data: resData.map((item) => {
                return item.key
              }),
              axisTick: {
                show: false
              },
              axisLabel: {
                color: '#fff',
                rotate: 45
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              type: 'bar',
              label: {
                show: true
              },
              data: resData.map((item) => {
                return item.doc_count
              })
            }
          ]
        }
        const chart = echarts.init(document.getElementById(this.id))
        chart.setOption(option)
      } catch (err) {
        this.$message.error('获取数据异常，请重新查询!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.bar-line-wrapper {
  .container {
    width: 1180px;
    height: 460px;
  }
}
</style>
