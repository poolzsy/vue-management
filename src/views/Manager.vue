<template>
    <div class="manager-container">
        <!-- 头部导航栏 -->
        <header class="header">
            <div class="header-logo">
                <img src="@/assets/imgs/导航.png" alt="Logo" />
                <span>郄管理</span>
            </div>

            <div class="header-center">
                <div class="breadcrumb">首页 / 数据分析</div>
            </div>

            <div class="header-user">
                <el-dropdown>
                    <div class="user-info">
                        <img class="user-avatar"
                            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="Avatar" />
                        <span>管理员</span>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>个人信息</el-dropdown-item>
                            <el-dropdown-item>修改密码</el-dropdown-item>
                            <el-dropdown-item>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </header>

        <!-- 主体内容区域 -->
        <div class="main-content">
            <!-- 侧边栏菜单 -->
            <aside class="sidebar">
                <el-menu default-active="/home" class="el-menu-vertical-custom">
                    <el-menu-item index="/home">
                        <el-icon>
                            <House />
                        </el-icon>
                        <span>首页</span>
                    </el-menu-item>
                    <el-sub-menu index="1">
                        <template #title>
                            <el-icon>
                                <Location />
                            </el-icon>
                            <span>数据管理</span>
                        </template>
                        <el-menu-item index="1-1">子菜单 1</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </aside>

            <!-- 内容显示区域 -->
            <main class="content-view">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
@use "@/assets/css/manager.scss" as manager;
</style>
