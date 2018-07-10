<template lang="html">
    <div id="NewAddMerchants" style="width:100%;">
        <div class="main-hd">
          <div class="hd-title">新增商户</div>
        </div>
        <div class="router-title">
          <ul>
            <li class="active">企业用户</li>
            <li>|</li>
            <li >个人用户</li>
          </ul>
        </div>
        <div>{{companyForm.path}}</div>
        <div class="company-form-box">
          <el-form id="upImgForm" class="company-form" ref="companyForm" :model="companyForm" label-width="240px">
            <el-form-item label="企业名称：">
              <el-input v-model="companyForm.name1" style="width:320px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="企业所在地：">
              <el-select  ref="companyForm" v-model="companyForm.name2" placeholder="省" style="width:158px;" @change="selectProvince" clearable>
                <el-option :key="item.areaId" :label="item.areaName" :value="item.areaId" v-for="item in provinceArr"></el-option>
              </el-select>
              <el-select v-model="companyForm.name3" placeholder="市" style="width:158px;"  @change="selectCity" clearable>
                <el-option :key="item.areaId" :label="item.areaName" :value="item.areaId" v-for="item in cityArr"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属行业：">
              <el-select v-model="companyForm.name4" placeholder="请选择" style="width:320px;" clearable>
                <el-option :key="item.code" :label="item.value" :value="item.orderno" v-for="item in companyForm.options3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="营业执照号/统一社会信用代码：">
              <el-input v-model="companyForm.name5"  style="width:320px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="企业法人姓名：">
              <el-input v-model="companyForm.name6"  style="width:320px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="企业法人身份证号：">
              <el-input v-model="companyForm.name7" style="width:320px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="企业联系人姓名：">
              <el-input v-model="companyForm.name8" style="width:320px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="企业联系人电话：">
              <el-input v-model="companyForm.name9" style="width:320px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="企业邮箱：">
              <el-input v-model="companyForm.name10" style="width:320px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="资料上传：">
              <div class="uploadImg">
                    <input type="file" :name="'file' + index" v-for='(i, index) in fileNum' @click='addFile'>
                </div>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
            <el-form-item label="" style="margin-top:40px;">
              <el-button type='primary' @click='submit' size="medium">确定</el-button>
              <el-button type="info" size="medium" style="margin-left:40px;">返回</el-button>
            </el-form-item>
          </el-form>
        </div>        
    </div>
</template>

