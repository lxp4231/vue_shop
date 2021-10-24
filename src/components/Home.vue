<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div class="logo">
                <img src="../assets/img/logo.png" alt="" />
                <span>电商后台管理系统</span>
            </div>
            <div @click="logout" class="close">
                <i class="el-icon-switch-button"></i>
                <span>退出</span>
            </div>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="!collapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleFold">
                    <i class="el-icon-s-fold" v-show="collapse"></i>
                    <i class="el-icon-s-unfold" v-show="!collapse"></i>
                </div>
                <!-- 要保证为布尔值，要绑定 -->
                <el-menu
                    class="el-menu-vertical-demo"
                    background-color="#333844"
                    text-color="#fff"
                    active-text-color="#44a2ff"
                    unique-opened
                    :collapse="!collapse"
                    :collapse-transition="false"
                    router
                    :default-active="activePath"
                >
                    <!-- 一级菜单 -->
                    <el-submenu
                        :index="item.id + ''"
                        v-for="item in menuList"
                        :key="item.id"
                    >
                        <!-- 一级菜单模板区 -->
                        <template slot="title">
                            <i :class="iconObj[item.id]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item
                            :index="it.path"
                            v-for="it in item.children"
                            :key="it.id"
                            style="height: 45px"
                            @click="saveNavState(it.path)"
                        >
                            <!-- 二级菜单模板区  -->
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ it.authName }}</span>
                            </template></el-menu-item
                        >
                    </el-submenu>
                </el-menu></el-aside
            >
            <!-- 右侧内容主体:main  -->
            <el-main style="background-color: #f1f3f4">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    name: 'Home',
    //获取列表 created时就获取
    data() {
        return {
            menuList: [],
            iconObj: {
                125: 'iconfont icon-users',
                103: 'iconfont icon-tijikongjian',
                101: 'iconfont icon-shangpin',
                102: 'iconfont icon-danju',
                145: 'iconfont icon-baobiao',
            },
            collapse: true,
            activePath: '',
        }
    },
    created() {
        // 创建实例之后就调用获取列表
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    // mounted() {
    //     window.sessionStorage.removeItem('activePath')
    //     this.activePath = ''
    // },
    methods: {
        //退出
        logout() {
            //先清空本地存储
            window.sessionStorage.clear()
            // 退出登录，跳转到登录页
            this.$router.push('login')
        },
        //写成异步形式
        async getMenuList() {
            const { data: res } = await this.$http.get('/menus')
            if (res.meta.status !== 200) {
                return this.$message({
                    message: res.meta.msg,
                    type: 'false',
                })
            }
            this.menuList = res.data
        },
        // 点击按钮切换折叠
        toggleFold() {
            this.collapse = !this.collapse
        },
        // 保存二级导航的激活状态，先保存url
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        },
    },
}
</script>
<style  lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px !important;
    background-color: #0070c1;
    padding-left: 0;
    padding-right: 0;
    .logo {
        display: flex;
        align-items: center;
        width: 200px;
        height: 45px;
        color: #fff;
        font-size: 18px;
        background-color: #027cda;
        font-weight: 400;
        span {
            margin-left: 6px;
        }
    }
    .logo img {
        width: 40px;
        height: 40px;
    }
    .close {
        display: flex;
        align-items: center;
        width: 45px;
        height: 40px;
        color: #fff;
        cursor: pointer;
        margin-right: 20px;
        i {
            font-size: 18px;
        }
        span {
            margin-left: 2px;
            font-size: 12px;
        }
    }
}

.el-aside {
    background-color: #333844;
    .el-submenu {
        width: 200px;
    }
    .iconfont {
        margin-right: 6px;
    }
}
.el-main {
    background-color: #ffffff;
}

.toggle-button {
    display: flex;
    justify-content: flex-end;
    color: #fff;
    margin-right: 3px;
    cursor: pointer;
}
</style>