<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar1 {
  width: 178px;
  height: 178px;
  display: block;
}
.tabStyles{
  width: calc(100% - 65px);;
  margin: 20px auto;
}
.tabStyles2{
  width:calc(100% - 200px);
  margin: 20px auto;
}
</style>
<template>
  <div class="app-container">
    <Breadcrumb />
    <div class="search">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="searchParams.telphone"
            placeholder="请输入登录手机号"
            style="width: 200px;margin-left: 5px"
            class="filter-item"
            clearable
            @clear="clearListSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchParams.realName"
            placeholder="请输入真实姓名"
            style="width: 200px;margin-left: 5px"
            class="filter-item"
            clearable
            @clear="clearListSearch1"
          />
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
            @click="addUser()"
          >新增用户</el-button>
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
          {{ scope.row.userId }}
        </template>
        </el-table-column>-->
        <el-table-column label="登录手机号" align="center">
          <template slot-scope="scope">{{ scope.row.telphone }}</template>
        </el-table-column>
        <el-table-column label="真实姓名" align="center">
          <template slot-scope="scope">{{ scope.row.realName }}</template>
        </el-table-column>
        <el-table-column label="角色名称" align="center">
          <template slot-scope="scope">{{ scope.row.roleName }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime |timeParse }}</span>
          </template>
        </el-table-column>
        <el-table-column label="太阳码" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.sunCode" style="width:50rpx;height:50px" alt="" @click="bigImg(scope.row.qrCode)">
        </template>
      </el-table-column>
        <el-table-column label="用户状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1">启用</span>
            <span v-if="scope.row.state == 2">停用</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="500"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(scope.row.userId)"
            >编辑</el-button>
            <el-button size="mini" type @click="userPassWord(scope.row.userId)">重置密码</el-button>
            <el-button
              v-if="scope.row.state !== 1"
              size="mini"
              type="success"
              @click="editUserState(scope.row.userId,1,'published')"
            >启用</el-button>
            <el-button
              v-if="scope.row.state !== 2"
              size="mini"
              type="warning"
              @click="editUserState(scope.row.userId,2,'draft')"
            >停用</el-button>
            <el-button size="mini" type @click="ewmclick(scope.row.userId)">微信二维码</el-button>

            <el-button size="mini" type @click="information(scope.row.userId)">完善信息</el-button>
            <el-button size="mini" type="warning" @click="sunCode(scope.row)" v-if="!scope.row.sunCode">
            生成太阳码
          </el-button>
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

    <el-dialog title="微信二维码" :visible.sync="ewmVisible" width="20%">
      <!--<div style="width:100%;text-align:center;">
        <img src="./01.png" style="text-align:center;">
      </div>-->
      <!--action="uploadImg"-->
      <el-upload
        class="avatar-uploader"
        action="/api/uploadImg"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :data="insertProgram"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar1" />
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="ewmVisible = false">确 定</el-button> -->
        <el-button @click="ewmVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 添加弹出框 -->
    <el-dialog title="新增用户" :visible.sync="dialogVisible" width="50%">
      <el-form ref="user" :model="user" :rules="addrules" label-width="120px">
        <el-form-item label="登录手机号" prop="telphone">
          <el-input v-model="user.telphone" maxlength="11" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="user.realName" />
        </el-form-item>
        <!-- <el-form-item label="微信号" prop="wxCode">
          <el-input v-model="user.wxCode"/>
        </el-form-item>-->
        <el-form-item label="企业名称" prop="enterpriseId">
          <el-select
            v-model="user.enterpriseId"
            clearable
            placeholder="请选择公司"
            :disabled="true"
            @change="enterPriceChange($event)"
          >
            <el-option
              v-for="item in enterpriseList"
              :key="item.enterpriseId"
              :label="item.enterpriseName"
              :value="item.enterpriseId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleIds">
          <el-select v-model="user.roleIds" multiple placeholder="请选择角色" prop="roleIds">
            <el-option
              v-for="item in roleIdsOptions"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="state">
          <el-select v-model="user.state" class="filter-item" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="默认密码" prop="password">
          <el-input v-model="user.password" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onaddSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="editdialogVisible" width="50%">
      <el-form ref="user" :model="user" :rules="editrules" label-width="120px">
        <el-form-item label="登录手机号" prop="telphone">
          <el-input v-model="user.telphone" maxlength="11" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="user.realName" />
        </el-form-item>
        <!-- <el-form-item label="微信号" prop="wxCode">
          <el-input v-model="user.wxCode"/>
        </el-form-item>-->
        <el-form-item label="企业名称" prop="enterpriseId">
          <el-select
            v-model="user.enterpriseId"
            clearable
            placeholder="请选择公司"
            :disabled="true"
            @change="enterPriceChange($event)"
          >
            <el-option
              v-for="item in enterpriseList"
              :key="item.enterpriseId"
              :label="item.enterpriseName"
              :value="item.enterpriseId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleIds">
          <el-select v-model="user.roleIds" multiple placeholder="请选择角色" prop="roleIds">
            <el-option
              v-for="item in roleIdsOptions"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="state">
          <el-select v-model="user.state" class="filter-item" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="默认密码" prop="password">
          <el-input v-model="user.password" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="oneditSubmit">确 定</el-button>
        <el-button @click="editdialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 多文件上传 -->
    <el-dialog
      title="完善信息"
      :before-close="beforeClose"
      :visible.sync="infodialogVisible"
      width="50%"
    >
      <el-form ref="user" :model="user" label-width="120px">
        <el-form-item label="默认密码" prop="password">
          <el-upload
            action="#"
            list-type="picture-card"
            :on-remove="handleRemove"
            :http-request="uploadAvatar"
            :on-change="maxUploadNum"
            :class="{hide:hideUpload}"
            :before-upload="beforeAvatarUpload"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :limit="9"
            multiple
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="fileSubmit">确 定</el-button>

        <el-button @click="infodialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 弹出<img src="" alt=""> -->
    <el-dialog  :visible.sync="dialogFormVisible">
      <div class='bigImg'>
        <img :src="bigSrc" alt="">
      </div>  
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {Message} from 'element-ui'
// 公共类转换事件格式
import { timeParse } from "@/commom/commom";
import Qs from "qs";
import Breadcrumb from '@/publicComp/Breadcrumb'
export default {
  components: { 
    Pagination,
    Breadcrumb 
  },
  // 公共类转换事件格式
  filters: {
    timeParse,
  },
  data() {
    // 验证手机号
    const checkContactWay = (rule, value, callback) => {
      const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      setTimeout(() => {
        if (value && !myreg.test(value)) {
          callback(new Error("请输入有效的手机号码"));
        } else {
          callback();
        }
      }, 200);
    };
    return {
      bigSrc:'',//需要放大的图片
        dialogFormVisible:false,
      currentPage: 1,
      searchParams: {
        enterpriseName: "",
        telphone: "",
        realName: "",
      },
      imageUrl: "",
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
      },
      list: null,
      dialogVisible: false,
      editdialogVisible: false,

      dialogImageUrl: "",
      dialogVisibleUpdate: false,
      infodialogVisible: false,
      hideUpload: false,
      fileList: [],
      picList: [],

      ewmVisible: false,
      enterpriseList: null,
      roleIdsOptions: null,
      statusOptions: [
        { value: 1, key: 1, label: "启用", selected: true },
        { value: 2, key: 2, label: "停用" },
      ],
      user: {
        userId: "",
        password: "",
        enterpriseId: "",
        state: 1,
        roleIds: "",
        telphone: "",
        wxCode: "",
        realName: "",
      },
      addrules: {
        telphone: [
          { required: true, message: "不能为空" },
          { validator: checkContactWay, trigger: "blur" },
        ],
        realName: [
          { required: true, message: "不能为空" },
          { max: 20, message: "字符长度不能超过20位" },
        ],
        enterpriseId: [{ required: true, message: "不能为空" }],
        roleIds: [{ required: true, message: "不能为空" }],
        wxCode: [{ required: true, message: "不能为空" }],
        state: [{ required: true, message: "不能为空" }],
        password: [
          { required: true, message: "不能为空" },
          { min: 6, max: 6, message: "密码长度为6位", trigger: "blur" },
        ],
      },
      editrules: {
        telphone: [
          { required: true, message: "不能为空" },
          { validator: checkContactWay, trigger: "blur" },
        ],
        realName: [
          { required: true, message: "不能为空" },
          { max: 20, message: "字符长度不能超过20位" },
        ],
        enterpriseId: [{ required: true, message: "不能为空" }],
        roleIds: [{ required: true, message: "不能为空" }],
        wxCode: [{ required: true, message: "不能为空" }],
        state: [{ required: true, message: "不能为空" }],
        password: [
          { required: true, message: "不能为空" },
          { min: 6, max: 6, message: "密码长度为6位", trigger: "blur" },
        ],
      },
      insertProgram: {
        userId: "",
      },
    };
  },
  computed:{
    leftFlags(){
      return this.$store.state.leftFlag
    }
  },
  created() {
    this.getList();
    // this.getEnterPriceList()
  },
  methods: {
    //放大图片
      bigImg(e){
        this.bigSrc=e
        this.dialogFormVisible =true
      },
    //生成太阳码
    sunCode(e){
      console.log(e)
      if(!e.openId){
        Message.success({message: '请先使用小程序登陆'});
        return
      }
      this.axios({
        method: 'GET',
        url: '/api/user/getWxaCodeUnlimit',
        params: {
          type:'3',
          enterpriseId:e.enterpriseId,
          userId:e.userId
        }
      })
      .then(res=>{
        console.log(res)
        if(res.data.code==200){
           Message.success({message: '生成成功'});
          this.$router.go(0)
        }       
      })
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    preview(file) {},
    successOn(response, file, fileList) {},
    progress(event, file, fileList) {},
    change(file, fileList) {},
    beforeClose() {
      this.picList = [];
      this.fileList = [];
      this.infodialogVisible = false;
    },

    // 多图
    handleRemove(file, fileList) {
      console.log(file, this.picList);
      for (const i in this.picList) {
        console.log(333, this.picList[i].name === file.uid);
        if (
          this.picList[i].name === file.uid ||
          this.picList[i].url === file.url
        ) {
          this.picList.splice(i, 1);
        }
      }
      if (this.fileList.length >= 9) {
        this.hideUpload = true;
      } else {
        this.hideUpload = false;
      }
    },
    uploadAvatar(item) {
      var vm = this;
      const formData = new FormData();
      formData.append("file", item.file);
      const uid = item.file.uid;
      //this.postRequest('/uploadFile',formData)
      vm.axios({
        method: "post",
        url: "/api/uploadFile",
        data: formData,
      })
        .then(function (res) {
          vm.emptyUpload();
          console.log(res);
          vm.picList.push({ name: uid, url: res.data.data[0] });

          /* console.log(vm.fileList)
          console.log(vm.picList)*/
        })
        .catch(() => {
          vm.$message.error("上传失败，请重新上传");
          vm.emptyUpload();
        });
    },
    emptyUpload() {
      const mainImg = this.$refs.upload;
      if (mainImg) {
        if (mainImg.length) {
          mainImg.forEach((item) => {
            item.clearFiles();
          });
        } else {
          this.$refs.upload.clearFiles();
        }
      }
    },
    maxUploadNum(file, fileList) {
      if (fileList.length >= 9) {
        this.hideUpload = true;
      } else {
        this.hideUpload = false;
      }
    },

    handleExceed() {
      this.$message.warning(`最多上传9个图片`);
    },
    information(userId) {
      var vm = this;

      this.infodialogVisible = true;
      vm.getUserInfo(userId);

      vm.insertProgram.userId = userId;
    },
    getUserInfo(userId) {
      var vm = this;
      //this.getRequest('user/findById?userId=' + userId)
      this.axios({
        method: "GET",
        url: "/api/user/findById?userId=" + userId,
      }).then(function (res) {
        console.info(res);
        var bannerImageString = res.data.data.cardImg;

        if (bannerImageString !== null) {
          bannerImageString.split(",").forEach(function (item) {
            vm.fileList.push({ name: "name", url: item });
            // this.picList.push({ url: res.data[0], uid: this.formData.img.length})
          });
          vm.picList = vm.fileList;
        }
        /* if (vm.fileList.length >= 9) {
            vm.hideUpload = true
          } else {
            vm.hideUpload = false
          }*/
      });
    },
    fileSubmit() {
      var vm = this;
      var imageList = "";
      if (vm.picList.length !== 0) {
        vm.picList.forEach(function (item) {
          imageList += item.url + ",";
        });
        imageList = imageList.substr(0, imageList.length - 1);
      }
      console.log(vm.fileList);
      // const datas={
      //     'cardImg': imageList,
      //     'userId': vm.insertProgram.userId
      //   }
      // const newDatas=Qs.stringify(datas)
      // this.postRequest('user/updateItem',newDatas)
      vm.axios({
        method: "POST",
        url: "/api/user/updateItem",
        transformRequest: [
          function (data) {
            return Qs.stringify(data);
          },
        ],
        data: {
          cardImg: imageList,
          userId: vm.insertProgram.userId,
        },
      }).then(function (res) {
        if (res.data.code === 500) {
          vm.$message.error("修改用户失败");
        } else if (res.data.code === 200) {
          vm.$message.success("修改用户成功");
          vm.editdialogVisible = false;
          vm.getList();
        }
      });
    },
    successHandler(res, file, fileList) {
      // 文件上传成功时的钩子
      console.log(res, file, fileList);
    },

    // 二维码上传
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(URL.createObjectURL(file.raw));

      this.$message.success("上传成功");
    },
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension =
        testmsg === "jpg" ||
        testmsg === "JPG" ||
        testmsg === "png" ||
        testmsg === "PNG";
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isLt3M) {
        this.$message.error("上传图片大小不能超过 3MB!");
      }
      if (!extension) {
        this.$message.error("上传图片只能是jpg / png格式!");
      }
      return isLt3M && extension;
    },
    ImgByUserId(userId) {
      console.log(userId);
      var vm = this;
      //this.getRequest('user/findById?userId=' + userId)
      this.axios({
        method: "GET",
        url: "/api/user/findById?userId=" + userId,
      }).then(function (res) {
        console.log(res);
        vm.imageUrl = res.data.data.qrCode;
      });
    },
    // 分页查询
    getList() {
      var vm = this;
      const search = {
        page: vm.listQuery.page,
        size: vm.listQuery.limit,
        enterpriseName: this.searchParams.enterpriseName || "",
        telphone: this.searchParams.telphone,
        realName: this.searchParams.realName || "",
      };
      // this.postRequest('user/index?page=' + vm.listQuery.page + '&size=' + vm.listQuery.limit,search)
      vm.axios({
        method: "GET",
        url:
          "/api/user/index?page=" +
          vm.listQuery.page +
          "&size=" +
          vm.listQuery.limit,
        params: search,
      }).then(function (res) {
        console.log(res);
        // 得到一个pageInfo对象
        vm.total = res.data.data.total;
        vm.list = res.data.data.data; // 当前页显示的所有数据
      });
    },

    fatchDataByUserId(userId) {
      var vm = this;
      //this.getRequest('user/findById?userId=' + userId)
      this.axios({
        method: "GET",
        url: "/api/user/findById?userId=" + userId,
      }).then(function (res) {
        vm.user = res.data.data;
        vm.user.roleList = res.data.data.roleList;
        var roleIdArr = [];
        var roleNameArr = [];
        vm.user.roleList.forEach(function (item) {
          roleIdArr.push(item.roleId);
          roleNameArr.push(item.roleName);
        });
        vm.user.roleIds = roleIdArr;
      });
    },
    // 重置
    resetTemp() {
      this.user = {
        userId: "",
        password: "",
        enterpriseId: "",
        state: 1,
        roleIds: "",
        telphone: "",
        wxCode: "",
        realName: "",
      };
    },
    ewmclick(userId) {
      this.ewmVisible = true;
      var vm = this;
      vm.imageUrl = "";
      this.ImgByUserId(userId);
      vm.insertProgram.userId = userId;
    },
    // 添加用户
    addUser() {
      this.dialogVisible = true;
      this.resetTemp();
      this.getEnterPriceList("add");
      // this.$router.push('/addUser/add')
    },
    // 选择公司动态获取该公司下所有角色
    enterPriceChange(enterpriseId) {
      var vm = this;
      vm.user.roleIds = "";
      //this.postRequest('user/getInfoByEnterpriseId?enterpriseId=' + enterpriseId)
      this.axios({
        method: "POST",
        url: "/api/user/getInfoByEnterpriseId?enterpriseId=" + enterpriseId,
      }).then(function (res) {
        if (res.data.code === 200) {
          // 角色数组
          vm.roleIdsOptions = res.data.map.roleList;
          // 企业默认密码
          vm.user.password = res.data.map.password;
        }
      });
    },
    // 获取所有企业
    getEnterPriceList(status) {
      var vm = this;
      //this.getRequest('enterprise/getEnterprise')
      this.axios({
        method: "GET",
        url: "/api/enterprise/getEnterprise",
      }).then(function (res) {
        if (res.data.code === 200) {
          console.log(res);
          vm.enterpriseList = res.data.data.data;
          vm.user.enterpriseId = res.data.data.id;
          if (status === "add") {
            vm.enterPriceChange(res.data.data.id);
          }
        }
      });
    },
    // 添加用户确定按钮
    onaddSubmit() {
      this.$refs["user"].validate((valid) => {
        if (valid) {
          var vm = this;
          // 数组转换为字符串
          var roleIdsString = vm.user.roleIds;
          if (roleIdsString.length !== 0) {
            vm.user.roleIds = roleIdsString.join(",");
          }
          // const datas=vm.user
          // const newDatas=Qs.stringify(datas)
          //this.postRequest('user/addItem',newDatas)
          vm.axios({
            method: "POST",
            url: "/api/user/addItem",
            transformRequest: [
              function (data) {
                return Qs.stringify(data);
              },
            ],
            data: vm.user,
          }).then(function (res) {
            if (res.data.code === 500) {
              vm.$message.error("添加用户失败");
            } else if (res.data.code === 200) {
              vm.$message.success("添加用户成功");
              vm.dialogVisible = false;
              vm.getList();
            }
          });
        }
      });
    },
    // 编辑用户
    editUser(userId) {
      // this.$router.push('/editUser/edit/' + userId)
      this.editdialogVisible = true;
      this.fatchDataByUserId(userId);
      this.getRoles(userId);
      this.getEnterPriceList("edit");
    },
    oneditSubmit() {
      this.$refs["user"].validate((valid) => {
        if (valid) {
          var userId = this.user.userId;
          var vm = this;
          var roleIdsString = vm.user.roleIds;
          if (roleIdsString.length !== 0) {
            vm.user.roleIds = roleIdsString.join(",");
          }
          // const datas={
          //     'password': vm.user.password,
          //     'enterpriseId': vm.user.enterpriseId,
          //     'state': vm.user.state,
          //     'roleIds': vm.user.roleIds,
          //     'telphone': vm.user.telphone,
          //     'wxCode': vm.user.wxCode,
          //     'realName': vm.user.realName
          //   }
          //   const newDatas=Qs.stringify(datas)
          // this.postRequest('user/updateItem?userId=' + userId,newDatas)
          vm.axios({
            method: "POST",
            url: "/ap/user/updateItem?userId=" + userId,
            transformRequest: [
              function (data) {
                return Qs.stringify(data);
              },
            ],
            data: {
              password: vm.user.password,
              enterpriseId: vm.user.enterpriseId,
              state: vm.user.state,
              roleIds: vm.user.roleIds,
              telphone: vm.user.telphone,
              wxCode: vm.user.wxCode,
              realName: vm.user.realName,
            },
          }).then(function (res) {
            if (res.data.code === 500) {
              vm.$message.error("修改用户失败");
            } else if (res.data.code === 200) {
              vm.$message.success("修改用户成功");
              vm.editdialogVisible = false;
              vm.getList();
            }
          });
        }
      });
    },
    // 获取当前企业所有角色
    getRoles(userId) {
      console.log(1);
      var vm = this;
      //this.postRequest('user/findRoleByUserId?userId=' + userId)
      this.axios({
        method: "POST",
        url: "/api/user/findRoleByUserId?userId=" + userId,
      }).then(function (res) {
        if (res.data.code === 200) {
          // 角色数组
          vm.roleIdsOptions = res.data.data;
          console.log(vm.roleIdsOptions);
        }
      });
    },
    // 修改状态
    editUserState(userId, state) {
      this.$confirm("确定修改当前用户状态吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var vm = this;
          //this.getRequest('user/status?userId=' + userId + '&state=' + state)
          this.axios({
            method: "GET",
            url: "/api/user/status?userId=" + userId + "&state=" + state,
          })
            .then(function (res) {
              if (res.data.code === 200) {
                vm.$message({
                  message: "修改用户状态成功",
                  type: "success",
                });
                vm.getList(); // 刷新列表
              }
              // eslint-disable-next-line handle-callback-err
            })
            .catch(function (error) {
              vm.$message.error("修改用户状态失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 取消事件
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },
    // 重置密码
    userPassWord(userId) {
      this.$confirm("是否重置该用户密码？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var vm = this;
          this.getRequest("user/resetPass?userId=" + userId);
          this.axios({
            method: "GET",
            url: "/api/user/resetPass?userId=" + userId,
          })
            .then(function (res) {
              if (res.data.code === 200) {
                vm.$message({
                  message: "重置用户密码成功",
                  type: "success",
                });
                vm.getList(); // 刷新列表
              }
              // eslint-disable-next-line handle-callback-err
            })
            .catch(function (error) {
              vm.$message.error("重置用户密码失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 搜索
    submitSearch() {
      this.listQuery.page = 1;
      this.getList();
      this.currentPage = 1;
    },
    // 格式化表单数据
    clearForm() {
      this.searchParams.telphone = "";
    },
    // 清除列表的搜索表单
    clearListSearch() {
      this.clearForm();
      this.getList();
    },
    // 格式化表单数据
    clearForm1() {
      this.searchParams.realName = "";
    },
    // 清除列表的搜索表单
    clearListSearch1() {
      this.clearForm1();
      this.getList();
    },
  },
};
</script>

<style scoped>
.el-select {
  width: 360px;
}

.el-input {
  width: 360px;
}

.el-list-leave-active {
  transition: none;
}

.el-upload-list__item-actions {
  transition: none;
}

.el-upload-list--picture-card .el-upload-list__item-actions {
  transition: none;
}

.el-upload-list__item {
  transition: none !important;
}
.bigImg{
  text-align: center;
  width: 100%;
}
.bigImg>img{
  width: 400px;
  height: 400px;
}
</style>
