<template>
  <div id="MerchantsList" style="width:100%;">
    <div class="main-hd">
      <div class="hd-title">商户列表</div>
      <div class="hd-btnGroup">
        <el-button type="primary" @click="newAddMer">新增商户</el-button>
      </div>
    </div>
    <div class="top-btnGroup">
      <el-form ref="form" :inline="true" :model="topBtnGroupForm">
        <div style="margin-bottom:20px;">
          <el-form-item label="商户名称：" style="margin-bottom:0;">
            <el-input v-model="topBtnGroupForm.name" placeholder="请输入商户名称" maxlength="30" clearable></el-input>
          </el-form-item>
          <el-form-item label="商户入网时间：" style="margin-bottom:0;">
            <el-date-picker
              v-model="topBtnGroupForm.startTime"
              type="date"
              placeholder="开始日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" style="margin-bottom:0;">
            <el-date-picker
              v-model="topBtnGroupForm.endTime"
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="所属行业：">
            <el-select v-model="topBtnGroupForm.selectVal1" placeholder="请选择" style="width:150px;" clearable>
              <el-option
                v-for="item in options1"
                :key="item.orderno"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在省市：">
            <el-select v-model="topBtnGroupForm.selectVal2" placeholder="省" style="width:160px;" @change="selectProvince" clearable>
              <el-option
                v-for="item in options2"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="topBtnGroupForm.selectVal3" placeholder="市" style="width:160px;" @change="selectCity" clearable>
              <el-option
                v-for="item in options3"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="商户来源：">
            <el-select v-model="newAddForm.selectVal4" placeholder="请选择" style="width:150px;">
              <el-option
                v-for="item in options4"
                :key="item.packSeq"
                :label="item.packName"
                :value="item.packSeq">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="商户状态：">
            <el-select v-model="topBtnGroupForm.selectVal5" placeholder="请选择" style="width:150px;" clearable>
              <el-option
                v-for="item in options5"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="search">搜 索</el-button>
          <el-button type="primary" disabled>导 出</el-button>
        </div>
      </el-form>
    </div>
    <div class="main-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="MERC_SEQ"
          label="客户编号">
        </el-table-column>
        <el-table-column
          prop="MERC_NAME"
          label="商户名称">
        </el-table-column>
        <el-table-column
          prop="INDUSTRY_NAME"
          label="所属行业">
        </el-table-column>
        <el-table-column
          prop="PROVINCE_NAME"
          label="所在地">
        </el-table-column>
         <el-table-column label="所在省市">
          <template slot-scope="scope">{{scope.row.PROVINCE_NAME = scope.row.PROVINCE_NAME?scope.row.PROVINCE_NAME:''}}{{scope.row.CITY_NAME=scope.row.CITY_NAME?scope.row.CITY_NAME:''}}</template>
        </el-table-column>
        <el-table-column
          prop="RobotCount"
          label="机器人数量">
        </el-table-column>
        <!-- <el-table-column
          prop="MERC_SEQ"
          label="机器人批次数">
        </el-table-column> -->
        <!-- <el-table-column
          prop="MERC_SEQ"
          label="机器人到期日">
        </el-table-column> -->
        <el-table-column label="入网时间">
          <template slot-scope="scope">{{scope.row.MERC_BEGIN_TIME = scope.row.MERC_BEGIN_TIME?formatDate(scope.row.MERC_BEGIN_TIME):''}}</template>
        </el-table-column>
        <!-- <el-table-column
          prop="AGENT_NAME"
          label="商户来源">
        </el-table-column> -->
        <el-table-column
          prop="MERC_BUSINESS_ENTITY_CONTACT_NAME"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="MERC_BUSINESS_ENTITY_CONTACT_PHONE"
          label="联系方式">
        </el-table-column>
        <el-table-column label="商户状态">
          <template slot-scope="scope">
            <span v-if="scope.row.MERC_STATUS==0" style="color:#63b523;">{{trStatus(scope.row.MERC_STATUS)}}</span>
            <span v-if="scope.row.MERC_STATUS==1" style="color:#f95858;">{{trStatus(scope.row.MERC_STATUS)}}</span>
            <span v-if="scope.row.MERC_STATUS==2" style="color:#999999;">{{trStatus(scope.row.MERC_STATUS)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="newAdd = true;handleEdit(scope.$index, scope.row)">套餐</el-button>
            <el-button
              type="text"
              @click="checkData = true;handleCheck(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        v-show="tableCount!=0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableCount">
      </el-pagination>
    </div>
    <div class="bom-btnGroup">
      <el-button type="danger" @click="batchDelete">批量删除</el-button>
    </div>
    <el-dialog class="dialog check" :show-close="false" :visible.sync="editData" width="850px" @closed="closeEditForm('editForm')">
      <div class="check-box">
        <div class="check-title">商户信息
          <el-button class="saveBtn" type="text" @click="editSave">保存</el-button>
          <el-button class="cancleBtn" type="text" @click="editData = false;checkData = true;cancel()">取消</el-button>
        </div>
        <el-row class="check-form" :gutter="20" style="padding: 10px 20px;">
          <el-col :span="13">
            <el-form ref="editForm" :model="editDataForm" label-width="200px">
              <el-form-item label="企业名称：">
                <el-input v-model="editDataForm.mercName" placeholder="请输入企业名称" maxlength="30" clearable></el-input>
              </el-form-item>
              <el-form-item label="企业所在地：">
                <span>{{editDataForm.provinceName}}{{editDataForm.cityName}}</span>
              </el-form-item>
              <el-form-item label="营业执照号：">
                <el-input v-model="editDataForm.mercBusinessLicense" placeholder="请输入营业执照号" maxlength="30" clearable></el-input>
              </el-form-item>
              <el-form-item label="企业法人姓名：">
                <el-input v-model="editDataForm.mercBusinessEntityName" placeholder="请输入企业法人姓名" maxlength="30" clearable></el-input>
              </el-form-item>
              <el-form-item label="企业联系人姓名：">
                <el-input v-model="editDataForm.mercBusinessEntityContactName" placeholder="请输入联系人姓名" maxlength="30" clearable></el-input>
              </el-form-item>
              <el-form-item label="企业邮箱：">
                <el-input v-model="editDataForm.mercBusinessMail" placeholder="请输入企业邮箱" maxlength="30" clearable></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="11">
            <el-form ref="form" :model="editDataForm" label-width="140px" style="padding-right:20px;">
              <!-- <el-form-item label="身份信息：">
                <span>{{editDataForm.mercParentSeq = editDataForm.mercParentSeq==0?'商户':'销售'}}</span>
              </el-form-item> -->
              <el-form-item label="所属行业：">
                <span>{{editDataForm.industryName}}</span>
              </el-form-item>
              <!-- <el-form-item label="商户来源：">
                <span>{{editDataForm.areaName}}</span>
              </el-form-item> -->
              <el-form-item label="企业法人身份证：">
                <el-input v-model="editDataForm.mercBusinessId" placeholder="请输入企业法人身份证" clearable></el-input>
              </el-form-item>
              <el-form-item label="企业联系人电话：">
                <el-input v-model="editDataForm.mercBusinessEntityContactPhone" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入企业联系人电话" maxlength="11" clearable></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div class="check-title">图片资料</div>
        <div class="uploadList">
          <el-upload
            :action="uploadUrl"
            ref="upload"
            multiple :limit="limit"
            list-type="picture-card"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-error="handleError"
            :file-list="fileList">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div class="check-title">套餐信息</div>
        <div style="padding: 10px 20px 10px;">
          <el-row class="check-combo" :gutter="20">
            <el-col :span="8">
              <p>套餐内容</p>
            </el-col>
            <el-col :span="10">
              <p>生效时间</p>
            </el-col>
            <el-col :span="6">
              <p>状态</p>
            </el-col>
          </el-row>
          <template v-for="item in taocanForm">
              <el-row class="check-combo" :gutter="20" style="padding: 0px 0 10px;">
                <el-col :span="8">
                  <div>{{item.termOfValidity}}{{item.robotsNum}}路机器人</div>
                </el-col>
                <el-col :span="10">
                  <div>{{formatTime(item.startTime)}} ~ {{formatTime(item.endTime)}}</div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <span v-if="item.dataStatus==0" style="color:#63b523;">{{daoqi(item.dataStatus)}}</span>
                    <span v-if="item.dataStatus==1" style="color:#f95858;">{{daoqi(item.dataStatus)}}</span>
                  </div>
                </el-col>
              </el-row>
          </template>
        </div>
        <div class="check-title">账户信息</div>
        <el-row class="check-combo" :gutter="20" style="padding: 20px 20px 10px;">
          <el-col :span="10">
            <ul>
              <li>
                <span>账户状态：</span>
                <span v-if="editDataForm.mercStatus==0" style="color:#63b523;">{{changeStatus(editDataForm.mercStatus)}}</span>
                <span v-if="editDataForm.mercStatus==1" style="color:#f95858;">{{changeStatus(editDataForm.mercStatus)}}</span>
                <span v-if="editDataForm.mercStatus==2" style="color:#999999;">{{changeStatus(editDataForm.mercStatus)}}</span>
              </li>
              <li><span>商户入网时间：</span><span>{{formatDate(editDataForm.mercBeginTime)}}</span></li>
            </ul>
          </el-col>
          <el-col :span="10">
            <ul>
              <li><span>子账户数量：</span><span>{{editDataForm.childAccountSum}}</span></li>
            </ul>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="editData = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 查看资料-弹窗 -->
    <el-dialog class="dialog check" :show-close="false" :visible.sync="checkData" width="850px" @closed="closeCheckForm">
      <div class="check-box">
        <div class="check-title">商户信息
          <el-button class="editBtn" type="text" @click="checkData = false;editData = true;modify()">修改</el-button>
        </div>
        <el-row class="check-form" :gutter="20" style="padding: 10px 20px;">
          <el-col :span="14">
            <ul>
              <li>
                <span>企业名称：</span>
                <span>{{checkDataForm.mercName}}</span>
              </li>
              <li>
                <span>企业所在地：</span>
                <span>{{checkDataForm.provinceName}}{{checkDataForm.cityName}}</span>
              </li>
              <li>
                <span>营业执照号：</span>
                <span>{{checkDataForm.mercBusinessLicense}}</span>
              </li>
              <li>
                <span>企业法人姓名：</span>
                <span>{{checkDataForm.mercBusinessEntityName}}</span>
              </li>
              <li>
                <span>企业联系人姓名：</span>
                <span>{{checkDataForm.mercBusinessEntityContactName}}</span>
              </li>
              <li>
                <span>企业邮箱：</span>
                <span>{{checkDataForm.mercBusinessMail}}</span>
              </li>
            </ul>
          </el-col>
          <el-col :span="10">
            <ul>
              <!-- <li>
                <span>身份信息：</span>
                <span>{{checkDataForm.mercParentSeq = checkDataForm.mercParentSeq==0?'商户':'销售'}}</span>
              </li> -->
              <li>
                <span>所属行业：</span>
                <span>{{checkDataForm.industryName}}</span>
              </li>
              <!-- <li>
                <span>商户来源：</span>
                <span>{{checkDataForm.areaName}}</span>
              </li> -->
              <li>
                <span>企业法人身份证：</span>
                <span>{{checkDataForm.mercBusinessId}}</span>
              </li>
              <li>
                <span>企业联系人电话：</span>
                <span>{{checkDataForm.mercBusinessEntityContactPhone}}</span>
              </li>
            </ul>
          </el-col>
        </el-row>
        <div class="check-title">图片资料</div>
        <div class="check-imglist">
          <ul>
            <template v-for="item in taocanPic">
              <li>
                <img :src="item" alt="">
              </li>
            </template>
          </ul>
        </div>
        <div class="check-title">套餐信息</div>
        <div style="padding: 10px 20px 10px;">
          <el-row class="check-combo" :gutter="20">
            <el-col :span="8">
              <p>套餐内容</p>
            </el-col>
            <el-col :span="10">
              <p>生效时间</p>
            </el-col>
            <el-col :span="6">
              <p>状态</p>
            </el-col>
          </el-row>
          <template v-for="item in taocanForm">
              <el-row class="check-combo" :gutter="20" style="padding: 0px 0 10px;">
                <el-col :span="8">
                  <div>{{item.termOfValidity}}{{item.robotsNum}}路机器人</div>
                </el-col>
                <el-col :span="10">
                  <div>{{formatTime(item.startTime)}} ~ {{formatTime(item.endTime)}}</div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <span v-if="item.dataStatus==0" style="color:#63b523;">{{daoqi(item.dataStatus)}}</span>
                    <span v-if="item.dataStatus==1" style="color:#f95858;">{{daoqi(item.dataStatus)}}</span>
                  </div>
                </el-col>
              </el-row>
          </template>
        </div>
        <div class="check-title">账户信息</div>
        <el-row class="check-combo" :gutter="20" style="padding: 20px 20px 10px;">
          <el-col :span="10">
            <ul>
              <li>
                <span>账户状态：</span>
                <span v-if="editDataForm.mercStatus==0" style="color:#63b523;">{{changeStatus(editDataForm.mercStatus)}}</span>
                <span v-if="editDataForm.mercStatus==1" style="color:#f95858;">{{changeStatus(editDataForm.mercStatus)}}</span>
                <span v-if="editDataForm.mercStatus==2" style="color:#999999;">{{changeStatus(editDataForm.mercStatus)}}</span>
                <el-button v-show="jiedong(checkDataForm.mercStatus)" class="freezeBtn" type="primary" plain @click="checkData = false;aa()">解 冻</el-button>
                <el-button v-show="dongjie(checkDataForm.mercStatus)" class="freezeBtn" type="primary" plain @click="freeze = true">冻 结</el-button>
              </li>
              <li><span>商户入网时间：</span><span>{{formatDate(checkDataForm.mercBeginTime)}}</span></li>
            </ul>
          </el-col>
          <el-col :span="10">
            <ul>
              <li><span>子账户数量：</span><span>{{checkDataForm.childAccountSum}}</span></li>
            </ul>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="checkData = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 冻结 -->
    <el-dialog class="dialog" title="冻结" :visible.sync="freeze" width="460px">
      <el-form :model="freezeForm" label-width="90px" style="padding:0 20px;">
        <el-form-item label="冻结原因:" style="margin-bottom:0;">
          <el-input type="textarea" v-model="freezeForm.content"  :maxRows="4" :rows="4" style="width:320px;" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="freeze = false;freezeCancle()">取 消</el-button>
        <el-button type="primary" @click="freeze = false; freezeConfirm()">确 定</el-button>
      </div>
    </el-dialog>
     <!-- 新增套餐 -->
    <el-dialog ref="newAddDialog" class="dialog" title="新增套餐(商户)" :visible.sync="newAdd" width="400px" @closed="closeNewAddDialog('newAddForm')">
      <el-form :model="newAddForm" ref="newAddForm" :rules="newAddFormRules" label-width="110px" style="padding:0 20px;">
        <el-form-item label="机器人数量:" prop="num">
          <el-input v-model="newAddForm.num" oninput="value=value.replace(/[^\d]/g,'')" style="width:240px;" :placeholder='"最大可配置数量"+maxNum' maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item label="机器人有效期:" prop="time">
          <el-select v-model="newAddForm.time" placeholder="请选择" style="width:240px;" clearable>
            <el-option :key="item.value" :label="item.value" :value="item.value" v-for="item in dateArr"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生效时间:" prop="date">
          <el-date-picker
            v-model="newAddForm.date"
            type="datetime"
            placeholder="生效时间"
            value-format="timestamp"
            format="yyyy/MM/dd HH:mm:ss"
            default-time="12:00:00"
            style="width:240px;" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间:" style="margin-bottom:0">
          <el-date-picker
            v-model="rrr"
            type="datetime"
            placeholder="不可选"
            style="width:240px;" disabled>
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newAdd = false;">取 消</el-button>
        <el-button type="primary" @click="newAddConfirm('newAddForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {baseUrl,Ajax} from "../../assets/api/api";
import {formatDate} from '../../assets/js/format';
import axios from 'axios';
import md5 from 'js-md5';
import {validateEmail,isPoneAvailable,validateIdNum} from "../../util/validate";
  export default {
    data() {
      const robotNum = (rule, value, callback) => {
          if(value === ''){
              callback(new Error('请输入机器人数量'));
          }else if(value>this.maxNum){
              callback(new Error('当前机器人最大可配置数量为'+this.maxNum));
          }else {
            callback();
          }
      };
      return {
        fileList: [],
        uploadUrl:baseUrl+'/upload/fileupload',
        limit: 7,
        topBtnGroupForm:{//表格上部分按钮组
          name: '', //商户名称/编号/关键字
          startTime:'',//入网开始时间
          endTime:'',//入网结束时间
          selectVal1: '',//行业
          selectVal2: '',//省
          selectVal3: '',//市
          // selectVal4: '',//商户来源
          selectVal5: '',//状态
        },
        options1: [],
        options2: [],
        options3: [],
        options4: [],
        options5: [
          {
            'label': '启用',
            'value': 0
          },{
            'label': '过期',
            'value': 1
          },{
            'label': '冻结',
            'value': 2
          }
        ],
        newAdd:false,
        checkData:false,
        checkDataForm:{},
        editData: false,
        freeze:false,
        freezeForm:{
          content: ''
        },
        newAddForm:{//新增商户弹窗
          num: '',
          time: '',
          date: '',
        },
        newAddFormRules: {
          num: [{ validator:robotNum,required: true, trigger: 'blur' }],
          time: [{ required: true, message: '请选择机器人有效期', trigger: 'change' }],
          date: [{ required: true, message: '请选择生效时间', trigger: 'change' }],
        },
        checked:true,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        editDataForm:{},
        value6: '',
        tableData: [],
        tableCount: 0,
        pageSize: 10,
        maxNum: 0,
        mercSeq: '',
        currentPage: 1,
        confiOptions: [],
        batchAddForm:{ //批量加入计划弹窗
          name: '',
          templete: [],
          selectVal: '',
          telArr: [],
          telOptions: [],
          checkedTel:[],
          checkAll: false,
          isIndeterminate: true,
          dateArr: ''
        },
        dateArr:[
          {
            value: '7天'
          },{
            value: '15天'
          },{
            value: '1个月'
          },{
            value: '3个月'
          },{
            value: '半年'
          },{
            value: '1年'
          },{
            value: '3年'
          },{
            value: '5年'
          }
        ],
        taocanForm: [],
        taocanPic:[],
        picPath: '',

        // 保存前一刻的checkDataForm
        beforeCheckDataForm: {}
      };
    },
    computed:{
      rrr(){
        if(this.newAddForm.time=='7天'){
          // return this.formatDate(new Date(this.newAddForm.date).setMonth(new Date().getMonth()+1))
          return this.formatDate2(new Date(this.newAddForm.date).setDate(new Date(this.newAddForm.date).getDate()+7))
        }else if(this.newAddForm.time=='15天'){
          return this.formatDate2(new Date(this.newAddForm.date).setDate(new Date(this.newAddForm.date).getDate()+15))
        }else if(this.newAddForm.time=='1个月'){
          return this.formatDate2(new Date(this.newAddForm.date).setMonth(new Date().getMonth()+1))
        }else if(this.newAddForm.time=='3个月'){
          return this.formatDate2(new Date(this.newAddForm.date).setMonth(new Date().getMonth()+3))
        }else if(this.newAddForm.time=='半年'){
          return this.formatDate2(new Date(this.newAddForm.date).setMonth(new Date().getMonth()+6))
        }else if(this.newAddForm.time=='1年'){
          return this.formatDate2(new Date(this.newAddForm.date).setYear(new Date().getFullYear()+1))
        }else if(this.newAddForm.time=='3年'){
          return this.formatDate2(new Date(this.newAddForm.date).setYear(new Date().getFullYear()+3))
        }else if(this.newAddForm.time=='5年'){
          return this.formatDate2(new Date(this.newAddForm.date).setYear(new Date().getFullYear()+5))
        }
      },
    },
    mounted(){
      this.tableInit();
      // 请求行业数据
      Ajax('/sysdicttreedata/getCategory', 'post').then(res => {
        this.options1 = res;
      });
     //获取省
      Ajax("/areacode/getProvince", "post").then(res => {
        this.options2 = res;
      });
    },
    methods: {
        modify() {
            this.beforeCheckDataForm = this.checkDataForm;
        },
        cancel() {
            this.checkDataForm = this.beforeCheckDataForm;
        },
      closeEditForm(formName){
        this.$refs[formName].resetFields();
        this.fileList = [];
      },
      closeCheckForm(formName){
        this.checkDataForm = {
          mercName: '',
          provinceName: '',
          cityName: '',
          mercBusinessLicense: '',
          mercBusinessEntityName: '',
          mercBusinessEntityContactName: '',
          mercBusinessMail: '',
        };
      },
      closeNewAddDialog(formName){
        this.$refs[formName].resetFields();
      },
      handleSizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.tableInit(this.currentPage);
      },
      daoqi(status){
        if(status==0){
          return '正常'
        }else if(status==1){
          return '已失效'
        }
      },
      dongjie(status){
        if(status==0){
          return true
        }else{
          return false
        }
      },
      jiedong(status){
        if(status==2){
          return true
        }else{
          return false
        }
      },
      changeStatus(status){
        if(status==0){
          return '启用';
        }else if(status==1){
          return '停用';
        }else if(status==2){
          return '冻结';
        }else{
          return '';
        }
      },
      handleRemove(file, fileList) {
        let that = this;
        this.fileList.map(function(currentValue, index) {
          if (currentValue.name == file.name) {
            that.fileList.splice(index, 1);
          }
        });
        let paramsForm = {
          filePath: file.name
        }
        Ajax('/upload/delePictureFile', 'post',paramsForm).then(res => {
          if (res.status  == 0) {
            this.$message({
                type: 'success',
                message: 'success'
            });
          } else {
            this.$message({
                type: 'error',
                message: 'error'
            });
          }
        });
      },
      handleSuccess(res, file){
        let that = this;
        let obj = {
          name: res[0],
          url: this.picPath + res[0]
        };
        let arr = [];
        if (this.fileList.length > 0) {
          if (JSON.stringify(this.fileList).indexOf(JSON.stringify(obj)) == -1) {
            this.fileList.push(obj);
          }
        } else {
          arr.push(obj);
          this.fileList = arr;
        }
      },
      handleError(){

      },
      aa(){
         this.$confirm('是否确定解冻？', '解冻', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //确定
            this.checkData = true;
            let paramsForm = {
              mercSeq: this.mercSeq
            }
            Ajax('/merchant/mercThaw', 'post',paramsForm).then(res => {
              if (res.status  == 0) {
                this.$message({
                    type: 'success',
                    message: res.errorMsg
                });
                this.tableInit(this.currentPage);
                Ajax('/merchant/queryMerchantBySeq', 'post',paramsForm).then(res => {
                  if (res.status  == 0) {
                    let that = this;
                    this.checkDataForm = res.dataInfo[0];
                    this.editDataForm = Object.assign({},this.checkDataForm);
                    let picPath = res.otherData.picturePath;
                    let picStr = this.checkDataForm.mercBusinessLicensePic;
                    if(picStr){
                      let picArr = picStr.split(',');
                      let arr = [];
                      picArr.map(function(currentValue){
                        arr.push(picPath+currentValue);
                      })
                      this.taocanPic = arr;
                    }
                  } else {
                    this.$message({
                        type: 'error',
                        message: 'error'
                    });
                  }
                });
              } else {
                this.$message({
                    type: 'error',
                    message: '解冻失败'
                });
              }
            });
          }).catch(() => {
            //取消
            this.checkData = true;
          })
      },
      newAddMer(){
        this.$router.push('/addMerchantsRouter');
      },
      idconfig(){
        this.$router.push('/merConfigMan');
      },
      handleEdit(index,row){
        this.maxNum = row.robotsCount;
        this.mercSeq = row.MERC_SEQ;
      },
      handleCheck(index,row){
        this.mercSeq = row.MERC_SEQ;
        let paramsForm = {
          mercSeq: row.MERC_SEQ,
        }
        Ajax('/merchant/queryMerchantBySeq', 'post',paramsForm).then(res => {
          if (res.status  == 0) {
            this.checkDataForm = res.dataInfo[0];
            this.editDataForm = Object.assign({},this.checkDataForm);
            let that = this;
            let picPath = res.otherData.picturePath;
            this.picPath = res.otherData.picturePath;
            let picStr = this.checkDataForm.mercBusinessLicensePic;
            if(picStr){
              let picArr = picStr.split(',');
              let arr = [];
              this.fileList = [];
              picArr.map(function(currentValue){
                arr.push(picPath+currentValue);
                let obj = {
                  name:currentValue,
                  url:picPath+currentValue
                }
                that.fileList.push(obj)
              })
              this.taocanPic = arr;
              console.log(this.fileList)
            }
          } else {
            this.$message({
                type: 'error',
                message: 'error'
            });
          }
        });
        Ajax('/mercrobots/packInfo', 'post',paramsForm).then(res => {
          if (res.status  == 0) {
            this.taocanForm = res.dataInfo;
          } else {
            // this.$message({
            //     type: 'error',
            //     message: '表格数据初始化有误'
            // });
          }
        });
      },
      handleCurrentChange(val) {
        this.tableInit(val);
      },
      trStatus(status){
        if(status == 0){
          return '启用';
        }else if(status == 1){
          return '停用';
        }else{
          return '冻结';
        }
      },
      tableInit(page){
        let that = this;
        let paramsForm = {
          page: page,
          size: this.pageSize
        }
        Ajax('/merchant/queryMerchant', 'post', paramsForm).then(res => {
          if (res.status  == 0) {
            this.tableCount = res.count;
            this.tableData = res.dataInfo;
          } else {
            // this.$message({
            //     type: 'error',
            //     message: '表格数据初始化有误'
            // });
          }
      })
      .catch(err => {
          this.$router.push("/login");
      });
      },
      selectProvince() {
        let paramsForm = {
          areaId: this.topBtnGroupForm.selectVal2
        };
        Ajax("/areacode/getCity", "post", paramsForm).then(res => {
          this.options3 = res;
          this.topBtnGroupForm.selectVal3 = ''
        });
      },
      selectCity() {
        let that = this;
      },
      formatDate(time) {
        if(time){
          var date = new Date(time);
          return formatDate(date, "yyyy-MM-dd hh:mm:ss");
        }
      },
      formatDate2(time) {
        if(time){
          var date = new Date(time);
          return formatDate(date, "yyyy/MM/dd hh:mm:ss");
        }
      },
      formatTime(time) {
          var date = new Date(time);
          return formatDate(date, "yyyy-MM-dd");
      },
      formatTime1(time) {
          var date = new Date(time);
          return formatDate(date, " hh:mm:ss");
      },
      formatTime2(time) {
          var date = new Date(time);
          return formatDate(date, "yyyy/MM/dd");
      },
      formatYear1(time,num) {
        if(time){
          var date = new Date(time);
          return new Date(new Date().setFullYear(Number(formatDate(date, "yyyy"))+num));
        }
      },
      formatMonth1(time,num) {
        if(time){
          var date = new Date(time);
          return new Date().setMonth(Number(formatDate(date, "MM"))+(num-1));
        }
      },
      formatDate1(time,num) {
         if(time){
          var date = new Date(time);
          return new Date().setDate(Number(formatDate(date, "dd"))+num);
        }
      },
      formatDay(time) {
          if(time>=0){
            var day = '';
            day = Math.floor(time/86400000);
            return day+'天';
          }else{
            return ''
          }

      },
      batchDelete(){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              let selectionData = this.$refs.multipleTable.selection;
              console.log(selectionData);
              if(selectionData.length==0){
                this.$message({
                    type: 'error',
                    message: '请选择需要批量删除的数据'
                });
              }else{
                let mercSeq = [];//客户编号
                for(let i=0;i<selectionData.length;i++){
                  mercSeq.push(selectionData[i].MERC_SEQ);
                }
                let params = new URLSearchParams();
                params.append('mercSeq', mercSeq);
                axios.post(baseUrl + '/merchant/delMerchant ', params, ).then(res => {
                    if (res.data.status == 0) {
                        this.$message({
                            type: 'success',
                            message: '批量删除成功'
                        });
                        this.tableInit();
                    } else{
                      this.$message({
                            type: 'error',
                            message: '批量删除失败'
                        });
                    };
                }).catch(err => {
                    console.log(err);
                })
              }
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消删除'
              });
          });
      },
      search(){
        let that = this;
        let paramsForm = {
          beginTime: this.topBtnGroupForm.startTime,
          endTime: this.topBtnGroupForm.endTime,
          mercName: this.topBtnGroupForm.name,
          mercProvince: this.topBtnGroupForm.selectVal2,
          mercCity: this.topBtnGroupForm.selectVal3,
          mercStatus: this.topBtnGroupForm.selectVal5,
          industryName: this.topBtnGroupForm.selectVal1
        }
        Ajax('/merchant/queryMerchant', 'post',paramsForm).then(res => {
          if (res.status  == 0) {
            this.tableCount = res.count;
            this.tableData = res.dataInfo;
            this.currentPage = 1;
          } else {
            // this.$message({
            //     type: 'error',
            //     message: '数据搜索有误'
            // });
          }
        });
      },
      newAddConfirm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let robotsNum = this.newAddForm.num;
        let termOfValidity = this.newAddForm.time;
        let startTime = this.formatDate2(this.newAddForm.date);
        let endTime = this.rrr;
        if(robotsNum){
          if(robotsNum<=this.maxNum){
            if(termOfValidity){
              if(startTime){
                let paramsForm = {
                  startTime: startTime,
                  endTime: endTime,
                  robotsNum: robotsNum,
                  termOfValidity: termOfValidity,
                  mercSeq: this.mercSeq
                }
                Ajax('/mercrobots/addRobots', 'post',paramsForm).then(res => {
                  if (res.status  == 0) {
                    this.tableInit(this.currentPage)
                    this.$message({
                        type: 'success',
                        message: res.errorMsg
                    });
                    this.newAddForm.num = '';
                    this.newAddForm.time = '';
                    this.newAddForm.date = '';
                    this.newAdd = false;
                    try {
                      this.refs['newAddDialog'].resetFields();
                    } catch (e) {

                    }
                  } else {
                    this.$message({
                        type: 'error',
                        message: '新增失败'
                    });
                  }
                });
              }else{
                this.$message({
                  type: 'error',
                    message: '请选择生效时间'
                });
              }
            }else{
              this.$message({
                type: 'error',
                  message: '请选择机器人有效期'
              });
            }
          }else{
            this.$message({
              type: 'error',
              message: '机器人数量超过当前最大值'
            });
          }
        }else{
          this.$message({
              type: 'error',
              message: '请输入机器人数量'
          });
        }
          }
        });

      },
      freezeConfirm(){
        this.checkData = true;
        let cause = this.freezeForm.content;
        if(cause){
          let paramsForm = {
            mercSeq: this.mercSeq,
            cause: cause
          }
          Ajax('/merchant/mercFrozenCause ', 'post',paramsForm).then(res => {
            if (res.status  == 0) {
              this.$message({
                  type: 'success',
                  message: res.errorMsg
              })
              this.freezeForm.content = '';
              this.tableInit(this.currentPage);
              Ajax('/merchant/queryMerchantBySeq', 'post',paramsForm).then(res => {
                if (res.status  == 0) {
                  this.checkDataForm = res.dataInfo[0];
                  this.editDataForm = Object.assign({},this.checkDataForm);
                  let picPath = res.otherData.picturePath;
                  let picStr = this.checkDataForm.mercBusinessLicensePic;
                  if(picStr){
                    let picArr = picStr.split(',');
                    let arr = [];
                    picArr.map(function(currentValue){
                      arr.push(picPath+currentValue)
                    })
                    this.taocanPic = arr;
                  }
                } else {
                  this.$message({
                      type: 'error',
                      message: 'error'
                  });
                }
              });
            }else{
              this.$message({
                  type: 'error',
                  message:'error'
              });
            }
          })
        }else{
          this.$message({
              type: 'error',
              message: '请输入冻结原因'
          });
        }
      },
      freezeCancle(){
        this.checkData = true;
      },
      editSave(){
        var that = this;
        let mercName = this.editDataForm.mercName;//企业名称
        let mercBusinessLicense = this.editDataForm.mercBusinessLicense;// 营业执照
        let mercBusinessEntityName = this.editDataForm.mercBusinessEntityName;//企业法人姓名
        let mercBusinessEntityContactName = this.editDataForm.mercBusinessEntityContactName;//企业联系人姓名
        let mercBusinessMail = this.editDataForm.mercBusinessMail;//企业邮箱
        let mercBusinessId = this.editDataForm.mercBusinessId;//企业法人身份证
        let mercBusinessEntityContactPhone = this.editDataForm.mercBusinessEntityContactPhone;//企业联系人电话
        let mercBusinessLicensePic = '';
        let arr = [];
        if(mercName){
          if(mercBusinessLicense){
            if(mercBusinessEntityName){
              if(mercBusinessEntityContactName){
                if(mercBusinessMail){
                  if(validateEmail(mercBusinessMail)){
                    if(mercBusinessId){
                      if(validateIdNum(mercBusinessId)){
                        if(mercBusinessEntityContactPhone){
                          if(isPoneAvailable(mercBusinessEntityContactPhone)){
                            if( this.fileList.length>0){
                              this.fileList.map(function(currentValue) {
                                arr.push(currentValue.name);
                              });
                              mercBusinessLicensePic = arr.join();
                              let paramsForm = {
                                mercName: mercName,
                                mercBusinessLicense: mercBusinessLicense,
                                mercBusinessEntityName: mercBusinessEntityName,
                                mercBusinessEntityContactName: mercBusinessEntityContactName,
                                mercBusinessMail: mercBusinessMail,
                                mercBusinessId: mercBusinessId,
                                mercBusinessEntityContactPhone: mercBusinessEntityContactPhone,
                                mercBusinessLicensePic: mercBusinessLicensePic,
                                mercSeq: this.mercSeq,
                              }
                              Ajax('/merchant/upMerchant', 'post',paramsForm).then(res => {
                                if (res.status  == 0) {
                                  this.$message({
                                      type: 'success',
                                      message: 'success'
                                  });
                                  this.editData = false;
                                } else {
                                  this.$message({
                                      type: 'error',
                                      message: 'error'
                                  });
                                }
                              })
                            }else{
                              this.$message({
                                  type: 'error',
                                  message: '至少上传一张图片'
                              });
                            }
                          }else{
                            this.$message({
                              type: 'error',
                              message:'请输入格式手机号'
                            })
                          }
                        }else{
                          this.$message({
                            type: 'error',
                            message:'请输入企业联系人电话'
                          })
                        }
                      }else{
                        this.$message({
                          type: 'error',
                          message:'请输入正确格式身份证号'
                        })
                      }
                    }else{
                      this.$message({
                        type: 'error',
                        message:'请输入企业法人身份证'
                      })
                    }
                  }else{
                    this.$message({
                      type: 'error',
                      message:'请输入正确格式邮箱'
                    })
                  }
                }else{
                  this.$message({
                    type: 'error',
                    message:'请输入企业邮箱'
                  })
                }
              }else{
                this.$message({
                  type: 'error',
                  message:'请输入企业联系人姓名'
                })
              }
            }else{
              this.$message({
                type: 'error',
                message:'请输入企业法人姓名'
              });
            }
          }else{
            this.$message({
              type: 'error',
              message:'请输入营业执照号'
            });
          }
        }else{
          this.$message({
            type: 'error',
            message:'请输入企业名称'
          });
        }
      }
    }
  };
</script>
