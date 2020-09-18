<template>
  <div class="app-container">
    <Breadcrumb />
    <div class="search">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="searchParams.realName" placeholder="请输入顾问名称" style="width: 200px;" class="filter-item" clearable @clear="clearListSearch" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchParams.customerName" placeholder="请输入客户名称" style="width: 200px;" class="filter-item" clearable @clear="clearListSearch1" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchParams.projectName" placeholder="请输入项目名称" style="width: 200px;" class="filter-item" clearable @clear="clearListSearch2" />
        </el-form-item>
        <el-form-item>
          <el-button class="search-btn el-button--infoSearch" type="primary" icon="el-icon-search" @click="submitSearch()">搜索</el-button>
          <el-button class="filter-item" style="margin-left: 5px;" type="primary" @click="batchTransfer()">批量转移</el-button>
        </el-form-item>
      </el-form>
      <!-- <div class="clearFix" /> -->
    </div>

    <div :class="leftFlags?'tabStyles':'tabStyles2'">
      <el-table :data="list" border fit highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="顾问姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column label="顾问电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.userTelphone }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>
      <el-table-column label="客户姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.customerName }}
        </template>
      </el-table-column>
      <el-table-column label="客户电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.telphone }}
        </template>
      </el-table-column>
      <el-table-column label="客户微信昵称" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickName }}
        </template>
      </el-table-column>
      <el-table-column label="获客时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime |timeParse }}
        </template>
      </el-table-column>
      <el-table-column label="所属状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">当前</span>
          <span v-if="scope.row.status == 0">历史</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="360">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.customerId,scope.row.projectId)">
            变更顾问
          </el-button>
          <el-button size="mini" type="" @click="changeToPotential(scope.row.cuId)">
            转移至潜在客户
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 编辑弹出框 -->
    <el-dialog title="变更顾问" :visible.sync="editdialogVisible" width="50%">
      <el-form ref="role" :model="role" label-width="120px">
        <el-form-item label="项目名称" prop="enterpriseName">
          <el-select v-model="projectId" clearable placeholder="请选择项目" @change="enterPriceChange($event)">
            <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName" :value="item.projectId" />
          </el-select>
        </el-form-item>
        <el-form-item label="顾问名称" prop="enterpriseName">
          <el-select v-model="userId" clearable placeholder="请选择顾问">
            <el-option v-for="item in userList" :key="item.userId" :label="item.realName" :value="item.userId" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="oneditSubmit">确 定</el-button>
        <el-button @click="editdiaCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
 import Pagination from '@/components/Pagination'
 import Breadcrumb from '@/publicComp/Breadcrumb'
