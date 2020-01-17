<template>
  <div class="search-wrapper">
    <header>
      <div class="header-content">
        <div class="logo" @click="onLogoClick"></div>
        <div class="search-input-wrapper">
          <i class="el-icon-search"></i>
          <input v-model="queryModel.keyword" @keyup.enter="onSearch" />
          <i class="iconfont icon-enter enter" @click="onSearch"></i>
        </div>
      </div>
    </header>

    <div class="chart-wrapper">
      <ring-chart
        v-if="chartData.type.chartData.length"
        :legend="chartData.type.legend"
        :chartData="chartData.type.chartData"
        :series="chartData.type.series"
      />

      <ring-chart
        v-if="chartData.grant.chartData.length"
        :legend="chartData.grant.legend"
        :chartData="chartData.grant.chartData"
        :series="chartData.grant.series"
      />

      <ring-chart
        v-if="chartData.legal.chartData.length"
        :legend="chartData.legal.legend"
        :chartData="chartData.legal.chartData"
        :series="chartData.legal.series"
      />

      <div class="more" @click="onMoreClick">
        more
      </div>
    </div>

    <div class="tabs-wrapper">
      <div class="tab" :class="{ active: currentTab === 1 }" @click="currentTab = 1">专利</div>
      <div class="tab" :class="{ active: currentTab === 2 }" @click="currentTab = 2">文献</div>
    </div>
    <div class="tbl-wrapper" v-show="currentTab === 1">
      <div class="export-wrapper">
        <el-dropdown @command="handleExportCommand">
          <el-button type="primary">
            导出<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="xlsx">excel</el-dropdown-item>
            <el-dropdown-item command="csv">csv</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div class="tbl-content" v-for="(row, index) in tblData" :key="index">
        <div class="title">
          <h3 v-html="row['title.text_zh']"></h3>
          <el-tag
            v-show="row['legal_status_result.legalstatus']"
            :type="getTagType(row['legal_status_result.legalstatus'])"
            >{{ row['legal_status_result.legalstatus'] }}</el-tag
          >
        </div>
        <div class="info">
          <span class="agency">{{ row['agents.agency'] }}</span>
          <span class="inventors">发明人:{{ row['inventors.name_zh'] }}</span>
          <span class="ipcs">分类号：{{ row['ipcs.maingroup'] }}</span>
        </div>
        <div class="desc">摘要:{{ row['abstract.text_zh'] }}</div>
      </div>
      <el-pagination
        @current-change="onQuery"
        :current-page.sync="queryModel.page"
        :page-size="queryModel.pageSize"
        layout="total,  prev, pager, next"
        :total="tblCnt"
      >
      </el-pagination>
    </div>

    <div class="tbl-wrapper" v-show="currentTab === 2">
      <div class="export-wrapper">
        <el-dropdown @command="handleExportCommand">
          <el-button type="primary">
            导出<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="xlsx">excel</el-dropdown-item>
            <el-dropdown-item command="csv">csv</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div class="tbl-content" v-for="(row, index) in tblData" :key="index">
        <div class="title">
          <h3 v-html="row['sc_title']"></h3>
        </div>
        <div class="info">
          <span class="agency">{{ row['sc_author.sc_affiliate'] }}</span>
          <span class="inventors">作者:{{ row['sc_author.sc_name'] }}</span>
          <span class="ipcs">关键词:{{ row['sc_keyword'] }}</span>
        </div>
        <div class="desc">摘要:{{ row['sc_abstract'] }}</div>
      </div>
      <el-pagination
        @current-change="onQuery"
        :current-page.sync="queryModel.page"
        :page-size="queryModel.pageSize"
        layout="total,  prev, pager, next"
        :total="tblCnt"
      >
      </el-pagination>
    </div>

    <div class="setting-wrapper" @click="showHistory = true">
      <i class="el-icon-s-tools" />
    </div>
    <el-drawer :visible.sync="showHistory">
      <div class="history-wrapper">
        <h3>检索历史</h3>
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
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { setHistory, getHistory } from '@/utils/history'

