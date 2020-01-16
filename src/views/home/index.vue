<template>
  <div class="home-wrapper">
    <header>
      <img :src="logo" alt="" class="logo" />
    </header>
    <div class="container">
      <div class="content">
        <div class="banner">
          <div class="dialog">
            <div class="avatar">
              <img :src="avatar1" alt="" />
            </div>
            <div class="word" id="word1"></div>
          </div>
          <div class="dialog">
            <div class="avatar">
              <img :src="avatar2" alt="" />
            </div>
            <div class="word" id="word2"></div>
          </div>
        </div>
        <div class="search-wrapper">
          <h3>挖掘科技竞合情报，助推企业创新变革</h3>
          <el-input
            v-model="queryModel.keyword"
            prefix-icon="el-icon-search"
            style="width:900px;"
            placeholder="全库搜索，支持编号、机构、人名和关键词"
            @keyup.enter.native="onSearch"
            size="large"
          >
            <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
          </el-input>
          <div class="tool-wrapper">
            <span class="tool" @click="onToggleMore">
              <i class="iconfont icon-chaxun"></i>更多条件
            </span>
          </div>

          <transition name="bounce">
            <div class="more-wrappr" v-show="showMore">
              <el-form>
                <el-form-item label="行政区域:">
                  <el-select
                    v-model="queryModel.region"
                    multiple
                    placeholder="请选择"
                    style="width:800px;"
                  >
                    <el-option
                      v-for="item in regionList"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="机构:">
                  <el-input v-model="queryModel.org" style="width: 500px" />
                </el-form-item>
              </el-form>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div class="setting-wrapper" @click="showHistory = true">
      <i class="el-icon-s-tools" />
    </div>
    <el-drawer :visible.sync="showHistory">
      <div class="history-wrapper">
        <h3>检索历史</h3>
      </div>
      <el-table :data="history" style="width: 100%" max-height="700">
        <el-table-column prop="keyword" label="关键词"> </el-table-column>
        <el-table-column label="行政区域">
          <template slot-scope="scope">
            {{ scope.row.region.join(',') }}
          </template>
        </el-table-column>
        <el-table-column prop="org" label="机构"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="onResearch(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import logo from './img/logo.jpg'
import avatar1 from './img/avatar1.jpg'
import avatar2 from './img/avatar2.jpg'

import Typed from 'typed.js'

import { setHistory, getHistory } from '@/utils/history'

