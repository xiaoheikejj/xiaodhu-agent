<template>
    <el-container id="home" style="flex-direction: row;">
        <el-aside style="width: auto;">
            <Sidebar :homeCollapse="collapseBoolean"></Sidebar>
        </el-aside>
        <el-container class="layout" style="flex-direction: column;">
            <Header @clickCollapse="homeClickCollapse"></Header>
            <el-main class="main">
                <transition name="fade" mode="out-in"><router-view></router-view></transition>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import Header from "./Header";
import Sidebar from "./Sidebar";
export default {
    data() {
        return {
            collapseBoolean: false
        }
    },
    components: {
        Header,
        Sidebar
    },
    methods: {
        homeClickCollapse(data) {
            if (data) {
                this.collapseBoolean = true;
            } else {
                this.collapseBoolean = false;
            }
        }
    }
};
</script>
<style lang="scss">

i {
    font-style: normal;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
$logocolor: #d2ecff;
$bgcolor: #4b9af5;
$submenucolor: #bcbdbf;
#home {
    .el-pagination {
        text-align: center;
        margin: 20px 0;
    }
    .el-submenu .el-menu-item.is-active {
        color: #fff !important;
        background-color: $bgcolor !important;
    }
    .el-main {
        padding: 0;
    }
    .el-aside {
        background-color: #344058;
        .logo {
            height: 70px;
            line-height: 70px;
            font-size: 16px;
            color: $logocolor;
            background-color: $bgcolor;
            font-weight: bold;
            letter-spacing: 3px;
            text-align: center;
        }
        .el-menu {
            border: none;
            background-color: #344058;
            .el-menu-item-group__title {
                padding: 0 0 0 20px;
            }
            .el-submenu__title {
                font-size: 16px;
                color: $submenucolor;
                &:hover {
                    background-color: #344058;
                    color: #fff;
                    i {
                        color: #fff;
                    }
                }
            }
            .el-menu-item {
                font-size: 14px;
                color: $submenucolor;
                background-color: #242d3d;
                &:hover {
                    color: #fff;
                }
            }
        }
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 230px;
    }
    #Sidebar {
        width: auto;
    }
}
</style>
