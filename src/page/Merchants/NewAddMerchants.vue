<template lang="html">
    <div id="NewAddMerchants">
      <el-form id="upImgForm" class="company-form" :rules="rules" ref="ruleForm" :model="ruleForm" label-width="240px">
        <el-form-item label="企业名称：" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入企业名称" style="width:320px;" maxlength="40" clearable></el-input>
        </el-form-item>
        <el-form-item label="企业所在地：" required style="margin-bottom:0">
          <div style="display:inline-block">
            <el-form-item prop="province">
              <el-select ref="province1" v-model="ruleForm.province" placeholder="省" style="width:158px;" @change="selectProvince" clearable>
                <el-option :key="item.areaId" :label="item.areaName" :value="item.areaName" v-for="item in provinceArr"></el-option>
              </el-select>
            </el-form-item>
          </div>
           <div style="display:inline-block">
             <el-form-item prop="city">
               <el-select v-model="ruleForm.city" placeholder="市" style="width:158px;"  @change="selectCity" clearable>
                <el-option :key="item.areaId" :label="item.areaName" :value="item.areaName" v-for="item in cityArr"></el-option>
              </el-select>
             </el-form-item>
           </div>
        </el-form-item>
        <el-form-item label="所属行业：" prop="industry">
          <el-select v-model="ruleForm.industry" placeholder="请选择所属行业" style="width:320px;" @change="selectIndustry" clearable>
            <el-option :key="item.code" :label="item.value" :value="item.value" v-for="item in industryArr"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营业执照号：" prop="license">
          <el-input v-model="ruleForm.license" placeholder="请输入15位或18位的营业执照号"  maxlength="18" style="width:320px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="法人姓名：" prop="legal">
          <el-input v-model="ruleForm.legal" placeholder="请输入企业法人姓名" style="width:320px;" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="法人身份证号码：" prop="legalID">
          <el-input v-model="ruleForm.legalID" placeholder="请输入企业法人身份证" style="width:320px;" clearable maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名：" prop="linkman">
          <el-input v-model="ruleForm.linkman" placeholder="请输入企业联系人姓名" style="width:320px;" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系人手机号：" prop="linkmanPhone">
          <el-input v-model="ruleForm.linkmanPhone" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入企业联系人电话" style="width:320px;" clearable maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="ruleForm.email" placeholder="请输入企业邮箱" style="width:320px;" maxlength="50" clearable></el-input>
        </el-form-item>
        <el-form-item label="资料上传：" prop="img">
          <el-upload
            :action="uploadUrl"
            ref="upload"
            :before-upload="beforeAvatarUpload"
            :multiple="false"
            :limit="limit"
            list-type="picture-card"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :auto-upload="true">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="" style="margin-top:40px;">
          <el-button type='primary' @click="submit('ruleForm')">确 定</el-button>
          <el-button type="info" style="margin-left:40px;" @click="fanhui">返 回</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
