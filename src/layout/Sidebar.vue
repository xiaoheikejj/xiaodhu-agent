<template>
    <div id="Sidebar">
        <div class="logo">
                <span>{{title}}</span>
            </div>
        <el-menu default-active="1" class="el-menu-vertical-demo" router background-color="#2d3a4b" text-color="#bfcbd9" active-text-color="#20a0ff" :collapse="isCollapse">
            <!-- <el-submenu index="333">
                <template slot="title">
                    <i class="iconfont icon-yemian"></i>
                    <span>主页</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="Index">主页一</el-menu-item>
                </el-menu-item-group>
            </el-submenu> -->
            <template v-for="(item,index) in navList">
                <el-menu-item v-if="item.agentAuthUrl" :index="item.agentAuthUrl">
                    <span slot="title">{{item.agentAuthName}}</span>
                </el-menu-item>
                <el-submenu  v-else :index="String(index)">
                    <template slot="title">
                        <i :class="item.iconfont"></i>
                        <span>{{item.agentAuthName}}</span>
                    </template>
                     <template v-for="i in item.tblAgentAuthList">
                         <el-menu-item-group>
                            <el-menu-item :index="i.agentAuthUrl">{{i.agentAuthName}}</el-menu-item>
                        </el-menu-item-group>
                     </template>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import {baseUrl,Ajax} from "../assets/api/api";
    export default {
        data() {
            return {
                title: "代理商后台管理系统",
                navList: []
            }
        },
        props: ["homeCollapse"],
        created(){
            // this.navData = JSON.parse(sessionStorage.getItem("navList"));
            // this.$ajax.get(baseUrl + '/agentpackage/getMenuResource')
            // .then(res => {
            //     if(res.status == 0){
            //         this.navList = res.dataInfo[0];
            //     }else if(res.status == 3){
            //         this.$router.push("/login");
            //     }else{
            //         this.$router.push("/login");
            //     }
            // })
            // .catch(err => {
            //     this.$router.push("/login");
            // })
            Ajax('/agentpackage/getMenuResource', 'get')
            .then(res => {
                if(res.status == 0){
                    this.navList = res.dataInfo[0];
                }else if(res.status == 3){
                    this.$router.push("/login");
                }else{
                    this.$router.push("/login");
                }
            })
            .catch(err => {
                this.$router.push("/login");
            })
        },
        computed: {
            isCollapse() {
                var that = this;
                if (this.homeCollapse) {
                    this.title = "";
                    return true;
                } else {
                    setTimeout(function() {
                        that.title = "代理商后台管理系统";
                    }, 300)
                    return false;
                }
            }
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    };
</script>
