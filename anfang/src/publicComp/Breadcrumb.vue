<template>
  <div class="brName">
    <div @click="flagChage" class="djtyle el-icon-s-fold"></div>
    <div style="margin-left:15px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(items,index) in breadcrumbName" :key="index">{{items}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="nextPress">
        <div class="avatar-wrapper">
          <img src="https://up.enterdesk.com/edpic/2e/a2/82/2ea282c186df8a15b254409f04e53fc0.jpg" class="user-avatar">
        </div>
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
  name: "Breadcrumb",
  data() {
    return {};
  },
  computed: {
    breadcrumbName() {
      return this.$store.state.nameArr;
    },
  },
  methods: {
    flagChage() {
      this.$store.dispatch("getLeftFlag", 1);
    },
    logout() {
      console.log(99999);
      this.$confirm("此操作将退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(1111);
          // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          var storage = window.localStorage;
          storage.clear();
          this.$router.push(`/login`);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出登入",
          });
        });
    },
  },
};
</script>

<style scoped>
.brName {
  width: 95%;
  margin: 15px auto;
  display: flex;
  flex-direction: row;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.iheader {
  position: relative;
  background-color: #2e81e8;
  color: #ffffff;
}
.nextPress {
  position: absolute;
  top: 20px;
  right: 40px;
}
.avatar-wrapper{
    width: 50px;
    height: 50px;
    position: absolute;
    right: 25px;
    top: 0;
}
.avatar-wrapper>img{
    width: 100%;
    height: 100%;
}
.el-icon-caret-bottom {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
  }
</style>