import { timeParse } from '@/commom/commom'
// eslint-disable-next-line no-unused-vars
import Qs from 'qs'
const checkBoxData = []
export default {
   components: { 
     Pagination,
     Breadcrumb
   },
  filters: {
    timeParse
  },
  data() {
    return {
      customerStr: '',
      currentPage: 1,
      searchParams: {
        realName: '',
        projectName: '',
        customerName: '',
      },
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      list: null,
      editdialogVisible: false,
      projectList: null,
      userList: null,
      menuOptions: null,
      projectId: null,
      userId: null,
      customerId: null,
      role: {
        'enterpriseId': ''
      },
      rules: {
        enterpriseName: [{ required: true, message: '不能为空' }],
        roleName: [{ required: true, message: '不能为空' }]
      }
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
    // this.getEnterPriceList()
  },
  methods: {
    // 分页查询
    getList() {
      var vm = this
      const search = {
        realName: this.searchParams.realName || '',
        projectName: this.searchParams.projectName || '',
        customerName: this.searchParams.customerName || '',
      }
      vm.axios({
        method: 'GET',
        url: '/api/customer/search?page=' + vm.listQuery.page + '&size=' + vm.listQuery.limit,
        params: search
      }).then(function(res) {
        console.log(res)
        vm.list = res.data.data.records// 当前页显示的所有数据
        vm.total = res.data.data.total
        vm.role.enterpriseId = res.data.data.records[0].enterpriseId
        res.data.data.records.forEach(function(item) {
          checkBoxData.push(item.cuId)
        })
        vm.customerStr = checkBoxData.join(',')
      })
    },
    batchTransfer() {
      this.$confirm('确定转移当前所有用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var vm = this
        const transfer = {
          customerStr: this.customerStr || ''
        }
        vm.axios({
          method: 'GET',
          url: '/api/customer/changePart',
          params: transfer
        }).then(function(res) {
          if (res.data.code === 200) {
            vm.$message.success('转移成功')
            vm.getList()
          } else {
            vm.$message.error('转移失败')
          }
        })
      })
    },
    // 获取所有企业
    getEnterPriceList() {
      var vm = this
      this.axios({
        method: 'GET',
        url: '/api/enterprise/enterpriseList'
      }).then(function(res) {
        if (res.data.code === 200) {
          vm.enterpriseList = res.data.data
        }
      })
    },

    // 根据项目id查出所有该项目下的顾问
    enterPriceChange(projectId) {
      var vm = this
      this.axios({
        method: 'GET',
        url: '/api/user/getUserByProjectId?projectId=' + projectId
      }).then(function(res) {
        if (res.data.code === 200) {
          vm.userList = res.data.data
        } else {
          vm.$message.error('获取顾问失败')
        }
      })
    },
    // 编辑角色
    editUser(customerId, projectId) {
      this.editdialogVisible = true
      this.customerId = customerId
      this.projectId = projectId
      this.enterPriceChange(projectId)
      this.getProjectListByEnterId()
    },
    // 获取该企业下的所有项目
    getProjectListByEnterId(enterpriseId) {
      var vm = this
      this.axios({
        method: 'GET',
        url: '/api/project/getProjectListByEnterId'
      }).then(function(res) {
        if (res.data.code === 200) {
          // 获取企业下的菜单
          vm.projectList = res.data.data
          // console.log(res.data.map.all)
        } else {
          vm.$message.error('获取项目失败')
        }
      })
    },
    //  修改客户的置业顾问
    oneditSubmit() {
      var vm = this
      const search = {
        projectId: this.projectId || '',
        userId: this.userId || '',
        customerId: this.customerId || ''
      }
      this.axios({
        method: 'GET',
        url: '/api/customer/changeUser',
        params: search
      }).then(function(res) {
        if (res.data.code === 200) {
          vm.$message({
            message: '变更成功',
            type: 'success'
          })
          vm.editdialogVisible = false
          vm.getList()// 刷新列表
        } else {
          vm.$message({
            message: '变更失败',
            type: 'error'
          })
          vm.editdialogVisible = false
          vm.getList()// 刷新列表
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(function(error) {
        vm.$message.error('修改用户状态失败')
      })
    },
    editdiaCancel() {
      this.projectId = null
      this.userId = null
      this.editdialogVisible = false
    },
    fatchDataByRoleId(roleId) {
      var vm = this
      this.axios({
        method: 'GET',
        url: '/api/role/findById?roleId=' + roleId
      }
      ).then(function(res) {
        console.log(res.data)
        vm.role = res.data.data
        // vm.role.roleList = res.data.data.roleList
        var menuIdArr = []
        vm.user.roleList.forEach(function(item) {
          menuIdArr.push(item.menuId)
        })
        vm.role.menuId = menuIdArr
      })
    },
    // 转移至潜在客户
    changeToPotential(cuId) {
      this.$confirm('确定转移当前用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var vm = this
        this.axios({
          method: 'GET',
          url: '/api/customer/changeToPotential?cuId=' + cuId
        }).then(function(res) {
          if (res.data.code === 200) {
            vm.$message({
              message: '转移成功',
              type: 'success'
            })
            vm.getList()// 刷新列表
          } else {
            vm.$message({
              message: '转移失败',
              type: 'error'
            })
            vm.getList()// 刷新列表
          }
          // eslint-disable-next-line handle-callback-err
        }).catch(function(error) {
          vm.$message.error('修改用户状态失败')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
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
    // 格式化表单数据
    clearForm() {
      this.searchParams.realName = ''
    },
    clearForm1() {
      this.searchParams.customerName = ''
    },
    clearForm2() {
      this.searchParams.projectName = ''
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
    clearListSearch2() {
      this.clearForm2()
      this.getList()
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
