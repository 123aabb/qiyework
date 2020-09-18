<template>
  <div class="app-container">
    <Breadcrumb />
    <div class="search">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="searchParams.roleName" placeholder="请输入角色名称" style="width: 200px;margin-left: 5px" class="filter-item" clearable @clear="clearListSearch" />
        </el-form-item>
        <el-form-item>
          <el-button class="search-btn el-button--infoSearch" type="primary" icon="el-icon-search" @click="submitSearch()">搜索</el-button>
          <el-button class="filter-item" style="margin-left: 5px;" type="primary" @click="addUser()">新增角色</el-button>
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
      <el-table-column label="企业名称" align="center" width="360">
        <template slot-scope="scope">
          {{ scope.row.enterpriseName }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="360">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.roleId)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="delRole(scope.row.roleId)">
            删除
          </el-button>
          <!-- <el-button size="mini" type="" @click="editMenu(scope.row.roleId)">
            设置菜单
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    </div>

    

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加弹出框 -->
    <el-dialog title="新增角色" :visible.sync="dialogVisible" width="50%">
      <el-form ref="role" :model="role" :rules="rules" label-width="120px">
        <!-- <el-form-item label="企业名称" prop="enterpriseName">
          <el-select v-model="role.enterpriseId" clearable placeholder="显示企业名称" @change="enterPriceChange($event)">
            <el-option v-for="item in enterpriseList" :key="item.enterpriseId" :label="item.enterpriseName" :value="item.enterpriseId" />
          </el-select>
        </el-form-item>-->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="role.roleName" placeholder="请输入角色名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="选择菜单" prop="menuId">
          <el-tree
            ref="tree"
            :data="allMenu"
            show-checkbox
            default-expand-all
            node-key="menuId"
            highlight-current
            :default-checked-keys="value"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onaddSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑角色" :visible.sync="editdialogVisible" width="50%">
      <el-form ref="role" :model="role" :rules="rules" label-width="120px">
        <!-- <el-form-item label="企业名称" prop="enterpriseName">
          <el-select v-model="role.enterpriseId" clearable placeholder="显示企业名称" @change="enterPriceChange($event)">
            <el-option v-for="item in enterpriseList" :key="item.enterpriseId" :label="item.enterpriseName" :value="item.enterpriseId" />
          </el-select>
        </el-form-item>-->
        <el-form-item label="角色名称" prop="roleName">
          <!-- <el-select v-model="role.roleIds" multiple placeholder="请输入角色名称" >
            <el-option v-for="item in roleIdsOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
          </el-select> -->
          <el-input v-model="role.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="选择菜单" prop="menuId">
          <el-tree
            ref="tree"
            :data="allMenu"
            show-checkbox
            default-expand-all
            node-key="menuId"
            highlight-current
            :default-checked-keys="value"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="oneditSubmit">确 定</el-button>
        <el-button @click="editdialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑菜单" :visible.sync="editmenuVisible" width="33%">
      <el-tree
        ref="tree"
        :data="allMenu"
        show-checkbox
        default-expand-all
        node-key="menuId"
        highlight-current
        :default-checked-keys="value"
        :props="defaultProps"
      />

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onRoleMenuSubmit">确 定</el-button>
        <el-button @click="editmenuVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

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

