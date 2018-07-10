<template>
  <div id="MerConfigMan" style="width:100%;">
    <div class="main-hd">
      <div class="hd-title"><div class="icon-return" @click="returnRouter"></div>权限配置</div>
      <div class="hd-btnGroup">
        <el-button type="primary" @click="newAdd = true">新增权限角色</el-button>
      </div>
    </div>
    <div class="top-btnGroup">
      <el-form ref="topBtnGroup" :inline="true" :model="topBtnGroupForm">
        <el-form-item label="角色名称：" style="margin-bottom:0;">
          <el-input v-model="topBtnGroupForm.name" clearable></el-input>
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
          type="index">
        </el-table-column>
        <el-table-column
          prop="packSeq"
          label="用户编号">
        </el-table-column>
        <el-table-column
          prop="packName"
          label="用户名称">
        </el-table-column>
        <el-table-column
          label="用户权限角色">
          <template slot-scope="scope">
            <div :key="item.authSeq" v-for="item in scope.row.authList" style="display:inline-block;padding: 0 10px;">{{item.authName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="text"
              @click="handleEdit(scope.$index, scope.row);edit = true">修改</el-button>
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
    <!-- 新增权限角色-弹窗 -->
    <el-dialog class="dialog" title="新增权限角色" :visible.sync="newAdd" width="400px">
      <el-form :model="newAddForm">
        <el-form-item label="角色名称">
          <el-input v-model="newAddForm.name" style="width:270px;" clearable></el-input>
        </el-form-item>
        <div>请选择功能模块：</div>
        <el-form-item style="margin-bottom:0;">
          <el-checkbox @change="handleCheckAllChange1">全选</el-checkbox>
        </el-form-item>
          <el-checkbox-group v-model="newAddForm.checkedTel" @change="handleCheckedTelChange1">
            <el-row :gutter="20">
              <el-col :span="8" :key="item.authSeq" v-for="item in newAddForm.telArr">
                <el-checkbox :label="item.authName"  :value='item.authSeq'></el-checkbox>
              </el-col>
            </el-row>  
          </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newAdd = false">取 消</el-button>
        <el-button type="primary" @click="newAdd = false; newAddConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改-弹窗 -->
    <el-dialog class="dialog" title="修改" :visible.sync="edit" width="400px">
      <el-form :model="editForm">
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
    </el-dialog>
  </div>
</template>

<script>
import {commonAjax} from "../../api/api";
import axios from 'axios';
  export default {
    data() {
      return {
        name: '',
        topBtnGroupForm:{
          name: ''
        },
        edit:false,
        newAdd:false,
        tableData: [],
        tableCount: 0,
        currentPage: 1,
        editForm:{ //修改弹窗
          checkedTel:[],
          telArr: [],
          telOptions: [],
          checkedTel:[],
          checkAll: false,
          isIndeterminate: true,
        },
        editMercSeq: '',
        newAddForm:{ //修改弹窗
          checkedTel:[],
          telArr: [],
          telOptions: [],
          checkedTel:[],
          checkAll: false,
          isIndeterminate: true,
          name: ''
        },
      };
    },
    mounted(){
      this.tableInit();
      //可选权限模块
      commonAjax('/merchantauth/getMerchantAuthList', 'post').then(res => {
        if (res.resultCode  == 0) {
          let that = this;
          this.editForm.telArr = res.dataInfo;
          this.newAddForm.telArr = res.dataInfo;
          this.editForm.telArr.map(function(currentValue,index){
            that.editForm.telOptions.push(currentValue.authName);
            that.newAddForm.telOptions.push(currentValue.authName);
          })
          
        } else {
          this.$message({
              type: 'error',
              message: '权限数据请求有误'
          });
        }
      });
    },
    methods: {
      returnRouter(){
        this.$router.push('/merConfig');
      },
      idconfig(){
        this.$router.push('/idConfig');
      },
      handleEdit(index,row){
        this.editMercSeq = row.packSeq;
      },
      handleCurrentChange(val) {
        this.tableInit(val);
      },
      handleVisit(index,row){
        console.log(row)
        this.$refs.multipleTable.toggleRowSelection(index,true);
      },
      tableInit(page){
        let that = this;
        let paramsForm = {
          page: page,
          size: 10
        }
        commonAjax('/merchantpackage/mercPermissionCfg', 'post',paramsForm).then(res => {
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
      search(){
        let that = this;
        let paramsForm = {
          name: this.topBtnGroupForm.name,
        }
        commonAjax('/merchantpackage/mercPermissionCfg', 'post',paramsForm).then(res => {
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
        // // this.currentPage = 1;
        // commonAjax('/merchant/mercPermission', 'post',paramsForm).then(res => {
        //   console.log(res)
        //   if (res.resultCode  == 0) {
        //     that.tableCount = res.count;
        //     that.tableData = res.dataInfo;
        //   } else {
        //     this.$message({
        //         type: 'error',
        //         message: '数据搜索有误'
        //     });
        //   }
        // });
      },
       handleCheckAllChange(val) {
        this.editForm.checkedTel = val ? this.editForm.telOptions : [];
        this.editForm.isIndeterminate = false;
      },
       handleCheckAllChange1(val) {
        this.newAddForm.checkedTel = val ? this.newAddForm.telOptions : [];
        this.newAddForm.isIndeterminate = false;
      },
      handleCheckedTelChange(value) {
        let checkedCount = value.length;
        this.editForm.checkAll = checkedCount === this.editForm.telArr.length;
        this.editForm.isIndeterminate = checkedCount > 0 && checkedCount < this.editForm.telArr.length;
      },
      handleCheckedTelChange1(value) {
        let checkedCount = value.length;
        this.newAddForm.checkAll = checkedCount === this.newAddForm.telArr.length;
        this.newAddForm.isIndeterminate = checkedCount > 0 && checkedCount < this.newAddForm.telArr.length;
      },
      editConfirm(){
        let that = this;
        let resourceSeq= [];
        let groupSeq = this.editMercSeq;
        if(this.editForm.checkedTel.length>0){
          this.editForm.checkedTel.map(function(currentValue,index){
            that.editForm.telArr.map(function(currentValue1,index1){
              if(currentValue == currentValue1.authName){
                resourceSeq.push(currentValue1.authSeq);
              }
            })
          })
        }
        if(resourceSeq.length>0){
          let params = new URLSearchParams();
          params.append('resourceSeq', resourceSeq);
          params.append('groupSeq', groupSeq);
          axios.post('http://192.168.1.251:9001/agent.call/merchantpackage/modifiedPackageResource', params, ).then(res => {
            if (res.data.resultCode  == 0) {
              this.$message({
                  type: 'success',
                  message: '修改成功'
              });
              this.tableInit();
            } else {
              this.$message({
                  type: 'error',
                  message: '修改失败'
              });
            }
          }).catch(err => {
              console.log(err);
          })
        }else{
          this.$message({
              type: 'error',
              message: '至少选择一个功能模块'
          });
        }
      },
      newAddConfirm(){
        let that = this;
        let resourceSeq= [];
        let packageName = this.newAddForm.name;
        if(this.newAddForm.checkedTel.length>0){
          this.newAddForm.checkedTel.map(function(currentValue,index){
            that.newAddForm.telArr.map(function(currentValue1,index1){
              if(currentValue == currentValue1.authName){
                resourceSeq.push(currentValue1.authSeq);
              }
            })
          })
        }
        if(packageName){
          if(resourceSeq.length>0){
            let params = new URLSearchParams();
            params.append('resourceSeq', resourceSeq);
            params.append('packageName', packageName);
            axios.post('http://192.168.1.251:9001/agent.call/merchantpackage/addMerchantPackageResource', params, ).then(res => {
              console.log(res)
              if (res.data.resultCode  == 0) {
                this.$message({
                    type: 'success',
                    message: '新增成功'
                });
              
              } else {
                this.$message({
                    type: 'error',
                    message: '新增失败'
                });
              }
            }).catch(err => {
                console.log(err);
            })
          }else{
            this.$message({
              type: 'error',
              message: '至少选择一个功能模块'
           });
          }
        }else{
          this.$message({
              type: 'error',
              message: '请输入角色名称'
          });
        }
      }
    }
  };
</script>

<style lang="scss">
  #MerConfigMan{
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
        position: relative;
        text-indent: 40px;
        .icon-return{
          width: 40px;
          height: 40px;
          position: absolute;
          top: 10px;
          left: 0;
          background: url(/static/images/return.png) no-repeat center 2px / 36px auto;
          cursor: pointer;
        }
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

    .el-dialog__header {
        border-bottom: 1px solid #E4E7ED;
    }

    .el-dialog__body{
      padding: 20px 30px;
    } 
  }
</style>

