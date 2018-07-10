<template>
  <div id="MerConfig" style="width:100%;">
    <div class="main-hd">
      <div class="hd-title">商户权限管理</div>
      <div class="hd-btnGroup">
        <el-button type="primary" @click="newAdd = true">新增</el-button>
        <el-button type="primary" @click="idconfig">权限配置</el-button>
      </div>
    </div>
    <div class="top-btnGroup">
      <el-form ref="form" :inline="true" :model="topBtnGroupForm">
        <el-form-item label="名称/编号：" style="margin-bottom:0;">
          <el-input v-model="topBtnGroupForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户角色权限" style="margin-bottom:0;">
          <el-select v-model="topBtnGroupForm.selectVal" placeholder="请选择" clearable>
            <el-option
              v-for="item in configOptions"
              :key="item.packSeq"
              :label="item.packName"
              :value="item.packSeq">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="search">搜 索</el-button>
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
          label="用户编号">
        </el-table-column>
        <el-table-column
          prop="MERC_NAME"
          label="用户名称">
        </el-table-column>
        <el-table-column
          prop="ACCOUNT"
          label="用户账号">
        </el-table-column>
        <el-table-column
          prop="PACK_NAME"
          label="用户权限角色">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button
              size="text"
              @click="handleEdit(scope.$index, scope.row);edit = true">修改</el-button> -->
            <el-button
              size="text"
              @click="handleEdit(scope.$index, scope.row);edit = true">修改</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleReset(scope.$index, scope.row)">重置密码</el-button>
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
      <el-button type="info" @click="batchDelete">批量删除</el-button>
    </div>
    <!-- 新增商户-弹窗 -->
    <el-dialog class="dialog" title="新增商户" :visible.sync="newAdd" width="344px">
      <el-form :model="newAddForm">
        <el-form-item label="商户姓名：">
          <el-select v-model="newAddForm.selectVal1" placeholder="请选择" style="width:200px;">
            <el-option
              v-for="item in nameOptions"
              :key="item.mercSeq"
              :label="item.mercName"
              :value="item.mercSeq">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户账号：">
          <el-input v-model="newAddForm.account" style="width:200px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="权限选择：">
          <el-select v-model="newAddForm.selectVal2" placeholder="请选择" style="width:200px;">
            <el-option
              v-for="item in configOptions"
              :key="item.packSeq"
              :label="item.packName"
              :value="item.packSeq">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newAdd = false">取 消</el-button>
        <el-button type="primary" @click="newAdd = false; newAddConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改-弹窗 -->
    <el-dialog class="dialog" title="修改" :visible.sync="edit" width="344px">
      <el-form :model="editForm">
        <el-form-item label="商户姓名：">
          <el-input v-model="editForm.name" style="width:200px;" disabled></el-input>
        </el-form-item>
        <el-form-item label="商户账号：">
          <el-input v-model="editForm.account" style="width:200px;" disabled></el-input>
        </el-form-item>
        <el-form-item label="权限选择：">
          <el-select v-model="editForm.selectVal2" placeholder="请选择" style="width:200px;">
            <el-option
              v-for="item in configOptions"
              :key="item.packSeq"
              :label="item.packName"
              :value="item.packSeq">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="edit = false">取 消</el-button>
        <el-button type="primary" @click="edit = false; editConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改-弹窗 -->
    <!-- <el-dialog class="dialog" title="修改" :visible.sync="edit" width="400px">
      <el-form :model="newAddForm">
        <div>请选择功能模块：</div>
        <el-form-item style="margin-bottom:0;">
          <el-checkbox @change="handleCheckAllChange">全选</el-checkbox>
        </el-form-item>
          <el-checkbox-group v-model="editForm.checkedTel" @change="handleCheckedTelChange">
            <el-row :gutter="20">
              <el-col :span="8" :key="item.authSeq" v-for="item in editForm.telArr">
                <el-checkbox :label="item.authName"  :value='item.authSeq'></el-checkbox>
              </el-col>
            </el-row>  
          </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="edit = false">取 消</el-button>
        <el-button type="primary" @click="edit = false; editConfirm()">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import {commonAjax} from "../../api/api";
