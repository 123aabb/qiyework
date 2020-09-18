<template>
  <div class="iheader">
    <span>营销云管理系统</span>
    <div class="nextPress">
      <el-dropdown>
      <span class="el-dropdown-link">
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>首页</el-dropdown-item>
        <el-dropdown-item>修改密码</el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Headers",
        methods:{
          logout() {
            console.log(99999)
          this.$confirm('此操作将退出系统, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log(1111)
            // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            var storage=window.localStorage;
              storage.clear();
            this.$router.push(`/login`)
              
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消退出登入'
            })
          })
        },
        }
    }
</script>

<style scoped>
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
.iheader{
  position: relative;
  background-color: #2e81e8;
  color: #ffffff;
}
  .nextPress{
    position: absolute;
    top: 20px;
    right: 40px;
  }
</style>