<script>
import axios from 'axios';
import {commonAjax} from "../../api/api";
export default {
    data() {
        return {
          companyForm:{
            name1: '',
            name2: '',
            name3: '',
            name4: '',
            name5: '',
            name6: '',
            name7: '',
            name8: '',
            name9: '',
            name10: '',
            options3:[],
            path: '',
            cityName: ''
          },
          provinceArr: [],
          cityArr: [],
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
          limit:4,
          dialogImageUrl: '',
          dialogVisible: false,
          provinceLists: [],
          provinceVal: '',
          cityLists: [],
          cityVal: '',
          industryLists: [], //行业列表
          industryVal: '',
          changeProName: '', //改变省的名字
          changeCityName: '', //改变市的名字
          changeIndName: '',   //改变行业的名字
          proID: '',   //省的id
          cityID: '',      //市的id
          indID: '',      //行业的id
          fileNum: 1,
          fileUrl: ''
        }
    },
    created: function() {
      //获取所属行业
      commonAjax('/sysdicttreedata/getCategory', 'post').then(res => {
        if (res.length > 0) {
          this.companyForm.options3 = res;
        } else {
          this.$message({
              type: 'error',
              message: '权限数据请求有误'
          });
        }
      });
  
      //获取省
      commonAjax('/areacode/getProvince', 'post').then(res => {
        let that = this;
        if(res.length>0){
          let data = [];
          res.map(function(currentValue,index){
            var obj = {
              "areaName": currentValue.areaName,
              "areaId": currentValue.areaId
            }
            data.push(obj);
          })
          this.provinceArr = data;
        }
      });
      
    },
    methods:{
       handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleSuccess(res, file){
        this.companyForm.path += ','+res[0];
        console.log(this.companyForm.path)
      },
      handleError(){

      },
      submit(){
        var that = this;
        var formData = new FormData($("#upImgForm")[0]);
        $.ajax({
            url: 'http://192.168.1.251:8080/upload/fileupload',
            type: 'POST',
            data: formData,
            async: false,
            dataType: 'json',
            contentType: false,
            processData:false,
            success: function(res) {
                res.pop();      //删除null
                that.fileUrl = res.join(',');
            },
            error: function(err) {
                console.log(err);
            }
        })
        // this.$refs.upload.submit();
        let path = this.companyForm.path;
        // path = path.join();
        let mercName = this.companyForm.name1;
        let mercProvince = this.companyForm.name2;
        let mercCity = this.companyForm.name3;
        let mercIndustry = this.companyForm.name4;
        let mercBusinessLicense = this.companyForm.name5;
        let mercBusinessEntityName = this.companyForm.name6;
        let mercBusinessId = this.companyForm.name7;
        let mercBusinessEntityContactName = this.companyForm.name8;
        let mercBusinessEntityContactPhone = this.companyForm.name9;
        let mercBusinessMail = this.companyForm.name10;
        let mercBusinessLicensePic = this.fileUrl;
        let provinceName = '';
        let industryName = '';

        this.provinceArr.map(function(currentValue,index){
          if(currentValue.areaId == mercProvince){
              provinceName = currentValue.areaName;
          }
        })

        this.companyForm.options3.map(function(currentValue,index){
          console.log(mercIndustry+'---'+currentValue.orderno)
          if(currentValue.orderno == mercIndustry){
              industryName = currentValue.value;
          }
        })
        let cityName = this.companyForm.cityName;

        let paramsForm = {
          mercName: mercName,
          mercProvince: mercProvince,
          mercCity: mercCity,
          mercIndustry: mercIndustry,
          mercBusinessLicense: mercBusinessLicense,
          mercBusinessEntityName: mercBusinessEntityName,
          mercBusinessId: mercBusinessId,
          mercBusinessEntityContactName: mercBusinessEntityContactName,
          mercBusinessEntityContactPhone: mercBusinessEntityContactPhone,
          mercBusinessMail: mercBusinessMail,
          mercBusinessLicensePic: mercBusinessLicensePic,
          provinceName: provinceName,
          provinceName: provinceName,
          industryName: industryName,
          cityName: cityName
        }

        commonAjax('/merchant/addMerchant', 'post', paramsForm).then(res => {
          if (res.resultCode  == 0) {
            this.$message({
                type: 'success',
                message: 'success'
            });
          } else {
            this.$message({
                type: 'error',
                message: '表格数据初始化有误'
            });
          }
        });
      },
      selectProvince(item){
        let paramsForm = {
          areaId: this.companyForm.name2
        }
        commonAjax('/areacode/getCity', 'post', paramsForm).then(res => {
          this.cityArr = res;
        });
      },
      selectCity(){
        // this.companyForm.cityName = 
        let that = this;
        let cityId = this.companyForm.name3;
        this.cityArr.map(function(currentValue,index){
          if(currentValue.areaId == cityId){
              that.companyForm.cityName = currentValue.areaName;
          }
        })
      },
      addFile: function() {
        this.fileNum += 1;
      },
    }
}
</script>

<style lang="scss">
  #NewAddMerchants{
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
    }

    .router-title{
      padding: 20px 0;;
      background-color: #fff;
      margin-top: 20px;
      text-align: center;
      ul{
        display: inline-block;
        line-height: 20px;
        font-size: 0;
      }
      li{
        display: inline-block;
        color:#606266;
        cursor: pointer;
        padding: 6px 6px;
        margin: 0 4px;
        letter-spacing: 1px;
        font-size: 18px;
        &.active{
          color: #409EFF;
          border-bottom: 1px solid #409EFF;
        }
      }
    }
    .company-form-box{
      flex: 1;
      background-color: #fff;
      .company-form{
        width: 800px;
        margin: 0 auto;
        background-color: #fff;
        padding: 15px 20px;
      }
    }
  }
</style>
