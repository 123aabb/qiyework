<template>
  <div id="app">
    <el-container v-if="$route.meta.keepAlive">
      <!-- <el-header style="text-align: right; font-size: 12px;" >
        <Header></Header>
      </el-header> -->
      <el-container>
        <el-aside width="200px" style="background-color:#304156;height: 100%" >
          <Left></Left>
        </el-aside>
        <el-main style='width:98%;overflow:auto;'>
          <router-view ></router-view>
        </el-main>
      </el-container>
    </el-container>
    <router-view v-else></router-view>
  </div>
</template>

<script>

import Header from './publicComp/Headers'
import Left from './publicComp/LeftNav'
export default {
  name: 'App',
  components: {
    Header,
    Left
  },
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }
  .el-container{
    height: 100%;
  }
  .el-header {
    padding: 0;
    height: auto !important;
  }
  .iAside>>>.el-menu{
    border-right:none !important;
  }
  .iheader {
    width: 100%;
    height: 80px;
    /* border: 1px solid #aaa8a8; */
    text-align: center;
    line-height: 80px;
    font-size: 30px;
    font-weight: bold;
  }

  .el-aside {
    overflow: visible;
  }

  .iAside {
    width: 100%;
    height: 100%;
    border: 1px solid #aaa8a8;
  }

  .el-main {
    overflow: visible;
    padding: 0;
  }

  .imain {
    width: 100%;
    height: auto;
    border: 1px solid #aaa8a8;

  }
  .el-aside{
    width: auto !important;
  }
</style>
