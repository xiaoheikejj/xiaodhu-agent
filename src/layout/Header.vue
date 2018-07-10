<template>
    <el-Header id="Header">
        <!-- <h1 class="title">代理商后台管理系统</h1> -->
        <i class="iconfont icon-shouqi" @click="sendCollapse"></i>
        <div class="info">
            <i class="fullscreen iconfont icon-quanping" @click="aa"></i>
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link username">
                    <span class="user-name">{{username}}</span><i class="iconfont icon-xiala"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="change">修改密码</el-dropdown-item>
                    <el-dropdown-item divided command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </el-Header>
</template>
<script>
import { baseUrl } from "../assets/api/api"
    export default {
        data() {
            return {
                username: sessionStorage.getItem("userName") || '',
                fullScreen: false,
                collapseStutas: false
            }
        },
        methods:{
            aa(){
                if(this.fullScreen){
                    this.fullScreen = false;
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {//FireFox
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {//Chrome等
                        document.webkitCancelFullScreen();
                    } else if (document.msExitFullscreen) {//IE11
                        document.msExitFullscreen();
                    }
                }else{
                    this.fullScreen = true;
                    var docElm = document.documentElement;
                    if(docElm.requestFullscreen) {//W3C
                        docElm.requestFullscreen();
                    }else if(docElm.mozRequestFullScreen) {//FireFox
                        docElm.mozRequestFullScreen();
                    }else if(docElm.webkitRequestFullScreen) {//Chrome等
                        docElm.webkitRequestFullScreen();
                    } else if(elem.msRequestFullscreen) {//IE11
                        elem.msRequestFullscreen();
                    }
                }
            },
            handleCommand(command) {
                var that = this;
                if(command == 'loginout'){
                    this.$ajax({
                        url: baseUrl + '/agent/exitLogin',
                        method: 'get'
                    })
                    .then(res => {
                        if (res.data.status === "0") {
                            that.$message({
                              type: 'success',
                              message: res.data.errorMsg
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    sessionStorage.removeItem('userName');
                    sessionStorage.removeItem('mercSeq');
                    this.$router.push('/login');
                }else if(command == 'change'){
                    this.$prompt('请修改密码', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                      // inputErrorMessage: '邮箱格式不正确'
                    }).then(({ value }) => {
                       that.$ajax({
                           url: baseUrl + '/agent/updatePassword',
                           method: 'post',
                           data: that.$qs.stringify({
                               password: that.$md5(value)
                           })
                       })
                       .then(res => {
                           that.$message({
                             type: 'success',
                             message: res.data.errorMsg
                           });
                       })
                       .catch(err => {
                           console.log(err);
                       })
                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '取消修改'
                      });
                    });
                }
            },
            sendCollapse() {
                this.collapseStutas = !this.collapseStutas;
                this.$emit("clickCollapse", this.collapseStutas)
            }
        }
    }
</script>
<style lang="scss">
    #Header {
        border-bottom: 1px solid #f0f0f0;
        &>i {
            font-size: 28px;
        }
    }
</style>
