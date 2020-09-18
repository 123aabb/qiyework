<template>
  <div class="app-container">
    <Breadcrumb />
    <div class="search">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="searchParams.projectName" placeholder="请输入项目名称" style="width: 200px;" class="filter-item" clearable @clear="clearListSearch" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchParams.showState" placeholder="展示状态" style="width: 200px;" class="filter-item" clearable @clear="clearListSearch1">
            <el-option v-for="item in showStateOptions" :key="item.key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-button class="search-btn el-button--infoSearch" type="primary" icon="el-icon-search" @click="submitSearch()">搜索</el-button>
        <!--<el-button class="filter-item" style="margin-left: 5px;" type="primary" @click="addProject()">新增项目</el-button>-->
      </el-form>
    </div>

    <div :class="leftFlags?'tabStyles':'tabStyles2'">
      <el-table :data="list" border fit highlight-current-row>
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>
      <el-table-column label="省份" align="center">
        <template slot-scope="scope">
          {{ scope.row.pro }}
          <span v-if="scope.row.city != null">/</span>
          <span v-if="scope.row.pro == null">/</span>
          {{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="置业顾问" align="center">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="开盘时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.earlyTime |timeParse }}</span>
        </template>
      </el-table-column>
      <el-table-column label="展示时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.showTime |timeParse }}</span>
        </template>
      </el-table-column>
      <el-table-column label="太阳码" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.qrCode" style="width:50rpx;height:50px" alt=""  @click="bigImg(scope.row.qrCode)">
        </template>
      </el-table-column>
      <el-table-column label="展示状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.showState == 1">已展示</span>
          <span v-if="scope.row.showState == 2">未展示</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="360">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editProject(scope.row.projectId)">
            编辑
          </el-button>
          <el-button v-if="scope.row.showState !== 1" icon="el-icon-check" size="mini" type="success" @click="editProjectState(scope.row.projectId,1,'published')">
            项目展示
          </el-button>
          <el-button v-if="scope.row.showState !== 2" icon="el-icon-close" size="mini" type="warning" @click="editProjectState(scope.row.projectId,2,'draft')">
            取消展示
          </el-button>
          <el-button icon="el-icon-s-custom" size="mini" type="info" @click="editCareerCounselor(scope.row.projectId)">
            设置顾问
          </el-button>
          <el-button size="mini" type="warning" @click="sunCode(scope.row)" v-if="!scope.row.qrCode">
            生成太阳码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>

    

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑项目" :visible.sync="editdialogVisible" :before-close="beforeClose" width="50%">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="项目信息" name="1">
          <el-form id="chatRecord" ref="projectInfo" :model="projectInfo" :rules="projectRules" label-width="120px" style="height:450px;overflow:auto;">
            <el-form-item label="填写方式">
              <el-radio v-model="projectInfo.entryMode" label="1">手工录入</el-radio>
              <el-radio v-model="projectInfo.entryMode" label="2">图片展示</el-radio>
            </el-form-item>
            <div v-if="projectInfo.entryMode == 1">
              <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="projectInfo.projectName" placeholder="请输入项目名称" />
              </el-form-item>
              <el-form-item label="项目标签">
                <el-input v-for="projectTitle in projectInfo.projectTitle" :key="projectTitle.key" v-model="projectTitle.value" class="projectTitle" maxlength="10" />
                <div class="plus" type="button" @click="addDomain">
                  <i class="el-icon-plus" />
                </div>
                <div v-if="projectInfo.projectTitle.length > 1" class="minus" type="button" @click="removeDomain">
                  <i class="el-icon-minus" />
                </div>
              </el-form-item>
              <el-form-item label="项目省份" prop="area">
                <v-distpicker :province="projectInfo.pro" :city="projectInfo.city" :area="projectInfo.area" @selected="onSelected" />
              </el-form-item>
              <el-form-item label="详细地址" prop="detailAddress">
                <el-input v-model="projectInfo.detailAddress" type="textarea" style="width:360px !important;" placeholder="请输入详细地址" />
              </el-form-item>
              <el-form-item label="开盘时间" prop="earlyTime">
                <el-date-picker v-model="projectInfo.earlyTime" type="date" placeholder="选择日期" />
              </el-form-item>
              <el-form-item label="展示封面" prop="coverImage">
                <el-upload
                  class="avatar-uploader"
                  action="/api/uploadFile"
                  :show-file-list="false"
                  :on-success="coverImageSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="projectInfo.coverImage" :src="projectInfo.coverImage" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
                <div>注：只能上传一张</div>
              </el-form-item>

                <!-- 这是上传多张的图片 -->
              <el-form-item label="展示banner" prop="projectName">
                <!-- 
                  :on-exceed//文件超出个数
                  :on-change//文件状态改变时的钩子
                  :on-remove //删除
                  :before-upload上传文件之前的钩子
                  multiple:支持多选
                 -->
                <el-upload
                  action="/api/uploadFile"
                  list-type="picture-card"
                  :on-remove="handleRemove"
                  :http-request="uploadAvatar"
                  :on-change="maxUploadNum"
                  :class="{hide:hideUpload}"
                  :before-upload="beforeAvatarUpload"
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                  :on-success="goSuccess"
                  :auto-upload="true"
                  :limit="5"
                  :on-progress="uoGos"
                  multiple
                >
                  <i class="el-icon-plus"></i>
                </el-upload>

                <!--<img v-for="item in picList" :src="item" alt="" />-->
                <div>注：最多上传五张</div>
              </el-form-item>

               <!-- ******************* -->

              <el-form-item label="占地面积" prop="coversArea">
                <el-input v-model="projectInfo.coversArea" maxlength="10" placeholder="请输入占地面积" />
              </el-form-item>
              <el-form-item label="建筑面积" prop="buildArea">
                <el-input v-model="projectInfo.buildArea" maxlength="10" placeholder="请输入建筑面积" />
              </el-form-item>
              <el-form-item label="产权年限" prop="propertyYear">
                <el-input v-model="projectInfo.propertyYear" placeholder="70" /><span>年</span>
              </el-form-item>
              <el-form-item label="交房时间" prop="roomTime">
                <el-date-picker v-model="projectInfo.roomTime" type="date" placeholder="交房时间" />
              </el-form-item>
              <el-form-item label="交付标准" prop="deliveryStandard">
                <el-select v-model="projectInfo.deliveryStandard" class="filter-item" clearable>
                  <el-option v-for="item in deliveryStandardOptions" :key="item.key" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="水费" prop="waterMoney">
                <el-input v-model="projectInfo.waterMoney" placeholder="4.9" /><span>元/吨</span>
              </el-form-item>
              <el-form-item label="电费" prop="electricity">
                <el-input v-model="projectInfo.electricity" placeholder="0.5" /><span>元/度</span>
              </el-form-item>
              <el-form-item label="供暖方式" prop="heatingWay">
                <el-input v-model="projectInfo.heatingWay" placeholder="请输入供暖方式" />
              </el-form-item>
              <el-form-item label="车位比" prop="carProportion">
                <el-input v-model="projectInfo.carProportion" placeholder="请输入车位比" />
              </el-form-item>
              <el-form-item label="绿化率" prop="greenProportion">
                <el-input v-model="projectInfo.greenProportion"placeholder="请输入绿化率" />
              </el-form-item>
              <el-form-item label="容积率" prop="volumeProportion">
                <el-input v-model="projectInfo.volumeProportion" placeholder="请输入容积率" />
              </el-form-item>
              <el-form-item label="物业费">
                <el-input v-model="projectInfo.propertyMoney" placeholder="请输入物业费" /><span>元/月 每平方米</span>
              </el-form-item>
            </div>
            <div v-if="projectInfo.entryMode == 2">
              <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="projectInfo.projectName" placeholder="请输入项目名称" />
              </el-form-item>
              <el-form-item label="项目标签">
                <el-input v-for="projectTitle in projectInfo.projectTitle" :key="projectTitle.key" v-model="projectTitle.value" class="projectTitle" />
                <div class="plus" type="button" @click="addDomain"><i class="el-icon-plus" /></div>
                <div v-if="projectInfo.projectTitle.length > 1" class="minus" type="button" @click="removeDomain"><i class="el-icon-minus" /></div>
              </el-form-item>
              <el-form-item label="项目省份" prop="area">
                <v-distpicker :province="projectInfo.pro" :city="projectInfo.city" :area="projectInfo.area" @selected="onSelected" />
              </el-form-item>
              <el-form-item label="详细地址" prop="detailAddress">
                <el-input v-model="projectInfo.detailAddress" type="textarea" style="width:360px !important;" placeholder="请输入详细地址" />
              </el-form-item>
              <el-form-item label="开盘时间" prop="earlyTime">
                <el-date-picker v-model="projectInfo.earlyTime" type="date" placeholder="选择日期" />
              </el-form-item>
              <el-form-item label="展示封面" prop="coverImage">
                <el-upload class="avatar-uploader" action="/api/uploadFile" :show-file-list="false" :on-success="coverImageSuccess" :before-upload="beforeAvatarUpload">
                  <img v-if="projectInfo.coverImage" :src="projectInfo.coverImage" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
                <div>注：只能上传一张</div>
              </el-form-item>
              <el-form-item label="基本信息" prop="basicInfoImage">
                <el-upload class="avatar-uploader" action="/api/uploadFile" :show-file-list="false" :on-success="basicInfoImageSuccess" :before-upload="beforeAvatarUpload">
                  <img v-if="projectInfo.basicInfoImage" :src="projectInfo.basicInfoImage" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
                <div>注：最多上传一张</div>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="户型信息" name="2">
          <div style="margin-bottom: 20px;">
            <el-button size="small" @click="addTab(editableTabsValue)">
              新增户型
            </el-button>
          </div>
          <el-tabs v-model="editableTabsValue" type="card" closable style="height:450px;overflow:auto;" @tab-remove="removeTab" @tab-click="clicktab()">
            <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :index="index" :label="item.title" :name="item.name">
              <el-form ref="householdInfo" :model="householdInfo" :rules="householdRules">
                <el-form-item label="户型名称" prop="modelName">
                  <el-input v-model="householdInfo.modelName" placeholder="请输入项目名称，例如A户型" />
                </el-form-item>
                <el-form-item label="户型室厅">
                  <el-select v-model="householdInfo.room" class="household" placeholder="请选择" prop="room">
                    <el-option v-for="item in roomOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select><span>室</span>
                  <el-select v-model="householdInfo.hall" class="household" placeholder="请选择">
                    <el-option v-for="item in hallOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select><span>厅</span>
                  <el-select v-model="householdInfo.toilet" class="household" placeholder="请选择">
                    <el-option v-for="item in toiletOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select><span>卫</span>
                  <el-select v-model="householdInfo.kitchen" class="household" placeholder="请选择">
                    <el-option v-for="item in kitchenOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select><span>厨</span>
                </el-form-item>
                <el-form-item label="户型面积" prop="modelArea">
                  <el-input v-model="householdInfo.modelArea" placeholder="请输入户型面积" /><span>m²</span>
                </el-form-item>
                <el-form-item label="均价" prop="avgPrice">
                  <el-input v-model="householdInfo.avgPrice" placeholder="请输入均价" /><span>元/m²</span>
                </el-form-item>
                <el-form-item label="户型平面图" prop="modelImage">
                  <el-upload class="avatar-uploader" action="/api/uploadFile" :show-file-list="false" :on-success="modelImageSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="householdInfo.modelImage" :src="householdInfo.modelImage" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                  <div>注：只能上传一张</div>
                </el-form-item>
                <el-form-item label="样板间图片" prop="prototypeRoom">
                  <el-upload
                    action="#"
                    list-type="picture-card"
                    :http-request="uploadAvatar1"
                    :on-remove="handleRemove1"
                    :on-change="maxUploadNum1"
                    :on-exceed="handleExceed1"
                    multiple
                    :limit="9"
                    :class="{hideAdd:uploadDisabled}"
                    :before-upload="beforeAvatarUpload"
                    :file-list="fileList1"
                  >
                    <i class="el-icon-plus" />
                  </el-upload>
                  <div>注：最多上传九张</div>
                </el-form-item>
              </el-form>
              <span style="margin-left: 120px;">
                <el-button type="primary" @click="addOrEdit">确定</el-button>
              </span>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="周边配套" name="3">
          <el-form ref="surroundInfo" :model="surroundInfo" :rules="surroundRules" label-width="120px" style="height:450px;overflow:auto;">
            <el-form-item label="填写方式">
              <el-radio v-model="surroundInfo.entryMode" label="1">手工录入</el-radio>
              <el-radio v-model="surroundInfo.entryMode" label="2">图片展示</el-radio>
            </el-form-item>
            <div v-if="surroundInfo.entryMode == 1">
              <el-form-item label="地铁路线" prop="subway">
                <el-input v-model="surroundInfo.subway" placeholder="请输入地铁路线" />
              </el-form-item>
              <el-form-item label="公交路线" prop="bus">
                <el-input v-model="surroundInfo.bus" placeholder="请输入公交路线" />
              </el-form-item>
              <el-form-item label="教育" prop="education">
                <el-input v-model="surroundInfo.education" placeholder="请输入教育" />
              </el-form-item>
              <el-form-item label="医疗" prop="medical">
                <el-input v-model="surroundInfo.medical" placeholder="请输入医疗" />
              </el-form-item>
              <el-form-item label="商业配套" prop="business">
                <el-input v-model="surroundInfo.business" placeholder="请输入商业配套" />
              </el-form-item>
              <el-form-item label="休闲娱乐" prop="entertainment">
                <el-input v-model="surroundInfo.entertainment" placeholder="请输入休闲娱乐" />
              </el-form-item>
            </div>
            <div v-if="surroundInfo.entryMode == 2">
              <el-form-item label="周边配套" prop="surroundImage">
                <el-upload
                  class="avatar-uploader"
                  action="/api/uploadFile"
                  :show-file-list="false"
                  :on-success="surroundImageSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="surroundInfo.surroundImage" :src="surroundInfo.surroundImage" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
                <div>注：只能上传一张</div>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="activeName === '1'" type="primary" @click="onEditSubmitProject">确 定</el-button>
        <!-- <el-button v-if="activeName === '2'" type="primary" @click="editdialogVisible=false">确定</el-button> -->
        <el-button v-if="activeName === '3'" type="primary" @click="onEditSurroundSubmit">确 定</el-button>
        <el-button @click="closeEditdialog()">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="设置顾问" :visible.sync="ewmVisible" width="50%">
      <el-form ref="projectInfo" :model="projectInfo" label-width="120px">

        <el-form-item label="置业顾问">
          <el-select v-model="projectInfo.userIds" multiple placeholder="请选择角色" prop="roleIds">
            <el-option v-for="item in userIdsOptions" :key="item.userId" :label="item.realName" :value="item.userId" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="oneditSubmit">确 定</el-button>
            <el-button @click="ewmVisible = false">取 消</el-button>
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
  import Pagination from '@/components/Pagination'
  import Breadcrumb from '@/publicComp/Breadcrumb'
  // 公共类转换事件格式
  import { timeParse } from '@/commom/commom'
  import Qs from 'qs'
  import VDistpicker from 'v-distpicker'
  import {Message} from 'element-ui'
  export default {
     components: { 
       Pagination,
        VDistpicker,
        Breadcrumb
      },
    // 公共类转换事件格式
    filters: {
      timeParse
    },

    data() {
      // 只能输入整数
      const checkContactWay = (rule, value, callback) => {
        const myreg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
        setTimeout(() => {
          if (value && !myreg.test(value)) {
            callback(new Error('请输入正整数'))
          } else {
            callback()
          }
        }, 200)
      }
      // 限制只能输入数字(可以输入两位小数)
      const validateMoney = (rule, value, callback) => {
        const myshu = /^\d+.?\d{0,2}$/
        setTimeout(() => {
          if (value && !myshu.test(value)) {
            callback(new Error('只输入两位小数'))
          } else if (!value) {
            callback('不能为空！')
          } else {
            callback()
          }
        }, 200)
      }
      return {
        bigSrc:'',//需要放大的图片
        dialogFormVisible:false,

        hideUpload: false,
        picList: [],
        fileList: [],
        picList1:[],
        fileList1:[],
        doorModelItem: [],
        bannerImgString: '',
        currentPage: 1,
        searchParams: {
          projectName: '',
          showState: ''
        },
        total: 0,
        listQuery: {
          page: 1,
          limit: 10
        },
        activeModel:null,
        modelArr:[],
        aaa:null,
        list: null,
        dialogVisible: false,
        ewmVisible: false,
        innerVisible: false,
        enterpriseList: '',
        editdialogVisible: false,
        editdialogVisibleInside: false,
        uploadDisabled: false,
        limitImgNumber: 5,
        userIdsOptions: '',
        editableTabsValue: '1',
        editableTabs: [],
        tabIndex: 0,
        showStateOptions: [{ value: 1, key: 1, label: '已展示', selected: true }, { value: 2, key: 2, label: '未展示' }],
        deliveryStandardOptions: [{ value: 1, key: 1, label: '毛坯', selected: true }, { value: 2, key: 2, label: '精装' }],
        roomOptions: [{ value: 1, key: 1, selected: true }, { value: 2, key: 2 }, { value: 3, key: 3 }, { value: 4, key: 4 }, { value: 5, key: 5 }],
        hallOptions: [{ value: 1, key: 1, selected: true }, { value: 2, key: 2 }, { value: 3, key: 3 }, { value: 4, key: 4 }, { value: 5, key: 5 }],
        toiletOptions: [{ value: 1, key: 1, selected: true }, { value: 2, key: 2 }, { value: 3, key: 3 }, { value: 4, key: 4 }, { value: 5, key: 5 }],
        kitchenOptions: [{ value: 1, key: 1, selected: true }, { value: 2, key: 2 }, { value: 3, key: 3 }, { value: 4, key: 4 }, { value: 5, key: 5 }],
        activeName: '1',
        projectInfo: {
          'projectId': '',
          'entryMode': '1',
          'projectName': '',
          'projectTitle': [{ value: '' }],
          'pro': '',
          'city': '',
          'area': '',
          'detailAddress': '',
          'earlyTime': '',
          'coverImage': '',
          'bannerImage': '',
          'basicInfoImage': '',
          'coversArea': '',
          'buildArea': '',
          'propertyYear': 70,
          'roomTime': '',
          'deliveryStandard': 1,
          'waterMoney': 4.9,
          'electricity': 0.5,
          'heatingWay': '',
          'carProportion': '',
          'greenProportion': '',
          'volumeProportion': '',
          'propertyMoney': ''
        },
        householdInfo: {
          'modelId': null,
          'projectId': '',
          'modelName': '',
          'room': '',
          'hall': '',
          'toilet': '',
          'kitchen': '',
          'modelArea': '',
          'avgPrice': '',
          'modelImage': '',
          'prototypeRoom': ''
        },
        surroundInfo: {
          'projectId': '',
          'entryMode': '1',
          'subway': '',
          'bus': '',
          'education': '',
          'medical': '',
          'business': '',
          'entertainment': '',
          'surroundImage': ''
        },
        projectRules: {
          projectName: [{ required: true, message: '不能为空' }],
          // projectTitle: [{ max: 30, message: '字符长度不超过30位', trigger: 'blur' }],
          pro: [{ required: true, message: '不能为空' }],
          city: [{ required: true, message: '不能为空' }],
          area: [{ required: true, message: '不能为空' }],
          detailAddress: [{ required: true, message: '不能为空' }, { max: 50, message: '字符长度不超过50位' }],
          earlyTime: [{ required: true, message: '不能为空' }],
          coverImage: [{ required: true, message: '不能为空' }],
          basicInfoImage: [{ required: true, message: '不能为空' }],
          bannerImage: [{ required: true, message: '不能为空' }],
          coversArea: [{ required: true, message: '不能为空且只能是数字' }, { validator: validateMoney, trigger: 'blur' }],
          buildArea: [{ required: true, message: '不能为空且只能是数字' }, { validator: validateMoney, trigger: 'blur' }],
          propertyYear: [{ required: true, message: '不能为空且只能输入正整数' }, { validator: checkContactWay, trigger: 'blur' }],
          roomTime: [{ required: true, message: '不能为空' }],
          deliveryStandard: [{ required: true, message: '不能为空' }],
          waterMoney: [{ required: true, message: '不能为空' }],
          electricity: [{ required: true, message: '不能为空' }],
          heatingWay: [{ required: true, message: '不能为空' }, { max: 30, message: '字符长度不超过30位' }],
          carProportion: [{ required: true, message: '不能为空且只能有两位小数' }, { validator: validateMoney, trigger: 'blur' }],
          greenProportion: [{ required: true, message: '不能为空且只能有两位小数' }, { validator: validateMoney, trigger: 'blur' }],
          volumeProportion: [{ required: true, message: '不能为空且只能有两位小数' }, { validator: validateMoney, trigger: 'blur' }],
          propertyMoney: [{ trigger: 'change', message: '不能为空且只能有两位小数' }]
        },
        householdRules: {
          modelName: [{ required: true, message: '不能为空' }, { max: 10, message: '字符长度不超过10位' }],
          room: [{ required: true, message: '不能为空' }],
          modelArea: [{ required: true, message: '不能为空' }, { max: 10, message: '字符长度不超过10位' }],
          avgPrice: [{ required: true, message: '不能为空' }, { max: 10, message: '字符长度不超过10位' }]
        },
        surroundRules: {
          subway: [{ required: true, message: '不能为空' }, { max: 255, message: '字符长度不超过255位' }],
          bus: [{ required: true, message: '不能为空' }, { max: 255, message: '字符长度不超过255位' }],
          education: [{ required: true, message: '不能为空' }, { max: 255, message: '字符长度不超过255位' }],
          medical: [{ required: true, message: '不能为空' }, { max: 255, message: '字符长度不超过255位' }],
          business: [{ required: true, message: '不能为空' }, { max: 255, message: '字符长度不超过255位' }],
          entertainment: [{ required: true, message: '不能为空' }, { max: 255, message: '字符长度不超过255位' }]
        }
      }
    },
    created() {
      this.getList()
    },
    computed: {
    leftFlags() {
      console.log(this.$store.state.leftFlag);
      return this.$store.state.leftFlag;
    },
  },
    methods: {
      //放大图片
      bigImg(e){
        this.bigSrc=e
        this.dialogFormVisible =true
      },
       //生成太阳
      sunCode(e){
      console.log(e)
      this.axios({
        method: 'GET',
        url: 'user/getWxaCodeUnlimit',
        params: {
          type:'2',
          enterpriseId:e.enterpriseId,
          projectId:e.projectId
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
      beforeClose() {
        this.picList = []
        this.picList1 = []
        this.fileList = []
        this.fileList1 = []
        this.scroll()
      },
      closeEditdialog() {
        this.picList = []
        this.picList1 = []
        this.fileList = []
        this.fileList1 = []
        this.scroll()
      },
      scroll() {
        const chatRecord = document.getElementById('chatRecord')
        chatRecord.scrollTop = 0
        this.editdialogVisible = false
      },
      // 分页查询
      getList() {
        var vm = this
        const search = {
          projectName: this.searchParams.projectName || '',
          showState: this.searchParams.showState
        }
        //this.getRequest('project/list?page=' + vm.listQuery.page + '&limit=' + vm.listQuery.limit)
        vm.axios({
          method: 'GET',
          url: '/api/project/list?page=' + vm.listQuery.page + '&limit=' + vm.listQuery.limit,
          params: search
        })
        .then(function(res) {
          console.log(res)
          // 得到一个pageInfo对象
          vm.total = res.data.data.total
          vm.list = res.data.data.data// 当前页显示的所有数据
        })
      },
      // 标签新增删除
      removeDomain() {
        this.projectInfo.projectTitle.splice(-1)
      },
      addDomain() {
        this.projectInfo.projectTitle.push({
          value: ''
        })
      },
      onSelected(data) {
        this.projectInfo.pro = data.province.value
        this.projectInfo.city = data.city.value
        this.projectInfo.area = data.area.value
      },
      // 重置
      resetTemp() {
        this.activeName = '1'
        this.projectInfo = {
          'projectId': '',
          'entryMode': '1',
          'projectName': '',
          'projectTitle': [{ value: '' }],
          'pro': '',
          'city': '',
          'area': '',
          'detailAddress': '',
          'earlyTime': '',
          'coverImage': '',
          'bannerImage': '',
          'basicInfoImage': '',
          'coversArea': '',
          'buildArea': '',
          'propertyYear': '70',
          'roomTime': '',
          'deliveryStandard': 1,
          'waterMoney': 4.9,
          'electricity': 0.5,
          'heatingWay': '',
          'carProportion': '',
          'greenProportion': '',
          'volumeProportion': '',
          'propertyMoney': ''
        }
      },
      // 重置户型
      resetDoor() {
        this.householdInfo = {
          'modelId': null,
          // 'projectId': '',
          'modelName': '',
          'room': '',
          'hall': '',
          'toilet': '',
          'kitchen': '',
          'modelArea': '',
          'avgPrice': '',
          'modelImage': '',
          'prototypeRoom': ''
        }
      },
      // =================================================图片上传=================================================
      // 封面图片上传
      coverImageSuccess(res, file) {
        this.projectInfo.coverImage = res.data[0]
      },
      // basicInfoImage图片上传
      basicInfoImageSuccess(res, file) {
        this.projectInfo.basicInfoImage = res.data[0]
      },
      modelImageSuccess(res) {
        this.householdInfo.modelImage = res.data[0]
      },

      surroundImageSuccess(res) {
        this.surroundInfo.surroundImage = res.data[0]
      },
      //banner上传
      uploadAvatar(item) {
        var vm = this
        const formData = new FormData()
        formData.append('file', item.file)
        const uid = item.file.uid
       // this.postRequest('/uploadFile',formData)
        vm.axios({
          method: 'post',
          url: '/api/uploadFile',
          data:formData
        })
        .then(function(res) {
          vm.picList.push({ name: uid, url: res.data.data[0]})
          vm.emptyUpload()
        }).catch(() => {
          vm.$message.error('上传失败，请重新上传')
          vm.emptyUpload()
        })
      },
      /**
       * 清空上传组件
       */
      emptyUpload() {
        const mainImg = this.$refs.upload
        if (mainImg) {
          if (mainImg.length) {
            mainImg.forEach(item => {
              item.clearFiles()
            })
          } else {
            this.$refs.upload.clearFiles()
          }
        }
      },
      // bannerImage图片上传
      handleRemove(file, fileList) {
        console.log('文件移除')
        for (const i in this.picList) {

          if (this.picList[i].name === file.uid||this.picList[i].url === file.url) {
            this.picList.splice(i, 1)
          }
        }
        if (this.fileList.length >= 5) {
          this.hideUpload = true
        } else {
          this.hideUpload = false
        }
        console.log(2, fileList)
        console.log(3, this.picList)
      },
      // 上传最大的图片个数
      maxUploadNum(file, fileList) {
        console.log('状态改变')
        console.log(file.status)
        console.log('状态改变')
        if(file.status=='ready'){
          this.prlength=0;
          this.prshow=true
          const invite=setInterval(()=>{
              if(this.prlength>=90){
                clearInterval(invite)
                return 
              }
              this.prlength+=1
          },20)
        }
        if(file.status=='success'){
          this.prlength=100;
          this.prshow=false
          console.log(file.status)
        }
        if (fileList.length >= 5) {
          this.hideUpload = true
        } else {
          this.hideUpload = false
        }
      },
      //上传进度
      uoGos(){
       console.log('上传进度')
      },
      //上传成功
      goSuccess(response, file, fileList){
        console.log('上传成功')
        console.log(response, file, fileList)
        console.log('上传成功')
        this.$refs.toolFileUpload.clearFiles();
        this.$refs.reportUpload.clearFiles();
      },
      handleExceed() {
        this.$message.warning(`最多上传5个图片`)
      },
      // ======================================================图片上传===========================================================
      // banner上传
      uploadAvatar1(item) {
        var vm = this
        const formData = new FormData()
        formData.append('file', item.file)
        const uid = item.file.uid
        //this.postRequest('/uploadFile',formData)
        vm.axios({
          method: 'post',
          url: '/api/uploadFile',
          data: formData
        })
        .then(function(res) {
          vm.picList1.push({ name: uid, url: res.data.data[0] })
          vm.emptyUpload1()
        }).catch(() => {
          vm.$message.error('上传失败，请重新上传')
          vm.emptyUpload1()
        })
      },
      /**
       * 清空上传组件
       */
      emptyUpload1() {
        const mainImg = this.$refs.upload
        if (mainImg) {
          if (mainImg.length) {
            mainImg.forEach(item => {
              item.clearFiles()
            })
          } else {
            this.$refs.upload.clearFiles()
          }
        }
      },
      // 户型部分bannerImage图片上传
      handleRemove1(file, fileList1) {
        for (const i in this.picList1) {
          if (this.picList1[i].url === file.url) {
            this.picList1.splice(i, 1)
          }
        }
        if (this.fileList1.length >= 9) {
          this.uploadDisabled = true
        } else {
          this.uploadDisabled = false
        }
      },
      // 上传最大的图片个数
      maxUploadNum1(file, fileList1) {
        if (fileList1.length >= 9) {
          this.uploadDisabled = true
        } else {
          this.uploadDisabled = false
        }
      },
      handleExceed1() {
        this.$message.warning(`最多上传9个图片`)
      },
      // 新增户型
      addDoorModel() {
        this.resetDoor()
        this.editdialogVisibleInside = true
      },
      // 编辑户型
      editDoorModel(site) {
        this.editdialogVisibleInside = true
        // this.householdInfo.modelId=site.modelId
        this.householdInfo = site
      },
      // 控制标签页的切换，未完成指定内容填写不允许切换

      // 户型标签的修改删除
      addTab(targetName) {
        this.isTip = false
        this.editableTabs.push({
          title: '新户型',
          name: '新户型',
        })
        this.editableTabsValue = '新户型'
        this.modelArr['新户型']=null
        this.activeModel=null
        this.resetDoor()
        this.householdInfo.modelId=null
        this.picList1 = []
        this.fileList1=[]
      },
      removeTab(targetName) {
       // this.getRequest('doorModel/del?modelId=' + this.modelArr[targetName])
        //删除户型
        this.axios({
          method: 'GET',
          url: '/api/doorModel/del?modelId=' + this.modelArr[targetName]
        })
        .then(function(res) {

        })
        const tabs = this.editableTabs
        let activeName = this.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.editableTabsValue = activeName
        this.editableTabs = tabs.filter(tab => tab.name !== targetName)
        //初始化当前页
        this.activeModel=this.modelArr[this.editableTabsValue]
        //非新增则需回显
        if(this.activeModel!=null){
          //回显问题
          var vm = this
          //this.getRequest('doorModel/search?modelId=' + this.activeModel)
          this.axios({
            method: 'GET',
            url: '/api/doorModel/search?modelId=' + this.activeModel
          })
          .then(function(res) {
            vm.picList1 = []
            vm.fileList1=[]
            res.data.data.modelArea+=''
            res.data.data.avgPrice+=''
            var prototypeRoomStr=res.data.data.prototypeRoom
            //更新多图
            if (prototypeRoomStr !== null) {
              prototypeRoomStr.split(',').forEach(function(item) {
                vm.fileList1.push({ name: 'name', url: item })
                // this.picList.push({ url: res.data[0], uid: this.formData.img.length})
              })
              vm.picList1 = vm.fileList1
            }
            vm.householdInfo=res.data.data

          })
        }else{
          var vm = this
          //如果是新增户型的标签
          vm.activeModel=null
          //重置图片和填写项
          vm.resetDoor()
          vm.householdInfo.modelId=null
          vm.picList1 = []
          vm.fileList1=[]

        }
      },
      addOrEdit() {
        var vm = this
        vm.householdInfo.projectId = this.projectInfo.projectId
        var imageList1 = []
        if (vm.picList1.length !== 0) {
          vm.picList1.forEach(function(item) {
            imageList1.push(item.url)
          })
        }
        if (imageList1.length !== 0) {
          vm.householdInfo.prototypeRoom = imageList1.join(',')
        }
        const datas=vm.householdInfo
        const newDatas=Qs.stringify(datas)
        //this.postRequest('doorModel/addOrEdit',newDatas)
        vm.axios({
          method: 'POST',
          url: '/api/doorModel/addOrEdit',
          transformRequest: [function(data) {
            return Qs.stringify(data)
          }],
          data: vm.householdInfo
        })
        .then(function(res) {
          console.log(res)
          if (res.data.code === 1) {
            vm.$message.error('编辑失败')

          } else if (res.data.code === 0) {
            vm.$message.success('编辑成功')
            //将数据替换
            vm.editableTabsValue=res.data.data.modelName
            vm.activeModel=res.data.data.modelId
            //this.getRequest('doorModel/searchAll?projectId=' + vm.surroundInfo.projectId)
            vm.axios({
              method: 'GET',
              url: '/api/doorModel/searchAll?projectId=' + vm.surroundInfo.projectId
            })
            .then(function(res1) {
              vm.editableTabs=[]
              //循环编辑标签
              for(var i=0;i<res1.data.data.length;i++){
                vm.editableTabs.push({
                  title: res1.data.data[i].modelName,
                  name: res1.data.data[i].modelName,
                })
                vm.modelArr[res1.data.data[i].modelName]=res1.data.data[i].modelId
              }
            })
          }
        })
      },
      // 上传图片之前的操作
      beforeAvatarUpload(file) {
        console.log('上传之前')
        console.log(file)
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        const extension =
          testmsg === 'jpg' ||
          testmsg === 'JPG' ||
          testmsg === 'png' ||
          testmsg === 'PNG'
        if (!extension) {
          this.$message({
            message: '上传图片只能是jpg / png格式!',
            type: 'error'
          })
          return false // 必须加上return false; 才能阻止
        }
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isLt1M) {
          this.$message.error('上传头像图片大小不能超过 1MB!')
          return false
        }
        return extension || isLt1M
      },
      handleClick(tab) {
        var vm=this
        if (tab.name === '3') {
          console.log(8888, this.surroundInfo.projectId)
          this.getSurroundByProjectId(this.surroundInfo.projectId)
        }
        //户型信息页
        if(tab.name==='2'){
          //查询所有户型
          //this.getRequest('doorModel/searchAll?projectId=' + this.surroundInfo.projectId)
          this.axios({
            method: 'GET',
            url: '/api/doorModel/searchAll?projectId=' + this.surroundInfo.projectId
          })
          .then(function(res) {
            vm.editableTabs=[]
            //循环编辑标签
            if(res.data.data.length!=0){
              for(var i=0;i<res.data.data.length;i++){
                vm.editableTabs.push({
                  title: res.data.data[i].modelName,
                  name: res.data.data[i].modelName,
                })
                vm.modelArr[res.data.data[i].modelName]=res.data.data[i].modelId
              }
              vm.editableTabsValue = res.data.data[0].modelName
              vm.activeModel = res.data.data[0].modelId//当前户型id
              //初始化第一个户型
              //this.getRequest('doorModel/search?modelId=' + vm.activeModel)
              vm.axios({
                method: 'GET',
                url: '/api/doorModel/search?modelId=' + vm.activeModel
              })
              .then(function(res1) {
                res1.data.data.modelArea+=''
                res1.data.data.avgPrice+=''
                var prototypeRoomStr=res1.data.data.prototypeRoom
                //更新多图
                if (prototypeRoomStr !== null) {
                  prototypeRoomStr.split(',').forEach(function(item) {
                    vm.fileList1.push({ name: 'name', url: item })
                    // this.picList.push({ url: res.data[0], uid: this.formData.img.length})
                  })
                  vm.picList1 = vm.fileList1
                }
                vm.householdInfo = res1.data.data
              })
            }
            

          })
        }
      },
      //切换标签触发
      clicktab() {
        if (!this.isTip) {
          this.isTip = true
        }
        return this.$alert('此操作将不保存数据, 是否继续?', '提示', {
          showClose:false,
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.activeModel=this.modelArr[this.editableTabsValue]
          //非新增则需回显
          if(this.activeModel!=null){
            //回显问题
            var vm = this
            //this.getRequest('doorModel/search?modelId=' + this.activeModel)
            this.axios({
              method: 'GET',
              url: '/api/doorModel/search?modelId=' + this.activeModel
            })
            .then(function(res) {
              vm.picList1 = []
              vm.fileList1=[]
              res.data.data.modelArea+=''
              res.data.data.avgPrice+=''
              var prototypeRoomStr=res.data.data.prototypeRoom
              //更新多图
              if (prototypeRoomStr !== null) {
                prototypeRoomStr.split(',').forEach(function(item) {
                  vm.fileList1.push({ name: 'name', url: item })
                  // this.picList.push({ url: res.data[0], uid: this.formData.img.length})
                })
                vm.picList1 = vm.fileList1
              }
              vm.householdInfo=res.data.data

            })
          }else{
            var vm = this
            //如果是新增户型的标签
            vm.activeModel=null
            //重置图片和填写项
            vm.resetDoor()
            vm.householdInfo.modelId=null
            vm.picList1 = []
            vm.fileList1=[]

          }
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '取消成功'
          })
          throw new Error('取消成功！')
        })

      },
      editProject(projectId) {
        this.activeName = '1'
        this.resetTemp()
        this.projectInfo.projectId = projectId
        this.householdInfo.projectId = projectId
        this.surroundInfo.projectId = projectId
        this.editdialogVisible = true
        this.getProjectByProjectId(projectId)
        this.getDoorModelByProjectId(projectId)
      },
      // 编辑项目确定按钮
      onEditSubmitProject() {
        this.$refs.projectInfo.validate((valid) => {
          if (valid) {
            var vm = this
            var projectTitleArr = []
            var imageList = []
            if (vm.projectInfo.projectTitle.length !== 0) {
              vm.projectInfo.projectTitle.forEach(function(item) {
                projectTitleArr.push(item.value)
              })
            }
            if (projectTitleArr.length !== 0) {
              vm.projectInfo.projectTitle = projectTitleArr.join(',')
            }
            if (vm.picList.length !== 0) {
              vm.picList.forEach(function(item) {
                imageList.push(item.url)
              })
            }
            if (imageList.length !== 0) {
              vm.projectInfo.bannerImage = imageList.join(',')
            }else {
              vm.projectInfo.bannerImage=''
            }
            const datas=vm.projectInfo
            const newDatas=Qs.stringify(datas)
            //this.postRequest('project/updateProject',newDatas)
            vm.axios({
              method: 'POST',
              url: '/api/project/updateProject',
              transformRequest: [function(data) {
                return Qs.stringify(data)
              }],
              data:vm.projectInfo
            })
            .then(function(res) {
              if (res.data.code === 1) {
                vm.$message.error(res.data.msg)
              } else if (res.data.code === 0) {
                vm.$message.success(res.data.msg)
                vm.picList=[]
                vm.fileList=[]
                vm.editdialogVisible = false
              }
            })
          }
        })
      },
      // 获取项目信息
      getProjectByProjectId(projectId) {
        var vm = this
        //this.getRequest('project/getProject?projectId=' + projectId)
        this.axios({
            method: 'GET',
            url: '/api/project/getProject?projectId=' + projectId
          }
        )
        .then(function(res) {
          console.log(res.data.data)
          res.data.data.userList=[]
          vm.projectInfo = res.data.data
          var title = []
          var projectTitleString = vm.projectInfo.projectTitle
          var bannerImageString = vm.projectInfo.bannerImage
          if(projectTitleString != null && projectTitleString!=''){
            projectTitleString.split(',').forEach(function(item) {
              title.push({ value: item })
            })
            vm.projectInfo.projectTitle = title
          }else {
            title.push({ value: "" })
            vm.projectInfo.projectTitle = title
          }
          if(vm.projectInfo.entryMode==null || vm.projectInfo.entryMode==""){
            vm.projectInfo.entryMode='1'
          }else {
            vm.projectInfo.entryMode += ''
          }
          if (bannerImageString != null && bannerImageString!='') {
            bannerImageString.split(',').forEach(function(item) {
              vm.fileList.push({ name: 'name', url: item })
              // this.picList.push({ url: res.data[0], uid: this.formData.img.length})
            })
            vm.picList=vm.fileList;
          }else {
            vm.fileList=[]
            vm.picList=[]
          }
          if (vm.fileList.length >= 5) {
            vm.hideUpload = true
          } else {
            vm.hideUpload = false
          }
        })
      },
      // 获取户型信息
      getDoorModelByProjectId(projectId) {
        var vm = this
        //this.getRequest('doorModel/searchAll?projectId=' + projectId)
        this.axios({
          method: 'GET',
          url: '/api/doorModel/searchAll?projectId=' + projectId
        })
        .then(function(res) {
          vm.doorModelItem = res.data.data
        })
      },
      // 获取周边信息
      getSurroundByProjectId(projectId) {
        var vm = this
        this.axios({
            method: 'GET',
            url: '/api/surround/getSurroundByProjectId?projectId=' + projectId
          }
        ).then(function(res) {
          console.log(res.data.data)
          if (res.data.data === null) {
            vm.surroundInfo.entryMode = '1'
          } else {
            vm.surroundInfo = res.data.data
            vm.surroundInfo.entryMode += ''
            console.log(vm.surroundInfo.entryMode += '')
          }
        })
      },
      // 周边设施编辑提交
      onEditSurroundSubmit() {
        this.$refs.surroundInfo.validate((valid) => {
          if (valid) {
            var vm = this
            vm.axios({
              method: 'POST',
              url: '/api/surround/updateSurround',
              transformRequest: [function(data) {
                return Qs.stringify(data)
              }],
              data: vm.surroundInfo
            }).then(function(res) {
              if (res.data.code === 1) {
                vm.$message.error(res.data.msg)
              } else if (res.data.code === 0) {
                vm.$message.success(res.data.msg)
                vm.picList = []
                vm.fileList = []
                vm.scroll()
                vm.editdialogVisible = false
                vm.getList()
              }
            })
          }
        })
      },
      // 修改状态
      editProjectState(projectId, showState) {
        this.$confirm('确定修改当前项目展示状态吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var vm = this
          this.axios({
            method: 'GET',
            url: '/api/project/showProject?projectId=' + projectId + '&showState=' + showState
          }).then(function(res) {
            if (res.data.code === 0) {
              vm.$message({
                message: res.data.msg,
                type: 'success'
              })
              vm.getList()// 刷新列表
            } else {
              vm.$message({
                message: res.data.msg,
                type: 'error'
              })
              vm.getList()// 刷新列表
            }
            // eslint-disable-next-line handle-callback-err
          }).catch(function(error) {
            vm.$message.error('修改状态失败')
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
        this.searchParams.projectName = ''
      },
      clearForm1() {
        this.searchParams.showState = ''
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
      // =============================================================================================
      // 设置直接顾问
      editCareerCounselor(projectId) {
        this.ewmVisible = true
        this.editCareerCounselor2(projectId)
        this.projectId = projectId
      },
      editCareerCounselor2(projectId) {
        // eslint-disable-next-line no-unused-vars
        var vm = this
        this.axios({
          method: 'GET',
          url: '/api/project/counselorAll?projectId=' + projectId
        }).then(function(res) {
          // eslint-disable-next-line eqeqeq
          if (res.data.code == 200) {
            console.log(res.data.map)
            vm.userIdsOptions = res.data.map.All

            var Arr = []
            res.data.map.list.forEach(function(item) {
              Arr.push(item.userId)
            })
            vm.projectInfo.userIds = Arr
          }
        })
      },
      oneditSubmit() {
        var vm = this
        // eslint-disable-next-line no-unused-vars
        var arr = ''
        vm.projectInfo.userIds.forEach(function(item) {
          arr += (item) + ','
        })
        if (arr.length > 0) {
          arr = arr.substr(0, arr.length - 1)
        }
        vm.axios({
          method: 'POST',
          url: '/api/project/editCounselor',
          transformRequest: [function(data) {
            return Qs.stringify(data)
          }],
          data: {
            'projectId': vm.projectId,
            'userIds': arr
          }
        }).then(function(res) {
          if (res.data.code === 500) {
            vm.$message.error('修改用户失败')
          } else if (res.data.code === 200) {
            vm.ewmVisible = false
            vm.getList()
          }
        })
      }
    }
  }
</script>

<style>
.tabStyles{
  width: calc(100% - 65px);;
  margin: 20px auto;
}
.tabStyles2{
  width:calc(100% - 200px);
  margin: 20px auto;
}
  .hide .el-upload--picture-card {
    display: none;
  }
  .el-dialog__body .el-input{
    width: 360px;
  }
  .el-dialog__body .el-form-item__content .distpicker-address-wrapper select{
    width: 115px;
  }
  .el-dialog__body .el-form-item__content .avatar-uploader {
    width: 80px;
    height: 80px;
    line-height: 95px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 80px;
    height: 80px;
    margin: 0 8px 8px 0;
    display: inline-block;
  }
  .el-dialog__body .el-form-item__content .avatar-uploader .el-upload {
    width: 100%;
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
  }
  .el-dialog__body .el-form-item__content .avatar-uploader i {
    font-size: 28px;
    color: #8c939d;
  }
  .el-dialog__body .el-form-item__content .el-upload {
    width: 80px;
    height: 80px;
    line-height: 95px;
  }
  .avatar{
    width:100%;
    height: 100%;
  }
  .household .el-input{
    width:100px;
    margin:0 5px;
  }
  .projectTitle{
    width:360px;
    display:block;
    margin:5px 0;
  }
  .plus{
    display:inline-block;
    padding: 0 0.3em;
    background-image:linear-gradient(#ddd,#bbb);
    border: 1px solid rgba(0,0,0,0.2);
    border-radius: 0.3em;
    box-shadow: 01px white inset;
    text-align: center;
    color: white;
    font-weight: bold;
    position:absolute;
    top: 6px;
    left: 370px;
    width: 28px;
    height: 40px;
  }
  .plus:active,.minus:active{
    box-shadow:.05em .1em .2em rgba(0,0,0,.6) inset;
    border-color:rgba(0,0,0,.3);
    background:#bbb;
  }
  .minus{
    display:inline-block;
    padding: 0 0.3em;
    background-image:linear-gradient(#ddd,#bbb);
    border: 1px solid rgba(0,0,0,0.2);
    border-radius: 0.3em;
    box-shadow: 01px white inset;
    text-align: center;
    color: white;
    font-weight: bold;
    position:absolute;
    top: 6px;
    left: 410px;
    width: 28px;
    height: 40px;
  }
  .el-textarea__inner{
    min-height: 100px !important;
  }
  #navigation {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9pt;
  }
  #navigation ul {
    list-style: none;
    margin: 0;
    padding: 0;
    padding-top: 4px;
  }
  #navigation li {
    display: inline-block;
    padding: 2px 5px;
    line-height: 30px;
    margin: 0 3px;
    background-image: linear-gradient(#ddd, #bbb);
    border: 1px solid rgba(0,0,0,.2);
    border-radius: .3em;
    box-shadow: 0 1px white inset;
    text-align: center;
    text-shadow: 0 1px 1px black;
    color:white;
    font-weight: bold;
  }
  #navigation li:hover {
    box-shadow: .05em .1em .2em rgba(0,0,0,.6) inset;
    border-color: rgba(0,0,0,.3);
    background: #bbb;
  }
  .el-tab-pane .el-tabs__content .el-form-item__label{
    width: 120px;
  }
  .el-tab-pane .el-tabs__content .el-form-item {
    margin-bottom: 22px;
    display: inline-flex;
    width: 100%;
  }
  .el-list-leave-active {
    transition: none;
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

