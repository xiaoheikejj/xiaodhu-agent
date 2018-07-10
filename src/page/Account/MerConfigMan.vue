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
          <el-input v-model="topBtnGroupForm.name" maxlength="30" placeholder="请输入角色名称" clearable></el-input>
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
    <!-- 新增权限角色-弹窗 -->
    <el-dialog class="dialog checked" title="新增权限角色" :visible.sync="newAdd" width="400px" @open="aa">
      <el-form :model="newAddForm">
        <el-form-item label="角色名称：" style="margin-bottom:6px;">
          <el-input v-model="newAddForm.name" style="width:256px;" placeholder="请输入权限名称" maxlength="30" clearable></el-input>
        </el-form-item>
          <el-form-item style="margin-bottom:6px;">
            <div>请选择功能模块：</div>
          </el-form-item>
          <el-form-item>
          <el-tree
            :data="treeList"
            ref="tree3"
            show-checkbox
            highlight-current
            default-expand-all
            node-key="authSeq"
            :default-checked-keys="editChecked1"
            :props="defaultProps">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newAdd = false">取 消</el-button>
        <el-button type="primary" @click="newAdd = false; newAddConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改-弹窗 -->
    <el-dialog class="dialog checked" title="修改" :visible.sync="edit" width="400px">
      <el-form :model="editForm">
        <el-form-item style="margin-bottom:6px;">
          <div>请选择功能模块：</div>
        </el-form-item>
        <el-form-item>
          <el-tree
            :data="treeList"
            ref="tree1"
            show-checkbox
            highlight-current
            default-expand-all
            node-key="authSeq"
            :default-checked-keys="editChecked"
            :props="defaultProps">
          </el-tree>
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
import { baseUrl, Ajax } from "../../assets/api/api";
import axios from "axios";
export default {
  data() {
    return {
      treeList: [],
      defaultProps: {
        children: "tblMerchantResource",
        label: "authName"
      },
      editChecked: [],
      editChecked1: [],
      name: "",
      topBtnGroupForm: {
        name: ""
      },
      edit: false,
      newAdd: false,
      tableData: [],
      tableCount: 0,
      pageSize: 10,
      currentPage: 1,
      editForm: {
        //修改弹窗
        checkedTel: [],
        telArr: [],
        telOptions: [],
        checkedTel: [],
        checkAll: false,
        isIndeterminate: true
      },
      editMercSeq: "",
      newAddForm: {
        name: ""
      },
      newAddBtn: true
    };
  },
  mounted() {
    this.tableInit();
    //可选权限模块
    Ajax("/merchantauth/getMenuResource", "post").then(res => {
      this.treeList = res[0];
    });
  },
  methods: {
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.tableInit(this.currentPage);
    },
    aa(){
      if(this.newAddBtn){
        this.newAddForm.name = ''; 
      }
    },
    returnRouter() {
      this.$router.push("/merConfig");
    },
    idconfig() {
      this.$router.push("/idConfig");
    },
    handleEdit(index, row) {
      let that = this;
      this.editMercSeq = row.packSeq;
      if (row.authList.length > 0) {
        this.editChecked = [];
        row.authList.map(function(currentValue, index) {
          that.editChecked.push(currentValue.authSeq);
        });
      }
    },
    handleCurrentChange(val) {
      this.tableInit(val);
    },
    tableInit(page) {
      let that = this;
      let paramsForm = {
        page: this.currentPage,
        size: this.pageSize,
        name: this.topBtnGroupForm.name
      };
      Ajax("/merchantpackage/mercPermissionCfg", "post", paramsForm).then(
        res => {
          if (res.status == 0) {
            that.tableCount = res.count;
            that.tableData = res.dataInfo;
          } else {
            this.$message({
              type: "error",
              message: "表格数据初始化有误"
            });
          }
        }
      );
    },
    search() {
      let that = this;
      let paramsForm = {
        page: this.currentPage,
        size: this.pageSize,
        name: this.topBtnGroupForm.name
      };
      Ajax("/merchantpackage/mercPermissionCfg", "post", paramsForm).then(
        res => {
          if (res.status == 0) {
            that.tableCount = res.count;
            that.tableData = res.dataInfo;
            that.currentPage = 1;
          } else {
            this.$message({
              type: "error",
              message: "表格数据初始化有误"
            });
          }
        }
      );
    },
    editConfirm() {
      let that = this;
      let groupSeq = this.editMercSeq;
      let arr = this.$refs.tree1.getCheckedNodes();
      let resourceSeq = [];
      arr.map(function(currentValue, index) {
        resourceSeq.push(currentValue.authSeq);
      });
      if (resourceSeq.length > 0) {
        let params = new URLSearchParams();
        params.append("resourceSeq", resourceSeq);
        params.append("groupSeq", groupSeq);
        axios
          .post(baseUrl + "/merchantpackage/modifiedPackageResource", params)
          .then(res => {
            if (res.data.status == 0) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.tableInit(this.currentPage);
            } else {
              this.$message({
                type: "error",
                message: "修改失败"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$message({
          type: "error",
          message: "至少选择一个功能模块"
        });
      }
    },
    newAddConfirm() {
      this.newAddBtn = false;
      let that = this;
      let arr = this.$refs.tree3.getCheckedNodes();
      let resourceSeq = [];
      let packageName = this.newAddForm.name;
      arr.map(function(currentValue, index) {
        resourceSeq.push(currentValue.authSeq);
      });
      if (packageName) {
        if (resourceSeq.length > 0) {
          let params = new URLSearchParams();
          params.append("resourceSeq", resourceSeq);
          params.append("packageName", packageName);
          axios
            .post(
              baseUrl + "/merchantpackage/addMerchantPackageResource",
              params
            )
            .then(res => {
              if (res.data.status == 0) {
                this.$message({
                  type: "success",
                  message: "新增成功"
                });
                this.tableInit(this.currentPage);
                this.editChecked1 = [];
                this.newAddForm.name = ''; 
              } else {
                this.$message({
                  type: "error",
                  message: "新增失败"
                });
                this.newAdd = true;
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message({
            type: "error",
            message: "至少选择一个功能模块"
          });
          this.newAdd = true;
        }
      } else {
        this.$message({
          type: "error",
          message: "请输入角色名称"
        });
        this.newAdd = true;
      }
    }
  }
};
</script>
