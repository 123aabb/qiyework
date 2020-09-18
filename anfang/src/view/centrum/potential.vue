<template>
  <div class="app-container">
    <Breadcrumb />
    <div class="search">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="searchParams.telphone" placeholder="请输入客户手机号" style="width: 200px;" class="filter-item" clearable @clear="clearListSearch" />
        </el-form-item>
        <el-form-item>
          <el-button class="search-btn el-button--infoSearch" type="primary" icon="el-icon-search" @click="submitSearch()">搜索</el-button>
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
      <el-table-column label="客户姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.customerName }}
        </template>
      </el-table-column>
      <el-table-column label="客户手机号" align="center">
        <template slot-scope="scope">
          {{ scope.row.telphone }}
        </template>
      </el-table-column>
      <el-table-column label="微信昵称" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickName }}
        </template>
      </el-table-column>
      <el-table-column label="微信头像" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.headImg" width="40" height="40" class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column label="最近访问时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.updateTime |timeParse }}
        </template>
      </el-table-column>
    </el-table>
     </div>
    

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Breadcrumb from '@/publicComp/Breadcrumb'
// 公共类转换事件格式
import { timeParse } from '@/commom/commom'
import Qs from 'qs'
//import { getList } from '../../api/table'
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
      currentPage: 1,
      searchParams: {
        telphone: ''
      },
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      list: null,
      dialogVisible: false,
      editdialogVisible: false,
      enterpriseList: null,
      menuOptions: null,
      role: {
        'roleId': '',
        'enterpriseId': '',
        'roleName': '',
        'menuId': ''
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
    this.getEnterPriceList()
  },
  methods: {
    // 分页查询
    getList() {
      var vm = this
      const search = {
        telphone: this.searchParams.telphone || ''
      }
      vm.axios({
        method: 'GET',
        url: '/api/customer/potential?page=' + vm.listQuery.page + '&size=' + vm.listQuery.limit,
        params: search
      }).then(function(res) {
        // 得到一个pageInfo对象
        // console.log(res.data.data)
        vm.total = res.data.data.total
        vm.list = res.data.data.records// 当前页显示的所有数据
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
    // 重置
    resetTemp() {
      this.role = {
        'roleId': '',
        'enterpriseId': '',
        'roleName': '',
        'menuId': ''
      }
    },
    // 添加角色
    addUser() {
      this.dialogVisible = true
      this.resetTemp()
    },
    // 选择公司动态获取该公司下所有数据
    enterPriceChange(enterpriseId) {
      var vm = this
      vm.role.menuId = ''
      this.axios({
        method: 'POST',
        url: '/api/role/getMenuByEnterpriseId?enterpriseId=' + enterpriseId
      }).then(function(res) {
        if (res.data.code === 200) {
          // 获取企业下的菜单
          vm.menuOptions = res.data.map.all
          // console.log(res.data.map.all)
        }
      })
    },
    // 添加角色确定按钮
    onaddSubmit() {
      this.$refs.role.validate((valid) => {
        if (valid) {
          var vm = this
          // 数组转换为字符串
          var roleIdsString = vm.role.menuId
          if (roleIdsString.length !== 0) {
            vm.role.menuId = roleIdsString.join(',')
          }
          // console.log(vm.role)
          vm.axios({
            method: 'POST',
            url: '/api/role/addItem',
            transformRequest: [function(data) {
              return Qs.stringify(data)
            }],
            data: vm.role
          }).then(function(res) {
            if (res.data.code === 500) {
              vm.$message.error('添加角色失败')
            } else if (res.data.code === 200) {
              vm.dialogVisible = false
              vm.getList()
            }
          })
        }
      })
    },
    // 编辑角色
    editUser(roleId) {
      this.editdialogVisible = true
      this.fatchDataByRoleId(roleId)
      this.getRoles(roleId)
    },
    oneditSubmit() {
      this.$refs['role'].validate((valid) => {
        if (valid) {
          var userId = this.role.userId
          var vm = this
          var roleIdsString = vm.role.menuId
          if (roleIdsString.length !== 0) {
            vm.role.menuId = roleIdsString.join(',')
          }
          vm.axios({
            method: 'POST',
            url: '/api/role/updateItem?userId=' + userId,
            transformRequest: [function(data) {
              return Qs.stringify(data)
            }],
            data: vm.data
          }).then(function(res) {
            if (res.data.code === 500) {
              vm.$message.error('修改用户失败')
            } else if (res.data.code === 200) {
              vm.editdialogVisible = false
              vm.getList()
            }
          })
        }
      })
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
    // 获取当前企业所有角色
    getRoles(userId) {
      console.log(1)
      var vm = this
      this.axios({
        method: 'POST',
        url: '/api/user/findRoleByUserId?userId=' + userId
      }).then(function(res) {
        if (res.data.code === 200) {
          // 角色数组
          vm.roleIdsOptions = res.data.data
          console.log(vm.roleIdsOptions)
        }
      })
    },
    // 修改状态
    editUserState(userId, state) {
      this.$confirm('确定修改当前用户状态吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var vm = this
        this.axios({
          method: 'GET',
          url: '/api/user/status?userId=' + userId + '&state=' + state
        }).then(function(res) {
          if (res.data.code === 200) {
            vm.$message({
              message: '修改用户状态成功',
              type: 'success'
            })
            vm.fetchData()// 刷新列表
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
      this.searchParams = {
        enterpriseName: '',
        roleName: ''
      }
    },
    // 清除列表的搜索表单
    clearListSearch() {
      this.clearForm()
      this.getList()
    }
  }
}
</script>

<style scoped>
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