<script>
import Pagination from '@/components/Pagination'
import Breadcrumb from '@/publicComp/Breadcrumb'
import Qs from 'qs'
export default {
   components: { 
     Pagination,
     Breadcrumb
    },
  data() {
    return {
      currentPage: 1,
      searchParams: {
        roleName: ''
      },
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      list: null,
      dialogVisible: false,
      editdialogVisible: false,
      editmenuVisible: false,
      enterpriseList: null,
      menuOptions: null,
      role: {
        'roleId': '',
        'enterpriseId': '',
        'roleName': '',
        'menuName': '',
        'menuId': ''
      },
      menuIds: '',
      rules: {
        // enterpriseName: [{ required: true, message: '不能为空' }],
        roleName: [{ required: true, message: '不能为空' }, { max: 20, message: '字符长度不超过20位' }]
      },
      allMenu: [],
      defaultProps: {
        children: 'children',
        label: 'menuName',
        Id: 'menuId'
      },
      value: []
    }
  },
  computed:{
    leftFlags(){
      console.log(this.$store.state.leftFlag)
      return this.$store.state.leftFlag
    }
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
        roleName: this.searchParams.roleName || ''
      }
      //this.getRequest('role/index?page=' + vm.listQuery.page + '&size=' + vm.listQuery.limit)
      vm.axios({
        method: 'GET',
        url: '/api/role/index?page=' + vm.listQuery.page + '&size=' + vm.listQuery.limit,
        params: search
      })
      .then(function(res) {
        // 得到一个pageInfo对 console.log(res.data.data)
        vm.total = res.data.data.total
        vm.list = res.data.data.records// 当前页显示的所有数据
      })
    },
    // 获取所有企业
    getEnterPriceList() {
      var vm = this
      //this.getRequest('enterprise/getEnterprise')
      this.axios({
        method: 'GET',
        url: '/api/enterprise/getEnterprise'
      })
      .then(function(res) {
        if (res.data.code === 200) {
          vm.enterpriseList = res.data.data.data
          vm.role.enterpriseId = res.data.data.id
          vm.enterPriceChange(res.data.data.id)
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
      this.getEnterPriceList()
      this.addroleMenu(null)
      // this.$router.push('/addUser/add')
    },
    editMenu(roleId) {
      console.log(roleId)
      this.editmenuVisible = true
      this.roleMenu(roleId)
    },
    editMenu1() {
      // eslint-disable-next-line no-unused-vars
      var vm = this
      this.editmenuVisible = true
      this.roleMenu1(vm.role.roleId)
    },
    // 选择公司动态获取该公司下所有数据
    enterPriceChange(enterpriseId) {
      var vm = this
      vm.role.menuId = ''
      //this.postRequest('role/getMenuByEnterpriseId?enterpriseId=' + enterpriseId)
      this.axios({
        method: 'POST',
        url: '/api/role/getMenuByEnterpriseId?enterpriseId=' + enterpriseId
      })
      .then(function(res) {
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
          var menuIdsString = this.$refs.tree.getCheckedKeys()
          if (menuIdsString.length !== 0) {
            vm.role.menuId = menuIdsString.join(',')
          }
          // const datas=vm.role
          // const newData=Qs.stringify(datas)
          // this.postRequest('role/addItem',newData)
          vm.axios({
            method: 'POST',
            url: '/api/role/addItem',
            transformRequest: [function(data) {
              return Qs.stringify(data)
            }],
            data: vm.role
          })
          .then(function(res) {
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
      // this.$router.push('/editUser/edit/' + userId)
      this.editdialogVisible = true
      this.fatchDataByRoleId(roleId)
      /* this.fatchDataByRoleId2(roleId)*/
    },
    oneditSubmit() {
      this.$refs['role'].validate((valid) => {
        if (valid) {
          var roleId = this.role.roleId
          var vm = this
          var menuIdsString = this.$refs.tree.getCheckedKeys()
          if (menuIdsString.length !== 0) {
            vm.role.menuId = menuIdsString.join(',')
          }
          /* var roleIdsString = vm.role.menuId
          if (roleIdsString.length !== 0) {
            vm.role.menuId = roleIdsString.join(',')
          } */
          const datas= {
              'roleId': vm.role.roleId,
              'enterpriseId': vm.role.enterpriseId,
              'menuId': vm.role.menuId,
              'roleName': vm.role.roleName
            }
            const newDatas=Qs.stringify(datas)
          //this.postRequest('role/updateItem?roleId=' + roleId,newDatas)
          vm.axios({
            method: 'POST',
            url: '/api/role/updateItem?roleId=' + roleId,
            transformRequest: [function(data) {
              return Qs.stringify(data)
            }],
            data: {
              'roleId': vm.role.roleId,
              'enterpriseId': vm.role.enterpriseId,
              'menuId': vm.role.menuId,
              'roleName': vm.role.roleName
            }
          })
          .then(function(res) {
            if (res.data.code === 500) {
              vm.$message.error('修改角色失败')
            } else if (res.data.code === 200) {
              vm.$message.success('修改角色成功')
              vm.editdialogVisible = false
              vm.getList()
            }
          })
        }
      })
    },
    fatchDataByRoleId(roleId) {
      console.log(roleId)
      var vm = this
      //this.getRequest('role/findById?roleId=' + roleId)
      this.axios({
        method: 'GET',
        url: '/api/role/findById?roleId=' + roleId
      })
      .then(function(res) {
        console.log(res.data)
        vm.role = res.data.data
        console.log(res.data.map)
        vm.menuOptions = res.data.map.allMenu
        vm.role.roleId = res.data.data.roleId
        vm.value = []
        vm.allMenu = res.data.map.all
        console.log(res.data.map.Integer)
        vm.value = res.data.map.Integer
      })
    },
    addroleMenu() {
      var vm = this
      this.getRequest('role/findMenu')
      // this.axios({
      //   method: 'GET',
      //   url: 'role/findMenu'
      // })
      .then(function(res) {
        vm.value = []
        vm.allMenu = res.data.map.all
      })
    },
    roleMenu(roleId) {
      console.log(roleId)
      var vm = this
      //this.getRequest('role/findById?roleId=' + roleId)
      this.axios({
        method: 'GET',
        url: '/api/role/findById?roleId=' + roleId
      })
      .then(function(res) {
        vm.role.roleId = res.data.data.roleId
        vm.value = []
        vm.allMenu = res.data.map.all
        console.log(res.data.map.Integer)
        vm.value = res.data.map.Integer
      })
    },
    onRoleMenuSubmit() {
      // eslint-disable-next-line no-unused-vars
      var roleId = this.role.roleId
      var vm = this

      var menuIdsString = this.$refs.tree.getCheckedKeys()
      if (menuIdsString.length !== 0) {
        menuIdsString = menuIdsString.join(',')
      }
      // const datas= {
      //     'roleId': vm.role.roleId,
      //     'menuIds': menuIdsString
      //   }
      //   const newDatas=Qs.stringify(datas)
      // this.postRequest('role/updateRoleMenu',newDatas)
      vm.axios({
        method: 'POST',
        url: '/api/role/updateRoleMenu',
        transformRequest: [function(data) {
          return Qs.stringify(data)
        }],
        data: {
          'roleId': vm.role.roleId,
          'menuIds': menuIdsString
        }
      })
      .then(function(res) {
        console.log(res)
        if (res.data.code === 500) {
          vm.$message.error('修改角色失败')
        } else if (res.data.code === 200) {
          vm.editmenuVisible = false
          vm.$message.success('修改角色成功')
          vm.getList()
        }
      })
    },
    delRole(roleId) {
      this.$confirm('确定删除角色信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var vm = this
        //this.getRequest('role/deleteItem?roleId=' + roleId)
        this.axios({
          method: 'GET',
          url: '/api/role/deleteItem?roleId=' + roleId
        })
        .then(function(res) {
          if (res.data.code === 200) {
            vm.$message({
              message: '删除角色信息成功',
              type: 'success'
            })
            vm.getList()// 刷新列表
          }
          // eslint-disable-next-line handle-callback-err
        }).catch(function(error) {
          vm.$message.error('删除角色信息失败')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 取消事件
    onCancel: function() {
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

