<template>
  <div class="pie-wrapper">
    <div :id="id" class="container"></div>
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import echarts from 'echarts'
import 'echarts/map/js/china'

import { domesticDistribution } from '@/service'

import { mapGetters } from 'vuex'

export default {
  name: 'Map',

  computed: {
    ...mapGetters(['currentQuery'])
  },

  data() {
    return {
      id: 'map-chart',
      geoCoordMap: {
        黑龙江: [127.9688, 45.368],
        内蒙古: [110.3467, 41.4899],
        吉林省: [125.8154, 44.2584],
        北京市: [116.4551, 40.2539],
        辽宁省: [123.1238, 42.1216],
        河北省: [114.4995, 38.1006],
        天津市: [117.4219, 39.4189],
        山西省: [112.3352, 37.9413],
        陕西省: [109.1162, 34.2004],
        甘肃省: [103.5901, 36.3043],
        宁夏: [106.3586, 38.1775],
        青海: [101.4038, 36.8207],
        新疆: [87.9236, 43.5883],
        西藏: [91.11, 29.97],
        四川省: [103.9526, 30.7617],
        重庆市: [108.384366, 30.439702],
        山东省: [117.1582, 36.8701],
        河南省: [113.4668, 34.6234],
        江苏省: [118.8062, 31.9208],
        安徽省: [117.29, 32.0581],
        湖北省: [114.3896, 30.6628],
        浙江省: [119.5313, 29.8773],
        福建省: [119.4543, 25.9222],
        江西省: [116.0046, 28.6633],
        湖南省: [113.0823, 28.2568],
        贵州省: [106.6992, 26.7682],
        云南省: [102.9199, 25.4663],
        广东省: [113.12244, 23.009505],
        广西省: [108.479, 23.1152],
        海南省: [110.3893, 19.8516],
        上海市: [121.4648, 31.2891]
      },
      colors: [
        [
          [
            '#1DE9B6',
            '#F46E36',
            '#04B9FF',
            '#5DBD32',
            '#FFC809',
            '#FB95D5',
            '#BDA29A',
            '#6E7074',
            '#546570',
            '#C4CCD3'
          ],
          [
            '#37A2DA',
            '#67E0E3',
            '#32C5E9',
            '#9FE6B8',
            '#FFDB5C',
            '#FF9F7F',
            '#FB7293',
            '#E062AE',
            '#E690D1',
            '#E7BCF3',
            '#9D96F5',
            '#8378EA',
            '#8378EA'
          ],
          [
            '#DD6B66',
            '#759AA0',
            '#E69D87',
            '#8DC1A9',
            '#EA7E53',
            '#EEDD78',
            '#73A373',
            '#73B9BC',
            '#7289AB',
            '#91CA8C',
            '#F49F42'
          ]
        ]
      ],
      colorIndex: 0,
      years: [2015, 2016, 2017, 2018, 2019],
      mapData: [[], [], [], [], [], []]
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
    async initData() {
      try {
        const option = {
          timeline: {
            data: this.years,
            axisType: 'category',
            autoPlay: true,
            playInterval: 3000,
            left: '10%',
            right: '10%',
            bottom: '3%',
            width: '80%',
            //  height: null,
            label: {
              normal: {
                textStyle: {
                  color: '#ddd'
                }
              },
              emphasis: {
                textStyle: {
                  color: '#fff'
                }
              }
            },
            symbolSize: 10,
            lineStyle: {
              color: '#555'
            },
            checkpointStyle: {
              borderColor: '#777',
              borderWidth: 2
            },
            controlStyle: {
              showNextBtn: true,
              showPrevBtn: true,
              normal: {
                color: '#666',
                borderColor: '#666'
              },
              emphasis: {
                color: '#aaa',
                borderColor: '#aaa'
              }
            }
          },
          baseOption: {
            toolbox: {
              show: true,
              feature: {
                saveAsImage: {} //保存为图片
              }
            },
            animation: true,
            animationDuration: 1000,
            animationEasing: 'cubicInOut',
            animationDurationUpdate: 1000,
            animationEasingUpdate: 'cubicInOut',
            grid: {
              right: '1%',
              top: '25%',
              bottom: '10%',
              width: '20%'
            },
            tooltip: {
              trigger: 'axis', // hover触发器
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                shadowStyle: {
                  color: 'rgba(150,150,150,0.1)' //hover颜色
                }
              }
            },
            geo: {
              show: true,
              map: 'china',
              roam: true,
              zoom: 1,
              center: [113.83531246, 34.0267395887],
              label: {
                emphasis: {
                  show: false
                }
              },
              itemStyle: {
                normal: {
                  borderColor: 'rgba(147, 235, 248, 1)',
                  borderWidth: 1,
                  areaColor: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.8,
                    colorStops: [
                      {
                        offset: 0,
                        color: 'rgba(147, 235, 248, .2)' // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  },
                  shadowColor: 'rgba(128, 217, 248, 1)',
                  // shadowColor: 'rgba(255, 255, 255, 1)',
                  shadowOffsetX: -2,
                  shadowOffsetY: 2,
                  shadowBlur: 10
                },
                emphasis: {
                  areaColor: '#389BB7',
                  borderWidth: 0
                }
              }
            }
          },
          options: []
        }
        const postData = {
          query: this.currentQuery.keyword,
          regional: this.currentQuery.region.join(','),
          org: this.currentQuery.org
        }
        const result = await domesticDistribution(postData)
        this.years.forEach((item) => {
          console.log(result[item])
          option.options.push({
            // backgroundColor: '#051b4a',
            title: [
              {},
              {
                id: 'statistic',
                text: item + '年数据统计情况',
                left: '75%',
                top: '8%',
                textStyle: {
                  color: '#fff',
                  fontSize: 30
                }
              }
            ],
            xAxis: {
              type: 'value',
              scale: true,
              position: 'top',
              min: 0,
              boundaryGap: false,
              splitLine: {
                show: false
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                margin: 2,
                textStyle: {
                  color: '#fff'
                }
              }
            },
            yAxis: {
              type: 'category',
              //  name: 'TOP 20',
              nameGap: 16,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#fff'
                }
              },
              axisTick: {
                show: false,
                lineStyle: {
                  color: '#fff'
                }
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#fff'
                }
              },
              data: result[item][0]
                .filter((item) => item.key)
                .map((item) => {
                  return item.key
                })
            },
            series: [
              //未知作用
              {
                //文字和标志
                name: 'light',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: this.convertData(result[item]),
                symbolSize: function(val) {
                  return val[2] / 10
                },
                label: {
                  normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                  },
                  emphasis: {
                    show: true
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#fff'
                  }
                }
              },
              //地图？
              {
                type: 'map',
                map: 'china',
                geoIndex: 0,
                aspectScale: 0.75, //长宽比
                showLegendSymbol: false, // 存在legend时显示
                label: {
                  normal: {
                    show: false
                  },
                  emphasis: {
                    show: false,
                    textStyle: {
                      color: '#fff'
                    }
                  }
                },
                roam: true,
                itemStyle: {
                  normal: {
                    areaColor: '#031525',
                    borderColor: '#FFFFFF'
                  },
                  emphasis: {
                    areaColor: '#2B91B7'
                  }
                },
                animation: false,
                data: result[item][0].map((mapItem) => {
                  return {
                    name: mapItem.key,
                    value: mapItem.doc_count,
                    year: item
                  }
                })
              },
              //地图点的动画效果
              {
                //  name: 'Top 5',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: this.convertData(result[item]),
                symbolSize: function(val) {
                  return val[2] / 10
                },
                showEffectOn: 'render',
                rippleEffect: {
                  brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                  normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#fff',
                    shadowBlur: 10,
                    shadowColor: '#fff'
                  }
                },
                zlevel: 1
              },

              //柱状图
              {
                zlevel: 1.5,
                type: 'bar',
                symbol: 'none',
                itemStyle: {
                  normal: {
                    color: 'rgba(147, 235, 248, .2)'
                  }
                },
                data: result[item][0]
                  .filter((item) => item.key)
                  .map((item) => {
                    return item.doc_count
                  })
              }
            ]
          })
        })
        const chart = echarts.init(document.getElementById(this.id))
        chart.setOption(option)
      } catch (err) {
        this.$message.error('获取数据异常，请重新查询！')
      }
    },

    convertData(data) {
      let res = []
      data = data[0]
      for (var i = 0; i < data.length; i++) {
        var geoCoord = this.geoCoordMap[data[i].key]
        if (geoCoord) {
          res.push({
            name: data[i].key,
            value: geoCoord.concat(data[i].doc_count)
          })
        }
      }
      return res
    }
  }
}
</script>

<style lang="less" scoped>
.pie-wrapper {
  .container {
    width: 1180px;
    height: 580px;
  }
}
</style>