import { getPatentList, getPaperList, getIndexVisual } from '@/service'

import { exportJson2Excel } from '@/utils/excel'

import RingChart from './components/ring'

export default {
  name: 'Search',

  components: {
    RingChart
  },

  data() {
    return {
      queryModel: {
        keyword: '',
        region: [],
        org: '',
        page: 1,
        pageSize: 10
      },
      showHistory: false,
      history: [],
      tblData: [],
      tblCnt: 0,
      currentTab: 1,
      chartData: {
        type: {
          series: '专利类型',
          legend: ['发明', '实用新型', '外观'],
          chartData: []
        },
        grant: {
          series: '授权情况',
          legend: ['已授权', '未授权'],
          chartData: []
        },
        legal: {
          series: '法律状态',
          legend: ['审中', '有权', '无效'],
          chartData: []
        }
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },

  methods: {
    ...mapMutations(['setQueryModel']),

    init() {
      const check = this.checkQuery()
      this.queryModel.keyword = this.currentQuery.keyword
      this.queryModel.region = this.currentQuery.region
      this.queryModel.org = this.currentQuery.org
      if (!check) {
        this.$router.push('/home')
      }
      this.handleQuery()
      this.initChart()
      this.history = getHistory()
    },

    onSearch() {
      this.queryModel.region = []
      this.queryModel.org = ''
      this.queryModel.page = 1
      if (this.checkQuery()) {
        setHistory(this.queryModel)
        this.history = getHistory()
        this.setQueryModel(this.queryModel)
        this.handleQuery()
      }
    },

    checkQuery() {
      const { keyword, region, org } = this.currentQuery
      if (!keyword.trim() && region.length === 0 && !org.trim()) {
        return false
      } else {
        return true
      }
    },

    onResearch({ keyword, region, org }) {
      this.queryModel = {
        keyword,
        region,
        org,
        page: 1,
        pageSize: 10
      }
      setHistory(this.queryModel)
      this.history = getHistory()
      this.setQueryModel(this.queryModel)
      this.handleQuery()
    },

    onQuery() {
      this.handleQuery()
    },

    async handleQuery() {
      const postData = {
        query: this.queryModel.keyword,
        regional: this.queryModel.region.join(','),
        org: this.queryModel.org,
        yearType: 999,
        page: this.queryModel.page - 1,
        pageSize: this.queryModel.pageSize
      }
      if (this.currentTab === 1) {
        const { total, data } = await getPatentList(postData)
        this.tblCnt = total
        this.tblData = data
      } else {
        const { total, data } = await getPaperList(postData)
        this.tblCnt = total
        this.tblData = data
      }
      this.initChart()
    },

    getTagType(val) {
      switch (val) {
        case '有权':
          return 'success'
        case '审中':
          return 'warning'
        case '无效':
          return 'danger'
        default:
          return 'info'
      }
    },

    async onExportClick() {
      const postData = {
        query: this.queryModel.keyword,
        regional: this.queryModel.region.join(','),
        org: this.queryModel.org,
        yearType: 999,
        page: 1,
        pageSize: 9999
      }

      if (this.currentTab === 1) {
        const { data } = await getPatentList(postData)
        exportJson2Excel(data, '搜索结果', '专利')
      } else {
        const { data } = await getPaperList(postData)
        exportJson2Excel(data, '搜索结果', '文献')
      }
    },

    getPatentType(val) {
      switch (val) {
        case 1:
          return '发明'
        case 2:
          return '实用新型'
        case 3:
          return '外观'
        default:
          return '发明'
      }
    },

    onLogoClick() {
      this.$router.push('/home')
    },

    async initChart() {
      const postData = {
        query: this.queryModel.keyword,
        regional: this.queryModel.region.join(','),
        org: this.queryModel.org
      }
      const res = await getIndexVisual(postData)
      const {
        stats_type: type,
        stats_granted_status: grant,
        stats_legal_status: legal
      } = res.indexVisual[0]

      this.chartData.type.chartData = type.buckets.map((item) => {
        return {
          value: item.doc_count,
          name: this.getPatentType(item.key)
        }
      })
      this.chartData.grant.chartData = grant.buckets.map((item) => {
        return {
          value: item.doc_count,
          name: item.key === '1' ? '已授权' : '未授权'
        }
      })
      this.chartData.legal.chartData = legal.buckets.map((item) => {
        return {
          value: item.doc_count,
          name: item.key
        }
      })
    },

    onMoreClick() {
      this.$router.push('/report')
    },

    async handleExportCommand(c) {
      const postData = {
        query: this.queryModel.keyword,
        regional: this.queryModel.region.join(','),
        org: this.queryModel.org,
        yearType: 999,
        page: 1,
        pageSize: 9999
      }

      if (this.currentTab === 1) {
        const { data } = await getPatentList(postData)
        if (data && data.length > 0) {
          exportJson2Excel(data, '搜索结果', '专利', null, c)
        } else {
          this.$message.error('暂无数据')
        }
      } else {
        if (data && data.length > 0) {
          const { data } = await getPaperList(postData)
          exportJson2Excel(data, '搜索结果', '文献', null, c)
        } else {
          this.$message.error('暂无数据')
        }
        const { data } = await getPaperList(postData)
        exportJson2Excel(data, '搜索结果', '文献', null, c)
      }
    }
  },

  computed: {
    ...mapGetters(['currentQuery'])
  },

  watch: {
    currentTab() {
      this.queryModel.page = 1
      this.handleQuery()
    }
  }
}
</script>

<style lang="less" scoped>
.search-wrapper {
  width: 100%;
  min-height: 100vh;
  // overflow-y: auto;
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

      .search-input-wrapper {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        width: 580px;
        height: 35px;
        background: #222;
        border-radius: 10px;

        i {
          flex: 0 0 auto;
          color: #fff;
          font-size: 24px;
          padding: 0 10px;
        }

        .enter {
          cursor: pointer;
          font-size: 32px;
          color: rgba(255, 255, 255, 0.5);

          &:hover {
            color: #fff;
          }
        }

        input {
          flex: 1 1 auto;
          border-color: transparent;
          background: rgba(0, 0, 0, 0);
          color: #fff;
          outline: none;
          height: 24px;
          font-size: 22px;
        }
      }
    }
  }

  .chart-wrapper {
    display: flex;
    margin: 20px 0;
    width: 1200px;
    height: 200px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    position: relative;

    .more {
      position: absolute;
      bottom: 5px;
      right: 5px;
      color: #fff;
      border: solid 1px #fff;
      padding: 5px;
      cursor: pointer;
    }
  }

  .tabs-wrapper {
    width: 1200px;

    display: flex;
    flex-flow: row nowrap;
    border-bottom: solid 1px #fff;
    color: #fff;

    .tab {
      cursor: pointer;
      width: 60px;
      text-align: center;
      padding: 10px;
      // border: solid 1px #fff;

      &.active {
        color: blue;
      }
    }
  }

  .tbl-wrapper {
    width: 1200px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 0 10px 10px 10px;
    padding: 10px;
    /deep/ .el-pagination__total {
      color: #fff;
    }

    .export-wrapper {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
    }

    .tbl-content {
      display: flex;
      flex-flow: column nowrap;
      color: #fff;
      margin-bottom: 10px;

      .title {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        h3 {
          font-size: 18px;
          font-weight: 700;
          padding-right: 20px;
        }
      }
      .info {
        padding-bottom: 10px;
        span {
          padding-right: 20px;
        }
      }

      .desc {
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }

  .setting-wrapper {
    cursor: pointer;
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%;);
    width: 50px;
    height: 50px;
    color: #fff;
    font-size: 32px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px 0 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .history-wrapper {
    padding: 0 10px;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }
}
</style>
