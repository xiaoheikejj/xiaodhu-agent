<template>
    <el-container class="wrapper">
        <el-aside>
            <Sidebar></Sidebar>
        </el-aside>
        <Header></Header>
        <el-container class="layout">
            <el-main class="main">
                <transition name="fade" mode="out-in"><router-view></router-view></transition>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import Header from './Header';
    import Sidebar from './Sidebar';
    export default {
        components:{
            Header,
            Sidebar
        }
    }
</script>

<style lang="scss" scoped>
    .wrapper{
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .layout{
        flex: 1;
        display: flex;
        background-color: #f0f2f5;
    }
    .header{
        // background-color: #313540;
        background-color: rgb(70, 76, 91);
    }
    .main{
        flex: 1;
        background-color: #f0f2f5;
        display: flex;
        overflow-y: auto;
    }
</style>
