<template>
    <!-- 头部导航栏 -->
    <div class="header">
        <div id="header-left">后台管理系统</div>
        <div style="flex: 1;"></div>
        <div id="header-right">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="Logo"></img>
            <span>管理员</span>
        </div> 
    </div>

    <div style="display: flex;">
        <!-- 侧边导航栏 -->
        <div id="sidebar">
            <el-menu router :default-active="$route.path" style="border: 0;">
                <el-menu-item index="/manager/home">
                    <el-icon><House /></el-icon>
                    <span>系统首页</span>
                </el-menu-item>
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><User /></el-icon>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="/manager/user/admin">
                        <el-icon><Avatar /></el-icon>
                        <span>管理员</span>
                    </el-menu-item>
                    <el-menu-item index="/manager/user/employee">
                        <el-icon><UserFilled /></el-icon>
                        <span>员工信息</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item index="/manager/person">
                    <el-icon><UserFilled /></el-icon>
                    <span>个人信息</span>
                </el-menu-item>
                <el-menu-item index="/manager/data">
                    <el-icon><Grid /></el-icon>
                    <span>数据统计</span>
                </el-menu-item>
                <el-menu-item index="/manager/logout" @click="$router.push('/login')">
                    <el-icon><SwitchButton /></el-icon>
                    <span>退出登录</span>
                </el-menu-item>
            </el-menu>
        </div>
        <!-- 主体内容 -->
        <div id="sidebar-body">
            <router-view></router-view>
        </div>
    </div>

</template>

<script setup>
</script>

<style scoped>
@import "@/assets/css/Manager.css";
</style>