<template>
    <div class="sidebar" :class={collapse:isCollapse} >
        <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" router background-color="#464c5b" text-color="#bfcbd9" active-text-color="#20a0ff">
            <el-menu-item index="index">
                <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="1">
                <template slot="title">
                    <span>商户管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="merchantsList">商户列表</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <span>账户信息</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="voiceTemplate">语音模板管理</el-menu-item>
                </el-menu-item-group>
                 <el-menu-item-group>
                    <el-menu-item index="phoneList">话费清单</el-menu-item>
                </el-menu-item-group>
                 <el-menu-item-group>
                    <el-menu-item index="accountMan">子账户管理</el-menu-item>
                </el-menu-item-group>
                 <el-menu-item-group>
                    <el-menu-item index="merConfig">商户权限管理</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="dataAnalysis">
                <span slot="title">数据分析</span>
            </el-menu-item>
            <el-submenu index="4">
                <template slot="title">
                    <span>其他</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="advice">意见建议</el-menu-item>
                    <el-menu-item index="repair">故障报修</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isCollapse: false
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

<style lang="scss">
    .sidebar {
        width: 180px;
        background-color: #324157;
        display: flex;
        flex-direction: column;
        &.collapse{
            width: 50px;
        }
        ul {
            flex: 1;
            border-right: 0;
        }
        .logo{
            padding: 0 20px;
            height: 60px;
            line-height: 60px;
            background-color: #002140;
            color: #fff;
            font-size: 20px;
            letter-spacing: 1px;
        }
        .el-menu-item{
            width: 180px;
            min-width: 180px;
            max-width: 180px;
        }
        .el-submenu .el-menu-item{
            width: 180px;
            min-width: 180px;
            max-width: 180px;
        }
        .el-menu-item-group__title{
            display: none;    
        }
    }
</style>
