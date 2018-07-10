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
          <el-form-item label="商户名称/编号/关键字：" style="margin-bottom:0;">
            <el-input v-model="topBtnGroupForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="商户入网时间：" style="margin-bottom:0;">
            <el-date-picker
              v-model="topBtnGroupForm.startTime"
              type="datetime"
              placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" style="margin-bottom:0;">
            <el-date-picker
              v-model="topBtnGroupForm.endTime"
              type="datetime"
              placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="行业：">
            <el-select v-model="newAddForm.selectVal1" placeholder="请选择" style="width:150px;">
              <el-option
                v-for="item in options1"
                :key="item.packSeq"
                :label="item.packName"
                :value="item.packSeq">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在地区">
            <el-select v-model="newAddForm.selectVal2" placeholder="省" style="width:120px;">
              <el-option
                v-for="item in options2"
                :key="item.packSeq"
                :label="item.packName"
                :value="item.packSeq">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="newAddForm.selectVal3" placeholder="市" style="width:120px;">
              <el-option
                v-for="item in options3"
                :key="item.packSeq"
                :label="item.packName"
                :value="item.packSeq">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商户来源：">
            <el-select v-model="newAddForm.selectVal4" placeholder="请选择" style="width:150px;">
              <el-option
                v-for="item in options4"
                :key="item.packSeq"
                :label="item.packName"
                :value="item.packSeq">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="newAddForm.selectVal5" placeholder="请选择" style="width:150px;">
              <el-option
                v-for="item in options5"
                :key="item.packSeq"
                :label="item.packName"
                :value="item.packSeq">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary">搜 索</el-button>
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
          label="行业">
        </el-table-column>
        <el-table-column
          prop="PROVINCE_NAME"
          label="所在地">
        </el-table-column>
         <el-table-column label="所在地">
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
        <el-table-column label="商户入网时间">
          <template slot-scope="scope">{{scope.row.MERC_BEGIN_TIME = scope.row.MERC_BEGIN_TIME?formatDate(scope.row.MERC_BEGIN_TIME):''}}</template>
        </el-table-column>
        <el-table-column
          prop="AGENT_NAME"
          label="商户来源">
        </el-table-column>
        <el-table-column
          prop="MERC_BUSINESS_ENTITY_CONTACT_NAME"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="MERC_BUSINESS_ENTITY_CONTACT_PHONE"
          label="联系人电话">
        </el-table-column>
        <el-table-column
          prop="MERC_CHECK_STATUS"
          label="状态">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="text"
              @click="handleEdit(scope.$index, scope.row)">配置套餐</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleReset(scope.$index, scope.row)">查看资料</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="tableCount">
      </el-pagination>
    </div>
    <div class="bom-btnGroup">
      <el-button type="danger" @click="batchDelete">批量删除</el-button>
    </div>
    <!-- 新增商户-弹窗 -->
    <el-dialog class="dialog" title="新增商户" :visible.sync="newAdd" width="344px">
      <el-form :model="newAddForm">
        <el-form-item label="商户姓名：">
          <el-input v-model="newAddForm.name" style="width:200px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="商户账号：">
          <el-input v-model="newAddForm.account" style="width:200px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="权限选择：">
          <el-select v-model="newAddForm.selectVal" placeholder="请选择" style="width:200px;">
            <el-option
              v-for="item in confiOptions"
              :key="item.packSeq"
              :label="item.packName"
              :value="item.packSeq">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newAdd = false">取 消</el-button>
        <el-button type="primary" @click="newAdd = false; batchAddConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {commonAjax} from "../../api/api";