import axios from 'axios';
import md5 from 'js-md5';
  export default {
    data() {
      return {
        topBtnGroupForm:{//表格上部分按钮组
          name: '',
          selectVal: '',
        },
        newAddForm:{//新增商户弹窗
          phone: '',
          account: '',
          selectVal1: '',
          selectVal2: ''
        },
        newAdd: false,
        edit: false,
        configTem: [],
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
        configOptions: [],
        nameOptions: [],
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
        // editForm:{ //修改弹窗
        //   checkedTel:[],
        //   telArr: [],
        //   telOptions: [],
        //   checkedTel:[],
        //   checkAll: false,
        //   isIndeterminate: true,
        //   mercSeq: ''
        // },
        editForm:{ //修改弹窗
          name: '',
          account: '',
          selectVal1: '',
          selectVal2: '',
          mercSeq: ''
        },
      };
    },
    mounted(){
      this.tableInit();
      //请求权限数据
      commonAjax('/merchantpackage/getMerchantPackageList', 'post').then(res => {
        if (res.resultCode  == 0) {
          let tableData = res.dataInfo;
          let that = this;
          tableData.map(function(currentValue,index){
            var obj = {
              "packSeq": currentValue.packSeq,
              "packName": currentValue.packName
            }
            that.configOptions.push(obj);
          })
        } else {
          this.$message({
              type: 'error',
              message: '权限数据请求有误'
          });
        }
      });
      //请求客户姓名下拉
      commonAjax('/merchant/getMerchantList', 'post').then(res => {
        if (res.resultCode  == 0) {
          let tableData = res.dataInfo;
          let that = this;
          tableData.map(function(currentValue,index){
            var obj = {
              "mercSeq": currentValue.mercSeq,
              "mercName": currentValue.mercName,
              "phone": currentValue.mercBusinessEntityContactPhone
            }
            that.nameOptions.push(obj);
          })
        } else {
          this.$message({
              type: 'error',
              message: '客户姓名数据请求有误'
          });
        }
      });

      // //可选权限模块
      // commonAjax('/merchantauth/getMerchantAuthList', 'post').then(res => {
      //   if (res.resultCode  == 0) {
      //     let that = this;
      //     this.editForm.telArr = res.dataInfo;
      //     this.editForm.telArr.map(function(currentValue,index){
      //       that.editForm.telOptions.push(currentValue.authName);
      //     })
          
      //   } else {
      //     this.$message({
      //         type: 'error',
      //         message: '权限数据请求有误'
      //     });
      //   }
      // });
    },
    methods: {
      idconfig(){
        this.$router.push('/merConfigMan');
      },
      handleEdit(index,row){
        this.editForm.name = row.MERC_NAME;
        this.editForm.account = row.ACCOUNT;
        this.editForm.selectVal1 = row.PACK_SEQ;
        this.editForm.selectVal2 = row.PACK_SEQ;
        this.editForm.mercSeq = row.MERC_SEQ;
      },
      // handleEdit(index,row){
      //   this.editForm.mercSeq = row.MERC_SEQ;
      // },
      handleReset(index,row){
          console.log(row)
          let mercSeq = row.MERC_SEQ;
          let password = row.PHONE;
          password = password.slice(5);
          password = md5(password);
          let paramsForm = {
            mercSeq: mercSeq,
            password: password
          }
          commonAjax('/merchant/resetPassword', 'post',paramsForm).then(res => {
          if (res.resultCode  == 0) {
            this.$message({
                type: 'success',
                message: '重置密码成功'
            });
          } else {
            this.$message({
                type: 'error',
                message: '重置密码失败'
            });
          }
        });
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
        commonAjax('/merchant/mercPermission', 'post',paramsForm).then(res => {
          if (res.resultCode  == 0) {
            that.tableCount = res.count;
            that.tableData = res.dataInfo;
          } else {
            this.$message({
                type: 'error',
                message: '表格数据初始化有误'
            });
          }
        });
      },
      batchDelete(){
        let selectionData = this.$refs.multipleTable.selection;
        if(selectionData.length==0){
          this.$message({
              type: 'error',
              message: '请选择需要批量删除的数据'
          });
        }else{
          let mercSeq = [];
          let packSeq = [];
          selectionData.map(function(currentValue,index){
            mercSeq.push(currentValue.MERC_SEQ);
            packSeq.push(currentValue.PACK_SEQ);
          })
          let paramsForm = {
            mercSeq: mercSeq,
            packSeq: packSeq
          }
          let params = new URLSearchParams();
          params.append('mercSeq', mercSeq);
          params.append('packSeq', packSeq);
          axios.post('http://192.168.1.251:9001/agent.call/merchantpackage/delMercPremission', params, ).then(res => {
            console.log(res)
          if (res.data.resultCode  == 0) {
            this.$message({
                type: 'success',
                message: '删除成功'
            });
          } else {
            this.$message({
                type: 'error',
                message: '删除失败'
            });
          }
          this.tableInit(this.currentPage);
          }).catch(err => {
              console.log(err);
          })
        }
      },
      newAddConfirm(){
        let mercSeq = this.newAddForm.selectVal1;
        let mercAccount = this.newAddForm.account;
        let packSeq = this.newAddForm.selectVal2;
        let password = '';
        let that = this;
        console.log(this.newAddForm);
        this.nameOptions.map(function(currentValue,index){
          if(currentValue.mercSeq == mercSeq){
            password = currentValue.phone;
          }
        })
        password = password.slice(5);
        password = md5(password);
        if(mercSeq){
          if(mercAccount){
            if(packSeq){
              let paramsForm = {
                mercSeq: mercSeq,
                mercAccount: mercAccount,
                packSeq: packSeq,
                password: password
              }  
              commonAjax('/merchant/addOrdinaryAgent', 'post',paramsForm).then(res => {
                if (res.resultCode  == 0) {
                  this.$message({
                      type: 'success',
                      message: '新增商户成功'
                  });
                  this.tableInit();
                  that.newAddForm =  {//新增商户弹窗
                    phone: '',
                    account: '',
                    selectVal1: '',
                    selectVal2: ''
                  }
                } else {
                  this.$message({
                      type: 'error',
                      message: '新增商户失败'
                  });
                }
              });
            }else{
              this.$message({
                  type: 'error',
                  message: '请选择权限'
              });
            }
          }else{
            this.$message({
                type: 'error',
                message: '请输入商户账号'
            });
          }
        }else{
          this.$message({
              type: 'error',
              message: '请选择商户姓名'
          });
        }
      },
      search(){
        let that = this;
        let paramsForm = {
          nameOrSeq: this.topBtnGroupForm.name,
          premissionSeq: this.topBtnGroupForm.selectVal,
        }
        // this.currentPage = 1;
        commonAjax('/merchant/mercPermission', 'post',paramsForm).then(res => {
          console.log(res)
          if (res.resultCode  == 0) {
            that.tableCount = res.count;
            that.tableData = res.dataInfo;
          } else {
            this.$message({
                type: 'error',
                message: '数据搜索有误'
            });
          }
        });
      },
      // handleCheckAllChange(val) {
      //   this.editForm.checkedTel = val ? this.editForm.telOptions : [];
      //   this.editForm.isIndeterminate = false;
      // },
      // handleCheckedTelChange(value) {
      //   let checkedCount = value.length;
      //   this.editForm.checkAll = checkedCount === this.editForm.telArr.length;
      //   this.editForm.isIndeterminate = checkedCount > 0 && checkedCount < this.editForm.telArr.length;
      // },
      // editConfirm(){
      //   let that = this;
      //   let packSeq= [];
      //   if(this.editForm.checkedTel.length>0){
      //     this.editForm.checkedTel.map(function(currentValue,index){
      //       that.editForm.telArr.map(function(currentValue1,index1){
      //         if(currentValue == currentValue1.authName){
      //           packSeq.push(currentValue1.authSeq);
      //         }
      //       })
      //     })
      //   }
      //   let params = new URLSearchParams();
      //   params.append('packSeq', packSeq);
      //   params.append('mercSeq', this.editForm.mercSeq);
      //   axios.post('http://192.168.1.142:8080/merchant/modifiedResource', params, ).then(res => {
      //     console.log(res)
      //     if (res.data.resultCode  == 0) {
      //       this.$message({
      //           type: 'success',
      //           message: '修改成功'
      //       });
          
      //     } else {
      //       this.$message({
      //           type: 'error',
      //           message: '修改失败'
      //       });
      //     }
      //   }).catch(err => {
      //       console.log(err);
      //   })
      // }
      editConfirm(){
        let that = this;
        let paramsForm = {
          mercSeq: this.editForm.mercSeq,
          sourceSeq: this.editForm.selectVal1,
          packSeq: this.editForm.selectVal2
        }
        commonAjax('/merchant/modifiedResource', 'post',paramsForm).then(res => {
          if (res.resultCode  == 0) {
            this.$message({
                type: 'success',
                message: '修改成功'
            });
            that.currentPage = 1;
            this.tableInit();
          } else {
            this.$message({
                type: 'error',
                message: '修改失败'
            });
          }
        });
      }
    }
  };
</script>

<style lang="scss">
  #MerConfig{
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
        width: 152px;
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

