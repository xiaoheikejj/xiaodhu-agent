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
        <el-form-item label="名称：" style="margin-bottom:0;">
          <el-input v-model="topBtnGroupForm.name" placeholder="请输入名称" maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户角色权限" style="margin-bottom:0;">
          <el-select v-model="topBtnGroupForm.selectVal" placeholder="请选择用户角色权限" clearable>
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
              type="text"
              @click="handleEdit(scope.$index, scope.row);edit = true">修改</el-button>
            <el-button
              type="text"
              @click="handleReset(scope.$index, scope.row)">重置密码</el-button>
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
    <!-- 新增商户-弹窗 -->
    <el-dialog class="dialog" title="新增商户" :visible.sync="newAdd" width="344px" @open="newAddClose">
      <el-form :model="newAddForm" ref="newAddForm" >
        <el-form-item label="商户姓名：">
          <el-select v-model="newAddForm.selectVal1" placeholder="请输入商户姓名" style="width:200px;">
            <el-option
              v-for="item in nameOptions"
              :key="item.mercSeq"
              :label="item.mercName"
              :value="item.mercSeq">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户账号：">
          <el-input v-model="newAddForm.account" placeholder="请输入商户账号" maxlength="30" style="width:200px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="权限选择：">
          <el-select v-model="newAddForm.selectVal2" placeholder="请选择权限" style="width:200px;" clearable>
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
        <el-button @click="newAdd = false;">取 消</el-button>
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
  </div>
</template>

<script>
import {baseUrl,Ajax} from "../../assets/api/api";
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
          selectVal2: '',
          reset: true
        },
        newAddFormNew:{
          phone: '',
          account: '',
          selectVal1: '',
          selectVal2: '',
          reset: true
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
        pageSize: 10,
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
      Ajax('/merchantpackage/getMerchantPackageList', 'post').then(res => {
        if (res.status  == 0) {
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
      Ajax('/merchant/getMerchantList', 'post').then(res => {
        if (res.status  == 0) {
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
    },
    methods: {
      handleSizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.tableInit(this.currentPage);
      },
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
      handleReset(index,row){
        this.$confirm('您是否要重置密码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          //确定
          let mercSeq = row.MERC_SEQ;
          let password = row.PHONE;
          password = password.slice(5);
          password = md5(password);
          let paramsForm = {
            mercSeq: mercSeq,
            password: password
          }
          Ajax('/merchant/resetPassword', 'post',paramsForm).then(res => {
            if (res.status  == 0) {
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
        }).catch(() => {
            //取消
        })
      },
      handleCurrentChange(val) {
        this.tableInit(val);
      },
      handleVisit(index,row){
        this.$refs.multipleTable.toggleRowSelection(index,true);
      },
      tableInit(page){
        let that = this;
        let paramsForm = {
          page: this.currentPage,
          size: this.pageSize,
          nameOrSeq: this.topBtnGroupForm.name,
          premissionSeq: this.topBtnGroupForm.selectVal,
        }
        Ajax('/merchant/mercPermission', 'post',paramsForm).then(res => {
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
      batchDelete(){
        this.$confirm('您是否要删除当前选中数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          //确定
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
            axios.post(baseUrl+'/merchantpackage/delMercPremission', params, ).then(res => {
            if (res.data.status  == 0) {
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
        }).catch(() => {
            //取消
        })
      },
      newAddClose(){
        if(this.newAddForm.reset){
          this.newAddForm = Object.assign({}, this.newAddFormNew)
        }
      },
      newAddConfirm(){
        this.newAddForm.reset = false;
        let mercSeq = this.newAddForm.selectVal1;
        let mercAccount = this.newAddForm.account;
        let packSeq = this.newAddForm.selectVal2;
        let password = '';
        let that = this;
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
              Ajax('/merchant/addOrdinaryAgent', 'post',paramsForm).then(res => {
                if (res.status  == 0) {
                  this.$message({
                      type: 'success',
                      message: '新增商户成功'
                  });
                  that.newAddForm.reset = true;
                  this.tableInit(that.currentPage);
                  Ajax('/merchant/getMerchantList', 'post').then(res => {
                    this.nameOptions = [];
                    if (res.status  == 0) {
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
                }else if(res.status  == 1){
                  this.$message({
                      type: 'error',
                      message: res.errorMsg
                  });
                }else {
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
        this.currentPage = 1;
        let paramsForm = {
          page: this.currentPage,
          size: this.pageSize,
          nameOrSeq: this.topBtnGroupForm.name,
          premissionSeq: this.topBtnGroupForm.selectVal,
        }
        this.tableInit(this.currentPage);
      },
      editConfirm(){
        let that = this;
        let paramsForm = {
          mercSeq: this.editForm.mercSeq,
          sourceSeq: this.editForm.selectVal1,
          packSeq: this.editForm.selectVal2
        }
        Ajax('/merchant/modifiedResource', 'post',paramsForm).then(res => {
          if (res.status  == 0) {
            this.$message({
                type: 'success',
                message: '修改成功'
            });
            this.tableInit(this.currentPage);
          } else {
            this.$message({
                type: 'error',
                message: '修改失败'
            });
          }
        });
      },
    }
  };
</script>