import {formatDate} from '../../../static/js/format';
import axios from 'axios';
import md5 from 'js-md5';
  export default {
    data() {
      return {
        topBtnGroupForm:{//表格上部分按钮组
          name: '', //商户名称/编号/关键字
          startTime:'',//入网开始时间
          endTime:'',//入网结束时间
          selectVal1: '',//行业
          selectVal2: '',//省
          selectVal3: '',//市
          selectVal4: '',//商户来源
          selectVal5: '',//状态
        },
        options1: [],
        options2: [],
        options3: [],
        options4: [],
        options5: [],
        newAddForm:{//新增商户弹窗
          name: '',
          account: '',
          selectVal: '',
        },
        newAdd: false,
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
        value6: '',
        tableData: [],
        tableCount: 0,
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
      };
    },
    mounted(){
      this.tableInit();
      //请求权限数据
      // commonAjax('/merchantpackage/getMerchantPackageList', 'post').then(res => {
      //   console.log(res);
      //   let tableData = res.dataInfo;
      //   let that = this;
      //   tableData.map(function(currentValue,index){
      //     var obj = {
      //       "packSeq": currentValue.packSeq,
      //       "packName": currentValue.packName
      //     }
      //     that.confiOptions.push(obj);
      //   })
      //   if (res.resultCode  == 0) {

      //   } else {
      //     this.$message({
      //         type: 'error',
      //         message: '权限数据请求有误'
      //     });
      //   }
      // });
    },
    methods: {
      newAddMer(){
        this.$router.push('/newAddMerchants');
      },
      idconfig(){
        this.$router.push('/merConfigMan');
      },
      handleEdit(){

      },
      handleReset(){
          // this.$refs.multipleTable
      },
      handleCurrentChange(val) {
        this.tableInit(val);
      },
      handleVisit(index,row){
        console.log(row)
        this.$refs.multipleTable.toggleRowSelection(index,true);
        console.log(this.$refs.multipleTable.selection)
      },
      tableInit(page){
        let that = this;
        let paramsForm = {
          page: page,
          size: 10
        }
        commonAjax('/merchant/queryMerchant', 'post',paramsForm).then(res => {
          if (res.resultCode  == 0) {
            this.tableCount = res.count;
            let tableData = res.dataInfo;
            let that = this;
            tableData.map(function(currentValue,index){
              if(currentValue.MERC_CHECK_STATUS==0){
                tableData[index].MERC_CHECK_STATUS = '审核通过';
              }else if(currentValue.MERC_CHECK_STATUS==1){
                tableData[index].MERC_CHECK_STATUS = '待审核';
              }else if(currentValue.MERC_CHECK_STATUS==2){
                tableData[index].MERC_CHECK_STATUS = '审核拒绝';
              }else{
                tableData[index].MERC_CHECK_STATUS = '';
              }
            })
            this.tableData = tableData;
          } else {
            this.$message({
                type: 'error',
                message: '表格数据初始化有误'
            });
          }
        });
      },
      formatDate(time) {
          var date = new Date(time);
          return formatDate(date, "yyyy-MM-dd hh:mm:ss");
      },
      batchDelete(){
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
          axios.post('http://192.168.1.251:9001/agent.call/merchant/delMerchant ', params, ).then(res => {
              if (res.data.resultCode == 0) {
                  this.$message({
                      type: 'success',
                      message: res.data.resultMsg
                  });
                  this.tableInit();
              } else{
                this.$message({
                      type: 'error',
                      message: res.data.resultMsg
                  });
              };
          }).catch(err => {
              console.log(err);
          })
        }
      },
    }
  };
</script>

<style lang="scss">
  #MerchantsList{
    display: flex;
    flex-direction: column;
    .main-hd{
      background-color: #fff;
      padding: 0 20px;
      position: relative;
      .hd-title {
        height: 60px;
        line-height: 60px;
        color: #3399ff;
        font-size: 22px;
      }

      .hd-btnGroup{
        height: 32px;
        position: absolute;
        top: 14px;
        right: 20px;
      }
    }

    .top-btnGroup{
      padding: 20px 20px;
      background-color: #fff;
      margin: 14px 0;
      .el-input__inner{
        line-height: 32px;
      }
    }
    
    .main-table{
      flex: 1;
      .cell{
        text-align: center;
      }
    }

    .pagination{
      text-align: center;
      padding: 10px 0;
      background-color: #fff;
    }

    .bom-btnGroup{
      padding: 0 20px 20px;
      background-color: #fff;
    }

    .el-dialog__header {
        border-bottom: 1px solid #E4E7ED;
    }

    .el-dialog__body{
      padding: 20px 30px;
    } 
  }
</style>

