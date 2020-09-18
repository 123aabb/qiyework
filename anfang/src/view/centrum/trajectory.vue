<template>
  <div class="app-container">
    <Breadcrumb />
    <div class="search">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="searchParams.telphone" placeholder="请输入客户手机号" style="width: 200px;" class="filter-item" clearable @clear="clearListSearch" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchParams.nickName" placeholder="请输入微信昵称" style="width: 200px;" class="filter-item" clearable @clear="clearListSearch1" />
        </el-form-item>
        <el-form-item>
          <el-button class="search-btn el-button--infoSearch" type="primary" icon="el-icon-search" @click="submitSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div :class="leftFlags?'tabStyles':'tabStyles2'">
      <el-table :data="list" border fit highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="客户手机号" align="center">
        <template slot-scope="scope">
          {{ scope.row.telphone }}
        </template>
      </el-table-column>
      <el-table-column label="客户姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.customerName }}
        </template>
      </el-table-column>
      <el-table-column label="微信昵称" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickName }}
        </template>
      </el-table-column>
      <el-table-column label="最近访问时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.updateTime |timeParse }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="360">
        <template slot-scope="scope">
          <el-button size="mini" type="" @click="checksee(scope.row.customerId)">
            查看客户轨迹
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 查看客户轨迹 -->
    <el-dialog title="查看客户轨迹" :visible.sync="checkdialogVisible" width="50%">

      <el-form :model="customerTrack" :inline="true" class="demo-form-inline">
        <div>
          <el-form-item :label-width="formLabelWidth">
            <el-select v-model="customerTrack.customerBehaviorId" placeholder="客户行为" prop="customerBehaviorId" clearable @clear="clearBehaviorList">
              <el-option v-for="item in behaviorOptions" :key="item.customerBehaviorId" :label="item.behaviorName" :value="item.customerBehaviorId" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="search-btn el-button--infoSearch" type="primary" icon="el-icon-search" @click="submitSearchBehavior()">搜索</el-button>
          </el-form-item>
        </div>
        <div style="display:inline-flex;margin-bottom:22px; font-size: 14px">
          <div style="display:inline-flex;margin-right:20px;">微信昵称：<div>{{ customer.nickName }}</div></div>
          <div style="display:inline-flex;margin-right:20px;">客户手机号：<div>{{ customer.telphone }}</div></div>
          <div style="display:inline-flex;">客户姓名：<div>{{ customer.customerName }}</div></div>
        </div>
        <el-table :data="customerTrackList" border fit highlight-current-row>
          <el-table-column align="center" label="序号" width="80">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="客户行为">
            <template slot-scope="scope">
              {{ scope.row.behaviorName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="行为详情" min-width="150">
            <template slot-scope="scope">
              {{ scope.row.behaviorDetail }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作时间">
            <template slot-scope="scope">
              {{ scope.row.operationTime |timeParse }}
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <pagination :total="total2" :page.sync="listQuery2.page" :limit.sync="listQuery2.limit" @pagination="getCustomerTrack" />
      <!--<div slot="footer" class="dialog-footer">
        <el-button @click="checkdialogVisible = false">取 消</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
 import Pagination from '@/components/Pagination'
// 公共类转换事件格式
import { timeParse } from '@/commom/commom'
import Breadcrumb from '@/publicComp/Breadcrumb'
 import Qs from 'qs'
export default {
   components: { 
     Pagination,
     Breadcrumb
   },
  // 公共类转换事件格式
  filters: {
    timeParse
  },
  data() {
    return {
      currentPage: 1,
      searchParams: {
        telphone: '',
        nickName: ''
      },
      total: 0,
      total2: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      listQuery2: {
        page: 1,
        limit: 10
      },
      behaviorOptions: null,
      customer: {
        'customerId': '',
        'telphone': '',
        'customerName': '',
        'openId': '',
        'nickName': '',
        'headImg': '',
        'updateTime': ''
      },
      customerTrack: {
        'customerId': '',
        'customerBehaviorId': '',
        'behaviorName': '',
        'lastTime': '',
        'behaviorDetail': '',
        'operationTime': ''
      },
      list: null,
      customerTrackList: null,
      checkdialogVisible: false,
      form: {
        region: ''
      },
      formLabelWidth: '120px'
    }
  },
  computed: {
    leftFlags() {
      console.log(this.$store.state.leftFlag);
      return this.$store.state.leftFlag;
    },
  },
  created() {
    this.getList()
  },
  methods: {
    // 分页查询
    getList() {
      var vm = this
      const search = {
        telphone: this.searchParams.telphone || '',
        nickName: this.searchParams.nickName || ''
      }
      vm.axios({
        method: 'GET',
        url: '/api/customerUser/list?page=' + vm.listQuery.page + '&limit=' + vm.listQuery.limit,
        params: search
      }).then(function(res) {
        // 得到一个pageInfo对象
        vm.total = res.data.data.total
        vm.list = res.data.data.data// 当前页显示的所有数据
      })
    },
    checksee(customerId) {
      this.customerTrack.customerId = customerId
      this.getCustomerBehavior()
      this.getCustomer(customerId)
      this.getCustomerTrack()
      this.checkdialogVisible = true
    },
    // 获取所有行为
    getCustomerTrack() {
      var vm = this
      const search = {
        customerBehaviorId: this.customerTrack.customerBehaviorId || ''
      }
      this.axios({
        method: 'GET',
        url: '/api/customerTrack/index?page=' + vm.listQuery2.page + '&limit=' + vm.listQuery2.limit + '&customerId=' + vm.customerTrack.customerId,
        params: search
      }).then(function(res) {
        // 得到一个pageInfo对象
        vm.total2 = res.data.data.total
        vm.customerTrackList = res.data.data.data// 当前页显示的所有数据
      })
    },
    // 获取当前客户信息
    getCustomer(customerId) {
      var vm = this
      this.axios({
        method: 'GET',
        url: '/api/customerTrack/getCustomerById?customerId=' + customerId
      }).then(function(res) {
        vm.customer = res.data.data// 当前页显示的所有数据
      })
    },
    // 获取所有行为
    getCustomerBehavior() {
      var vm = this
      this.axios({
        method: 'POST',
        url: '/api/behavior/getAllBehavior'
      }).then(function(res) {
        if (res.data.code === 0) {
          // 角色数组
          vm.behaviorOptions = res.data.data
        }
      })
    },
    // 取消事件
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    // 搜索
    submitSearch() {
      this.listQuery.page = 1
      this.getList()
      this.currentPage = 1
    },
    submitSearchBehavior() {
      this.listQuery2.page = 1
      this.getCustomerTrack()
      this.currentPage = 1
    },
    // 格式化表单数据
    clearForm() {
      this.searchParams.telphone = ''
    },
    clearForm1() {
      this.searchParams.nickName = ''
    },
    // 清除列表的搜索表单
    clearListSearch() {
      this.clearForm()
      this.getList()
    },
    clearListSearch1() {
      this.clearForm1()
      this.getList()
    },
    clearBehaviorList() {
      this.getCustomerTrack()
    }
  }
}
</script>

<style  scoped>
.tabStyles{
  width: calc(100% - 65px);;
  margin: 20px auto;
}
.tabStyles2{
  width:calc(100% - 200px);
  margin: 20px auto;
}
.el-select{
  width: 360px;
}
.el-input{
  width: 360px;
}
</style>