export default {
  name: 'Home',

  data() {
    return {
      logo,
      avatar1,
      avatar2,
      queryModel: {
        keyword: '',
        region: [],
        org: ''
      },
      showHistory: false,
      history: [],
      showMore: false,
      regionList: [
        { text: '亚美尼亚', value: 'AM' },
        { text: '非洲地区知识产权组织', value: 'AP' },
        { text: '阿根廷', value: 'AR' },
        { text: '澳大利亚', value: 'AU' },
        { text: '奥地利', value: 'AT' },
        { text: '波斯尼亚和黑塞哥维那', value: 'BA' },
        { text: '比利时', value: 'BE' },
        { text: '保加利亚', value: 'BG' },
        { text: '巴西', value: 'BR' },
        { text: '白俄罗斯', value: 'BY' },
        { text: '加拿大', value: 'CA' },
        { text: '智利', value: 'CL' },
        { text: '哥伦比亚', value: 'CO' },
        { text: '哥斯达黎加', value: 'CR' },
        { text: '捷克斯洛伐克', value: 'CS' },
        { text: '古巴', value: 'CU' },
        { text: '塞浦路斯', value: 'CY' },
        { text: '捷克共和国', value: 'CZ' },
        { text: '丹麦', value: 'DK' },
        { text: '多米尼加共和国', value: 'DO' },
        { text: '阿尔及利亚', value: 'DZ' },
        { text: '欧亚专利局（EAPO）', value: 'EA' },
        { text: '厄瓜多尔', value: 'EC' },
        { text: '爱沙尼亚', value: 'EE' },
        { text: '埃及', value: 'EG' },
        { text: '西班牙', value: 'ES' },
        { text: '芬兰', value: 'FI' },
        { text: '海湾地区阿拉伯国家合作委员会专利局（GCC）', value: 'GC' },
        { text: '格鲁吉', value: 'GE' },
        { text: '希腊', value: 'GR' },
        { text: '危地马拉', value: 'GT' },
        { text: '中国澳门', value: 'MO' },
        { text: '洪都拉斯', value: 'HN' },
        { text: '克罗地亚', value: 'HR' },
        { text: '匈牙利', value: 'HU' },
        { text: '印度尼西亚', value: 'ID' },
        { text: '爱尔兰', value: 'IE' },
        { text: '以色列', value: 'IL' },
        { text: '印度', value: 'IN' },
        { text: '冰岛', value: 'IS' },
        { text: '意大利', value: 'IT' },
        { text: '约旦', value: 'JO' },
        { text: '肯尼亚', value: 'KE' },
        { text: '吉尔吉斯斯坦', value: 'KG' },
        { text: '哈萨克斯坦', value: 'KZ' },
        { text: '立陶宛', value: 'LT' },
        { text: '卢森堡', value: 'LU' },
        { text: '拉脱维亚', value: 'LV' },
        { text: '摩洛哥', value: 'MA' },
        { text: '摩纳哥', value: 'MC' },
        { text: '摩尔多瓦共和国', value: 'MD' },
        { text: '黑山', value: 'ME' },
        { text: '蒙古', value: 'MN' },
        { text: '马耳他', value: 'MT' },
        { text: '马拉维墨西哥', value: 'MW' },
        { text: '墨西哥', value: 'MX' },
        { text: '马来西亚', value: 'MY' },
        { text: '尼加拉瓜', value: 'NI' },
        { text: '荷兰', value: 'NL' },
        { text: '挪威', value: 'NO' },
        { text: '新西兰', value: 'NZ' },
        { text: '非洲知识产权组织', value: 'OA' },
        { text: '巴拿马', value: 'PA' },
        { text: '秘鲁', value: 'PE' },
        { text: '菲律宾', value: 'PH' },
        { text: '波兰', value: 'PL' },
        { text: '葡萄牙', value: 'PT' },
        { text: '罗马尼亚', value: 'RO' },
        { text: '塞尔维亚', value: 'RS' },
        { text: '瑞典', value: 'SE' },
        { text: '斯洛文尼亚', value: 'SI' },
        { text: '新加坡', value: 'SG' },
        { text: '斯洛伐克', value: 'SK' },
        { text: '圣马力诺', value: 'SM' },
        { text: '前苏联', value: 'SU' },
        { text: '萨尔瓦多', value: 'SV' },
        { text: '泰国', value: 'TH' },
        { text: '塔吉克斯坦', value: 'TJ' },
        { text: '突尼斯', value: 'TN' },
        { text: '土耳其', value: 'TR' },
        { text: '特立尼达和多巴哥', value: 'TT' },
        { text: '乌克兰', value: 'UA' },
        { text: '乌拉圭', value: 'UY' },
        { text: '乌兹别克斯坦', value: 'UZ' },
        { text: '越南', value: 'VN' },
        { text: '南斯拉夫', value: 'YU' },
        { text: '南非', value: 'ZA' },
        { text: '赞比亚', value: 'ZM' },
        { text: '津巴布韦', value: 'ZW' },
        { text: '世界知识产权组织国际局', value: 'WO' },
        { text: '中国', value: 'CN' },
        { text: '日本', value: 'JP' },
        { text: '英国', value: 'GB' },
        { text: '德国', value: 'DE' },
        { text: '瑞士', value: 'CH' },
        { text: '美国', value: 'US' },
        { text: '韩国', value: 'KR' },
        { text: '法国', value: 'FR' },
        { text: '俄罗斯', value: 'RU' },
        { text: '欧洲专利局（EPO）', value: 'EP' },
        { text: '中国香港', value: 'HK' },
        { text: '中国台湾', value: 'TW' }
      ]
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },

  methods: {
    init() {
      new Typed('#word1', {
        strings: [`船长，我们迷路了！要往哪边航行？`],
        loop: true,
        // loopCount: 4,
        typeSpeed: 50,
        backSpeed: 0,
        fadeOut: true,
        showCursor: false,
        fadeOutDelay: 2000
      })
      new Typed('#word2', {
        strings: [`圣(sou)光(suo)将指引你前进！`],
        loop: true,
        // loopCount: 4,
        typeSpeed: 50,
        backSpeed: 0,
        fadeOut: true,
        showCursor: false,
        startDelay: 2000,
        fadeOutDelay: 2000
      })
      this.history = getHistory()
    },

    onSearch() {
      setHistory(this.queryModel)
      this.history = getHistory()
    },

    onResearch({ keyword, region, org }) {
      debugger
      this.queryModel = {
        keyword,
        region,
        org
      }
      setHistory(this.queryModel)
      this.history = getHistory()
    },

    onToggleHistory() {
      this.showHistory = !this.showHistory
      if (this.showMore) {
        this.showMore = false
      }
    },

    onToggleMore() {
      this.showMore = !this.showMore
      if (this.showHistory) {
        this.showHistory = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-wrapper {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;

  display: float;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  position: relative;

  header {
    height: 60px;
    line-height: 60px;
    border-bottom: solid 1px #ccc;

    .logo {
      height: 55px;
      border-radius: 50%;
      object-fit: cover;
      padding-left: 10px;
    }
  }

  .container {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    background: url(./img/bg.jpg) no-repeat center center;
    background-size: cover;
    .content {
      width: 1200px;
      height: calc(100vh - 60px);

      .banner {
        display: flex;
        flex-flow: column nowrap;
        padding-top: 50px;
        .dialog {
          display: flex;
          flex-flow: row nowrap;
          padding-bottom: 20px;
          .avatar {
            img {
              width: 100px;
              height: 100px;
              border-radius: 50%;
            }
          }

          .word {
            width: 200px;
            height: 110px;
            background: url(./img/dialog.png) no-repeat;
            background-size: cover;
          }
        }
      }

      .search-wrapper {
        padding-top: 30px;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;

        h3 {
          color: #fff;
          font-size: 24px;
        }

        /deep/ .el-input-group--append .el-input__inner,
        .el-input-group__prepend {
          border-width: 0px;
        }

        /deep/ .el-input-group__append {
          color: #fff;
          background-color: #061826;
        }

        /deep/ .el-input-group {
          box-shadow: 0px 24px 31.85px 3.15px rgba(45, 45, 45, 0.4);
          border-bottom-right-radius: 5px;
        }
      }

      .tool-wrapper {
        padding-top: 30px;
        height: 60px;
        color: #fff;
        display: float;
        flex-flow: row nowrap;
        align-items: center;
        font-size: 18px;
        i {
          font-size: 24px;
        }

        .tool {
          cursor: pointer;
        }
      }

      .more-wrappr {
        width: 900px;
        // height: 60px;
        box-sizing: border-box;
        background: #fff;

        padding: 20px 0 0 20px;
      }
    }
  }

  .setting-wrapper {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%;);
    width: 50px;
    height: 50px;
    color: #fff;
    font-size: 32px;
    background: #1890fe;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .history-wrapper {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }
}
</style>