import axios from "axios";
import { baseUrl, Ajax } from "../../assets/api/api";
import {validateEmail,isPoneAvailable,validateIdNum} from "../../util/validate";
export default {
  data() {
    const isLicense = (rule, value, callback) => {
        if(value === ''){
            callback(new Error('请输入营业执照号'));
        }else if(value.length < 15 || value.length > 18){
            callback(new Error('长度为15或18位'));
        }else {
          callback();
        }
    };
    const isImg = (rule, value, callback) => {
        if(this.mercBusinessLicensePic.length==0){
            callback(new Error('请至少上传一张图片'));
        }else {
          callback();
        }
    };
    const validateEmail1 = (rule, value, callback) => {
        if(value === ''){
            callback(new Error('请输入邮箱'));
        }else if(!validateEmail(value)){
            callback(new Error('请输入正确格式的邮箱地址'));
        }else {
          callback();
        }
    };
    const isPoneAvailable1 = (rule, value, callback) => {
        if(value === ''){
            callback(new Error('请输入联系人手机号'));
        }else if(!isPoneAvailable(value)){
            callback(new Error('请输入正确格式的手机号码'));
        }else {
          callback();
        }
    };
    const validateIdNum1 = (rule, value, callback) => {
        if(value === ''){
            callback(new Error('请输入法人身份证号码'));
        }else if(value.length > 18 || value.length < 15){
            callback(new Error('长度为15或18位'));
        }else if(!validateIdNum(value)){
            callback(new Error('请输入正确格式的身份证号码'));
        } else {
          callback();
        }
    };
    return {
      fileList: [],
      picPath: "http://192.168.1.249:8083",
      uploadUrl: baseUrl + "/upload/fileupload",
      ruleForm: {
                name: "",
                province: "",
                city: "",
                industry: "",
                license: "",
                legal: "",
                legalID: "",
                linkman: "",
                linkmanPhone: "",
                email: "",
                img: ''
              },
      rules: {
          name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
          province: [ { required: true, message: '请选择省', trigger: 'change' }],
          city: [ { required: true, message: '请选择市', trigger: 'change' }],
          industry: [ { required: true, message: '请选择所属行业', trigger: 'change' }],
          license: [ {required: true,validator:isLicense,trigger: 'blur'}],
          legal: [{ required: true, message: '请输入法人姓名', trigger: 'blur' }],
          legalID: [{required: true,validator:validateIdNum1,trigger: 'blur'}],
          linkman: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
          linkmanPhone: [{required: true,validator:isPoneAvailable1,trigger: 'blur'}],
          email: [{ required: true,validator:validateEmail1,trigger: ['blur', 'change']}],
          img: [{ required: true, validator:isImg,message: '请至少上传一张图片', }],
      },
      provinceId: '',
      provinceArr: [],
      cityId: '',
      cityArr: [],
      industryId: '',
      industryArr: [],
      mercBusinessLicensePic:'',
      limit: 5,
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  created: function() {
    //获取所属行业
    Ajax("/sysdicttreedata/getCategory", "post").then(res => {
      if (res.length > 0) {
        this.industryArr = res;
      } else {}
    });

    //获取省
    Ajax("/areacode/getProvince", "post").then(res => {
      let that = this;
      if (res.length > 0) {
        let data = [];
        res.map(function(currentValue, index) {
          var obj = {
            areaName: currentValue.areaName,
            areaId: currentValue.areaId
          };
          data.push(obj);
        });
        this.provinceArr = data;
      }
    });
  },
  methods: {
      beforeAvatarUpload(file) {
         const isJPG = file.type === 'image/jpeg';
         const isPNG = file.type === 'image/png';
         if (!isPNG && !isJPG) {
             this.$message.error('上传图片资料只能是 JPG 或 PNG格式!');
         }
         return isPNG || isJPG;
      },
    mapArr(arr,value,id){
      arr.map(function(currentValue,index) {
        if (currentValue.areaName == value) {
         return currentValue[id]
        }
      });
    },
    fanhui() {
      this.$router.push("/merchantsList");
    },
    handleExceed() {
      this.$message({
        type: "error",
        message: "最多支持上传五张图片"
      });
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
      };
      Ajax("/upload/delePictureFile", "post", paramsForm).then(res => {
        if (res.status == 0) {
          this.$message({
            type: "success",
            message: "success"
          });
        } else {
          this.$message({
            type: "error",
            message: "上传图片资料只能是 JPG 或 PNG格式!"
          });
        }
      });
    },
    handleSuccess(res, file) {
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
    handleError() {},
    // beforeAvatarUpload(file) {
    //   const isJPG = file.type === 'image/jpeg';
    //   const isPNG = file.type === 'image/png';
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if ((!isJPG)&&(!isPNG)) {
    //     this.$message.error('上传图片只能是 JPG 或者 PNG 格式!');
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('上传图片大小不能超过 2MB!');
    //   }
    //   return (isJPG || isPNG)  && isLt2M;
    // },
    submit(formName) {
      var that = this;
      let mercName = this.ruleForm.name;
      let mercProvince = this.ruleForm.provinceId;
      let mercCity = this.ruleForm.cityId;
      let mercIndustry = this.ruleForm.industryId;
      let mercBusinessLicense = this.ruleForm.license;
      let mercBusinessEntityName = this.ruleForm.legal;
      let mercBusinessId = this.ruleForm.legalID;
      let mercBusinessEntityContactName = this.ruleForm.linkman;
      let mercBusinessEntityContactPhone = this.ruleForm.linkmanPhone;
      let mercBusinessMail = this.ruleForm.email;
      let arr = [];
      this.fileList.map(function(currentValue) {
        arr.push(currentValue.name);
      });
      this.mercBusinessLicensePic = arr.join();
      let cityName = this.ruleForm.cityName;
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
        mercBusinessLicensePic: this.mercBusinessLicensePic,
        provinceName: this.ruleForm.province,
        industryName: this.ruleForm.industry,
        cityName: this.ruleForm.city
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
            Ajax("/merchant/addMerchant","post",paramsForm)
            .then(res => {
              if (res.status == 0) {
                this.$message({
                  type: "success",
                  message: "新增商户成功"
                });
                this.$router.push("/merchantsList");
            } else if (res.status == 1) {
                this.$message({
                  type: "error",
                  message: res.errorMsg
                });
              }
          })
          .catch(err => {
              console.log(err);
          });
        } else {}
      });
    },
    selectProvince(item) {
      let that = this;
      this.provinceArr.map(function(currentValue, index) {
        if (currentValue.areaName == that.ruleForm.province) {
          that.ruleForm.provinceId = currentValue.areaId;
        }
      });
      let paramsForm = {
        areaId: this.ruleForm.provinceId
      };
      Ajax("/areacode/getCity", "post", paramsForm).then(res => {
        this.cityArr = res;
        this.ruleForm.city = this.cityArr[0].areaName;
        this.ruleForm.cityId = this.cityArr[0].areaId;
      });
    },
    selectCity() {
      let that = this;
      this.cityArr.map(function(currentValue, index) {
        if (currentValue.areaName ==  that.ruleForm.city) {
          that.ruleForm.cityId = currentValue.areaId;
        }
      });
    },
    selectIndustry(){
      let that = this;
      this.industryArr.map(function(currentValue, index) {
        if (currentValue.value ==  that.ruleForm.industry) {
          that.ruleForm.industryId = currentValue.orderno;
        }
      });
    },
  }
};
</script>
