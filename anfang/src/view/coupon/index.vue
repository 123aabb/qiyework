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
            v-model="searchParams.couponName"
            placeholder="请输入优惠券标题"
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
            <el-option label="启用" value="1" />
            <el-option label="停用" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="search-btn el-button--infoSearch"
            type="primary"
            icon="el-icon-search"
            @click="submitSearch()"
          >搜索</el-button>
          <el-button
            class="filter-item"
            style="margin-left: 5px;"
            type="primary"
            @click="addCoupon()"
          >新增优惠券</el-button>
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
        <el-table-column label="省份" align="center">
          <template slot-scope="scope">{{ scope.row.pro }}</template>
        </el-table-column>
        <el-table-column label="优惠卷标题" align="center">
          <template slot-scope="scope">{{ scope.row.couponName }}</template>
        </el-table-column>
        <el-table-column label="优惠开始时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.startDate |timeParse }}</span>
          </template>
        </el-table-column>
        <el-table-column label="优惠结束时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.endDate |timeParse }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">启用</span>
            <span v-if="scope.row.type == 2">停用</span>
          </template>
        </el-table-column>
        <el-table-column label="领取人数" align="center">
          <template slot-scope="scope">{{ scope.row.count ==null ?0:scope.row.count }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="360"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editCoupon(scope.row.couponId)"
            >编辑</el-button>

            <el-button
              v-if="scope.row.type !== 1"
              size="mini"
              type="success"
              @click="editCouponType(scope.row.couponId,1,'published')"
            >启用</el-button>
            <el-button
              v-if="scope.row.type !== 2"
              size="mini"
              type="warning"
              @click="editCouponType(scope.row.couponId,2,'draft')"
            >停用</el-button>
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

    <!-- 添加弹出框 -->
    <el-dialog title="新增优惠券" :visible.sync="dialogVisible" width="50%">
      <el-form ref="coupon" :model="coupon" :rules="rules" label-width="120px">
        <el-form-item label="项目名称" prop="projectId">
          <el-select v-model="coupon.projectId" clearable placeholder="请选择项目">
            <el-option
              v-for="item in projectList"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="标题" prop="couponName">
          <el-input v-model="coupon.couponName" placeholder="请输入优惠标题" />
        </el-form-item>

        <el-form-item label="优惠说明" prop="couponInfo">
          <el-input
            v-model="coupon.couponInfo"
            type="textarea"
            style="width: 360px;"
            placeholder="请输入优惠说明"
          />
        </el-form-item>

        <el-form-item label="优惠区间" prop="endDate">
          <!--<div class="block">
            <el-date-picker  format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"  v-model="coupon.startDate" type="date" placeholder="选择日期">
            </el-date-picker>
          </div>-->
          <!-- <el-date-picker v-model="coupon.startDate" type="date" placeholder="选择日期" :picker-options="pickerBeginDateBefore" @change="changeTime" /> -->

          <!-- </el-form-item> -->
          <!-- <el-form-item label="优惠结束时间" prop="endDate"> -->
          <!--<div class="block">
            <el-date-picker  format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"  v-model="coupon.startDate" type="date" placeholder="选择日期">
            </el-date-picker>
          </div>-->
          <!-- <el-date-picker v-model="coupon.endDate" type="date" placeholder="选择日期" :picker-options="pickerBeginDateAfter" /> -->
          <el-date-picker
            v-model="coupon.startDate"
            type="date"
            placeholder="开始时间"
            value-format="yyyy-MM-dd"
            class="wida"
            :picker-options="pickerBeginDateBefore"
            clearable
            @change="changeTime"
          />
          <span class="zhi">至</span>
          <el-date-picker
            v-model="coupon.endDate"
            type="date"
            placeholder="结束时间"
            value-format="yyyy-MM-dd"
            class="wida"
            :picker-options="pickerBeginDateAfter"
            clearable
          />
        </el-form-item>

        <el-form-item label="人数限制" prop="status">
          <el-select v-model="coupon.status" clearable>
            <el-option label="无限" value="2" onselect="true" />
            <el-option label="有限" value="1" />
          </el-select>
          <el-input
            v-if="coupon.status == 1"
            type="number"
            v-model="coupon.peopleNumber"
            style="width:120px;margin-left:10px;"
            placeholder="请输入人数"
            prop="peopleNumber"
            :min="1"
            label="描述文字"
          />
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-select v-model="coupon.type" clearable>
            <el-option label="启用" value="1" onselect="true" />
            <el-option label="停用" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onaddSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹出框 -->
    <el-dialog title="修改优惠券" :visible.sync="editdialogVisible" width="50%">
      <el-form ref="coupon" :model="coupon" :rules="rules" label-width="120px">
        <el-form-item label="项目名称" prop="projectId">
          <el-select v-model="coupon.projectId" clearable placeholder="请选择项目">
            <el-option
              v-for="item in projectList"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="标题" prop="couponName">
          <el-input v-model="coupon.couponName" placeholder="请输入优惠标题" />
        </el-form-item>

        <el-form-item label="优惠说明" prop="couponInfo">
          <el-input
            v-model="coupon.couponInfo"
            type="textarea"
            style="width: 360px;"
            placeholder="请输入优惠说明"
          />
        </el-form-item>

        <!-- <el-form-item label="优惠开始时间" prop="date">
          &lt;!&ndash;<div class="block">
            <el-date-picker  format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"  v-model="coupon.startDate" type="date" placeholder="选择日期">
            </el-date-picker>
          </div>&ndash;&gt;

          <el-date-picker
            v-model="coupon.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />

        </el-form-item>
        <el-form-item label="优惠结束时间" prop="endDate">
          &lt;!&ndash;<div class="block">
            <el-date-picker  format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"  v-model="coupon.startDate" type="date" placeholder="选择日期">
            </el-date-picker>
          </div>&ndash;&gt;

          <el-date-picker
            v-model="coupon.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />

        </el-form-item>-->

        <el-form-item label="优惠区间" prop="endDate">
          <!--<div class="block">
            <el-date-picker  format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"  v-model="coupon.startDate" type="date" placeholder="选择日期">
            </el-date-picker>
          </div>-->
          <!-- <el-date-picker v-model="coupon.startDate" type="date" placeholder="选择日期" :picker-options="pickerBeginDateBefore" @change="changeTime" /> -->

          <!-- </el-form-item> -->
          <!-- <el-form-item label="优惠结束时间" prop="endDate"> -->
          <!--<div class="block">
            <el-date-picker  format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"  v-model="coupon.startDate" type="date" placeholder="选择日期">
            </el-date-picker>
          </div>-->
          <!-- <el-date-picker v-model="coupon.endDate" type="date" placeholder="选择日期" :picker-options="pickerBeginDateAfter" /> -->
          <el-date-picker
            v-model="coupon.startDate"
            type="date"
            placeholder="开始时间"
            value-format="yyyy-MM-dd"
            class="wida"
            :picker-options="pickerBeginDateBefore"
            clearable
            @change="changeTime"
          />
          <span class="zhi">至</span>
          <el-date-picker
            v-model="coupon.endDate"
            type="date"
            placeholder="结束时间"
            value-format="yyyy-MM-dd"
            class="wida"
            :picker-options="pickerBeginDateAfter"
            clearable
          />
        </el-form-item>

        <el-form-item label="人数限制" prop="status">
          <el-select v-model="coupon.status" class="filter-item" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-if="coupon.status == 1"
            type="number"
            v-model="coupon.peopleNumber"
            placeholder="请输入人数"
          />
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-select v-model="coupon.type" class="filter-item" clearable>
            <el-option
              v-for="item in typeOptions"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="oneditSubmit">确 定</el-button>
        <el-button @click="editdialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import Breadcrumb from '@/publicComp/Breadcrumb'
// 公共类转换事件格式
import { timeParse } from "@/commom/commom";
import Qs from "qs";
// import { getList } from '../../api/table'
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
    // 验证人数
    const checkContactWay = (rule, value, callback) => {
      var vm = this;
      setTimeout(() => {
        if (
          value == 1 &&
          (vm.coupon.peopleNumber == "" || vm.coupon.peopleNumber == null)
        ) {
          callback(new Error("请输入领取人数"));
        } else {
          callback();
        }
      }, 200);
    };
    const data = (rule, value, callback) => {
      var vm = this;

      if (vm.coupon.startDate != "" && vm.coupon.endDate != "") {
        var startDate = new Date(vm.coupon.startDate);
        var endDate = new Date(vm.coupon.endDate);
        if (startDate > endDate) {
          callback(new Error("结束时间不能早于开始时间"));
        } else {
          callback();
        }
      }
    };
    return {
      currentPage: 1,
      searchParams: {
        projectName: "",
        couponName: "",
        type: "",
      },
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
      },
      list: null,
      dialogVisible: false,
      editdialogVisible: false,
      projectList: null,
      statusOptions: [
        { value: 1, key: 1, label: "有限", selected: true },
        { value: 2, key: 2, label: "无限" },
      ],
      typeOptions: [
        { value: 1, key: 1, label: "启用", selected: true },
        { value: 2, key: 2, label: "停用" },
      ],
      coupon: {
        couponId: "",
        projectId: "",
        couponName: "",
        couponInfo: "",
        startDate: "",
        endDate: "",
        status: "",
        status1: "1",
        type: "",
        peopleNumber: "",
      },
      rules: {
        // projectId: [{ required: true, message: '不能为空' }, { validator: checkContactWay, trigger: 'change' }],
        projectId: [{ required: true, message: "不能为空" }],
        couponName: [
          { required: true, message: "不能为空" },
          { max: 15, message: "长度不超过15个字符" },
        ],
        couponInfo: [
          { required: true, message: "不能为空" },
          { max: 100, message: "最大100个字符" },
        ],
        startDate: [
          { required: true, message: "不能为空" },
          { validator: data, trigger: "change" },
        ],
        endDate: [
          { required: true, message: "不能为空" },
          { validator: data, trigger: "change" },
        ],
        status: [
          { required: true, message: "不能为空 " },
          { validator: checkContactWay, trigger: "change" },
        ],
        peopleNumber: [{ required: true, message: "不能为空" }],
        type: [{ required: true, message: "不能为空" }],
      },
      pickerBeginDateBefore() {
        (time) => {
          const beginDateVal = this.coupon.startDate;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          }
        };
      },
      // 结束时间
      pickerBeginDateAfter() {
        (time) => {
          const beginDateVal = this.coupon.endDate;
          if (beginDateVal) {
            return time.getTime() < beginDateVal;
          }
        };
      },
    };
  },
  computed: {
    leftFlags() {
      console.log(this.$store.state.leftFlag);
      return this.$store.state.leftFlag;
    },
  },
  // 将后台获取到的两个日期转为time的方法修改为
  created() {
    this.getList();
    this.getEnterPriceList();
  },
  methods: {
    // 分页查询
    getList() {
      var vm = this;
      const search = {
        projectName: this.searchParams.projectName || "",
        couponName: this.searchParams.couponName || "",
        type: this.searchParams.type || "",
      };
      vm.axios({
        method: "POST",
        url:
          "/api/coupon/index?page=" +
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
    timedate(val) {
      console.log(val);
      if (val == null || val === "") {
        return "暂无时间";
      } else {
        var d = new Date(val); // val 为表格内取到的后台时间
        var month =
          d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
        var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
        var times = d.getFullYear() + "-" + month + "-" + day;
        return times;
      }
    },

    // 选择开始时间，清空结束时间
    changeTime(date) {
      // this.seach.before="";
      // console.log(this.seach.before)
      console.log(this.coupon.startDate);
      if (this.coupon.startDate === null) {
        this.coupon.endDate = null;
      }
      this.pickerBeginDateAfter = {
        disabledDate(time) {
          // 开始时间-结束时间
          return time.getTime() < new Date(date).getTime();
        },
      };
    },
    // 获取企业下项目
    getEnterPriceList() {
      var vm = this;
      this.axios({
        method: "GET",
        url: "/api/project/getProjectByEnterpriseId",
      }).then(function (res) {
        if (res.data.code === 200) {
          vm.projectList = res.data.data;
        }
      });
    },
    editCouponType(couponId, type) {
      var vm = this;
      this.axios({
        method: "GET",
        url: "/api/coupon/updateType?couponId=" + couponId + "&type=" + type,
      }).then(function (res) {
        if (res.data.code === 200) {
          vm.getList();
          vm.$message.success("修改成功");
        } else if (res.data.code === 10001) {
          vm.$message.error("同一项目只能存在一个启用的优惠券");
        } else if (res.data.code === 500) {
          vm.$message.error("修改失败");
        }
      });
    },
    getById: function (couponId) {
      var vm = this;
      this.axios({
        method: "GET",
        url: "/api/coupon/getById?couponId=" + couponId,
      }).then(function (res) {
        if (res.data.code === 200) {
          res.data.data.startDate =
            vm.timedate(res.data.data.startDate) + " 00:00:00";
          res.data.data.endDate =
            vm.timedate(res.data.data.endDate) + " 23:59:59";
          vm.coupon = res.data.data;
          /* vm.coupon.date = [new Date(res.data.data.startDate), new Date(res.data.data.endDate)]*/
          console.log(3, vm.coupon);
        }
      });
    },

    // 重置
    resetTemp() {
      this.coupon = {
        couponId: "",
        projectId: "",
        couponName: "",
        couponInfo: "",
        startDate: "",
        endDate: "",
        status: "",
        status1: "1",
        type: "",
        peopleNumber: "",
      };
    },
    submitSearch() {
      this.listQuery.page = 1;
      this.getList();
      this.currentPage = 1;
    },
    // 添加
    addCoupon() {
      this.dialogVisible = true;
      this.resetTemp();
      this.getEnterPriceList();
    },

    // 添加用户确定按钮
    onaddSubmit() {
      this.$refs.coupon.validate((valid) => {
        if (valid) {
          var vm = this;
          console.log(vm.coupon);
          vm.coupon.startDate = vm.timedate(vm.coupon.startDate) + " 00:00:00";
          vm.coupon.endDate = vm.timedate(vm.coupon.endDate) + " 23:59:59";
          if (vm.coupon.endDate < vm.coupon.startDate) {
            vm.$message.error("结束日期不能早于开始日期");
            return;
          } else {
            vm.axios({
              method: "POST",
              url: "/api/coupon/addItem",
              transformRequest: [
                function (data) {
                  return Qs.stringify(data);
                },
              ],
              data: vm.coupon,
            }).then(function (res) {
              if (res.data.code === 500) {
                vm.$message.error("添加失败");
              } else if (res.data.code === 200) {
                vm.$message.success("添加成功");
                vm.dialogVisible = false;
                vm.getList();
              } else if (res.data.code === 10001) {
                vm.$message.error("同一项目只能存在一个启用的优惠券");
              }
            });
          }
          console.log(vm.coupon);
        }
      });
    },
    // 修改
    editCoupon(couponId) {
      this.editdialogVisible = true;
      this.getEnterPriceList();
      this.getById(couponId);
    },
    oneditSubmit() {
      this.$refs.coupon.validate((valid) => {
        if (valid) {
          var vm = this;
          vm.coupon.startDate = vm.timedate(vm.coupon.startDate) + " 00:00:00";
          vm.coupon.endDate = vm.timedate(vm.coupon.endDate) + " 23:59:59";
          console.log(vm.coupon);
          vm.axios({
            method: "POST",
            url: "/api/coupon/editItem",
            transformRequest: [
              function (data) {
                return Qs.stringify(data);
              },
            ],
            data: vm.coupon,
          }).then(function (res) {
            if (res.data.code === 500) {
              vm.$message.error("修改失败");
            } else if (res.data.code === 200) {
              vm.editdialogVisible = false;
              vm.getList();
            } else if (res.data.code === 10001) {
              vm.$message.error(
                "已有人领取无法编辑，可停用后再创建一个新的优惠券"
              );
            } else if (res.data.code === 10002) {
              vm.$message.error("同同一项目只能存在一个启用的优惠券");
            }
          });
        }
      });
    },
    // 取消事件
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },
    // 格式化表单数据
    clearForm() {
      this.searchParams.projectName = "";
    },
    clearForm1() {
      this.searchParams.couponName = "";
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

<style>
.tabStyles {
  width: calc(100% - 65px);
  margin: 20px auto;
}
.tabStyles2 {
  width: calc(100% - 200px);
  margin: 20px auto;
}
.el-dialog__body .el-form-item .el-select .el-input__inner {
  width: 360px;
}
.el-dialog__body .el-input {
  width: 360px;
}
.el-form-item__content .el-input--suffix .el-input__inner {
  width: 200px;
}
.el-form-item__content .el-date-editor {
  width: 170px;
}
.el-form-item__content .el-date-editor .el-input__inner {
  width: 170px;
}
.el-textarea__inner {
  min-height: 100px !important;
}
</style>
