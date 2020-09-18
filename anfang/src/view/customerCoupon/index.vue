<template>
  <div class="app-container">
    <Breadcrumb />
    <div class="search">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="searchParams.projectName"
            placeholder="请输入项目名称"
            style="width: 200px;"
            class="filter-item"
            clearable
            @clear="clearListSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchParams.tel"
            placeholder="请输入客户手机号"
            style="width: 200px;margin-left: 5px"
            class="filter-item"
            clearable
            @clear="clearListSearch1"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchParams.type"
            clearable
            style="width: 200px"
            placeholder="请选择状态"
            @clear="clearListSearch2"
          >
            <el-option label="已领取" value="1" />
            <el-option label="已核销" value="2" />
            <el-option label="已过期" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="search-btn el-button--infoSearch"
            type="primary"
            icon="el-icon-search"
            @click="submitSearch()"
          >搜索</el-button>
          <!-- <el-button class="filter-item" style="margin-left: 5px;" type="primary" @click="addCoupon()">新增优惠券</el-button> -->
        </el-form-item>
      </el-form>
      <!-- <div class="clearFix" /> -->
    </div>
    <div :class="leftFlags?'tabStyles':'tabStyles2'">
      <el-table :data="list" border fit highlight-current-row>
        <el-table-column align="center" label="序号">
          <template slot-scope="scope">{{ scope.$index+1 }}</template>
        </el-table-column>
        <!-- <el-table-column label="用户Id">
        <template slot-scope="scope">
          {{ scope.row.couponId }}
        </template>
        </el-table-column>-->
        <el-table-column label="项目名称" align="center">
          <template slot-scope="scope">{{ scope.row.projectName }}</template>
        </el-table-column>
        <el-table-column label="优惠券标题" align="center">
          <template slot-scope="scope">{{ scope.row.couponName }}</template>
        </el-table-column>
        <el-table-column label="客户手机号" align="center">
          <template slot-scope="scope">{{ scope.row.telphone }}</template>
        </el-table-column>
        <el-table-column label="客户姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.nickName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="领取时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.receiveTime |timeParse }}</span>
          </template>
        </el-table-column>
        <el-table-column label="到期时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.endDate |timeParse }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">已领取</span>
            <span v-if="scope.row.type == 2">已核销</span>
            <span v-if="scope.row.type == 3">已过期</span>
          </template>
        </el-table-column>
        <el-table-column label="核销时间" align="center">
          <template slot-scope="scope">{{ scope.row.writeOffTime |timeParse }}</template>
        </el-table-column>
        <el-table-column label="核销人" align="center">
          <template slot-scope="scope">{{ scope.row.realName }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.type == 1"
              size="mini"
              type="success"
              @click="editCouponType(scope.row.telphone,scope.row.couponId,2,scope.row.customerId,scope.row.id)"
            >核销</el-button>
            <el-button
              v-if="scope.row.type == 2"
              size="mini"
              type="warning"
              @click="editCouponType(scope.row.telphone,scope.row.couponId,1,scope.row.customerId,scope.row.id)"
            >取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import Breadcrumb from '@/publicComp/Breadcrumb'
// 公共类转换事件格式
import { timeParse } from "@/commom/commom";
import Qs from "qs";
// eslint-disable-next-line no-unused-vars
//import { getList } from '../../api/table'
export default {
  components: { 
    Pagination,
    Breadcrumb
   },
  // 公共类转换事件格式
  filters: {
    timeParse,
  },
  data: function () {
    return {
      currentPage: 1,
      searchParams: {
        projectName: "",
        tel: "",
        type: "",
      },
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
      },
      list: null,
    };
  },
  computed: {
    leftFlags() {
      console.log(this.$store.state.leftFlag);
      return this.$store.state.leftFlag;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    // 分页查询
    getList() {
      var vm = this;
      const search = {
        projectName: this.searchParams.projectName || "",
        tel: this.searchParams.tel || "",
        type: this.searchParams.type || "",
      };
      vm.axios({
        method: "POST",
        url:
          "/api/customerCoupon/index?page=" +
          vm.listQuery.page +
          "&size=" +
          vm.listQuery.limit,
        params: search,
      }).then(function (res) {
        // 得到一个pageInfo对象
        vm.total = res.data.data.total;
        vm.list = res.data.data.data; // 当前页显示的所有数据
      });
    },
    editCouponType(tel, couponId, type, customerId, id) {
      // eslint-disable-next-line eqeqeq
      if (type == 2) {
        this.$confirm("确认核销手机号为" + tel + "的优惠券吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            var vm = this;
            this.axios({
              method: "post",
              url: "/api/customerCoupon/updateStatus",
              data: {
                couponId: couponId,
                type: type,
                customerId: customerId,
                id: id,
              },
            }).then(function (res) {
              if (res.data.code === 200) {
                vm.getList();
                vm.$message.success("核销成功");
              } else if (res.data.code === 1001) {
                vm.$message.error("此优惠券已停用，不能进行业务操作");
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      } else {
        this.$confirm("确认取消手机号为" + tel + "的核销信息吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            var vm = this;
            this.axios({
              method: "post",
              url: "/api/customerCoupon/updateStatus",
              data: {
                couponId: couponId,
                type: type,
                customerId: customerId,
                id: id,
              },
            }).then(function (res) {
              if (res.data.code === 200) {
                vm.getList();
                vm.$message.success("取消成功");
              } else if (res.data.code === 1001) {
                vm.$message.error("此优惠券已停用，不能进行业务操作");
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      }
    },
    submitSearch() {
      this.listQuery.page = 1;
      this.getList();
      this.currentPage = 1;
    },
    // 格式化表单数据
    clearForm() {
      this.searchParams.projectName = "";
    },
    clearForm1() {
      this.searchParams.tel = "";
    },
    clearForm2() {
      this.searchParams.type = "";
    },
    // 清除列表的搜索表单
    clearListSearch() {
      this.clearForm();
      this.getList();
    },
    clearListSearch1() {
      this.clearForm1();
      this.getList();
    },
    clearListSearch2() {
      this.clearForm2();
      this.getList();
    },
  },
};
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
.el-select {
  width: 360px;
}
.el-input {
  width: 360px;
}
</style>
