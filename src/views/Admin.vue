<template>
    <div class="home-container">
        <div class="card">
            <!-- 统一的操作栏 -->
            <div class="table-controls">
                <!-- 左侧：搜索区域 -->
                <div class="search-area">
                    <el-input v-model="params.name" placeholder="请输入姓名" prefix-icon="Search" clearable />
                    <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
                    <el-button type="danger" :icon="Refresh" @click="handleClear">清空</el-button>
                </div>

                <!-- 右侧：操作按钮区域 -->
                <div class="action-area">
                    <el-button type="primary" :icon="Plus">新增</el-button>
                    <el-button type="danger" :icon="Delete">批量删除</el-button>
                    <el-dropdown>
                        <el-button type="success">
                            更多操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item :icon="Download">批量导出</el-dropdown-item>
                                <el-dropdown-item :icon="Upload">批量导入</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>

            <!-- 数据表格 -->
            <el-table :data="data.tableData" style="width: 100%;" v-loading="data.loading">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="username" label="账号" />
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="phone" label="手机号" />
                <el-table-column prop="email" label="地址" />
                <el-table-column label="操作" width="150">
                    <template #default="scope">
                        <el-button type="primary" size="small" link>编辑</el-button>
                        <el-button type="danger" size="small" link>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div>
                <el-pagination background v-model:current-page="params.pageNum" v-model:page-size="params.pageSize"
                    :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="params.total"
                    @size-change="handleSizeChange" @current-change="handlePageChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { Search, Plus, Delete, Download, Upload, ArrowDown, Refresh } from '@element-plus/icons-vue';
import request from '@/utils/request';

const data = reactive({
    loading: false,
    tableData: []
});

const params = reactive({
    pageNum: 1,
    pageSize: 5,
    name: '',
    total: 0
});

const handleSizeChange = (val) => {
    params.pageSize = val;
    load();
}

const handlePageChange = (val) => {
    params.pageNum = val;
    load();
}

const handleSearch = () => {
    params.pageNum = 1;
    load();
}

const handleClear = () => {
    params.name = '';
    load();
}

const load = () => {
    data.loading = true;
    request.get('/admin/selectPage', {params}).then(res => {
        data.tableData = res.data.rows;
        params.total = res.data.total;
        data.loading = false;
    })
}

load();

</script>

<style lang="scss" scoped>
.home-container {
    padding: 10px;
}

.card {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .search-area {
        display: flex;
        align-items: center;
        gap: 10px;

        .el-input {
            width: 260px;
        }
    }

    .action-area {
        display: flex;
        align-items: center;
        gap: 10px;
    }
}
</style>
