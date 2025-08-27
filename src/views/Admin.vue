<template>
    <div class="home-container">
        <div class="card">
            <!-- 操作栏 -->
            <div class="table-controls">
                <div class="search-area">
                    <el-input v-model="params.name" placeholder="请输入姓名" prefix-icon="Search" clearable />
                    <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
                    <el-button type="danger" :icon="Refresh" @click="handleClear">清空</el-button>
                </div>

                <div class="action-area">
                    <el-button type="primary" :icon="Plus" @click="openCreateDialog">新增</el-button>
                    <el-button type="danger" :icon="Delete" @click="handleBatchDelete">批量删除</el-button>
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
            <el-table ref="multipleTableRef" :data="data.tableData" style="width: 100%;" v-loading="data.loading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column prop="username" label="账号" align="center" />
                <el-table-column prop="name" label="姓名" align="center" />
                <el-table-column prop="phone" label="手机号" align="center" />
                <el-table-column prop="email" label="邮箱" align="center" />
                <el-table-column label="操作" width="150" align="center">
                    <template #default="scope">
                        <el-button type="primary" size="small" link @click="openEditDialog(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" link @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页组件：放置在表格下方居中 -->
            <div class="pagination-container">
                <el-pagination background :current-page="params.pageNum" :page-size="params.pageSize"
                    :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="params.total"
                    @size-change="handleSizeChange" @current-change="handlePageChange" />
            </div>
        </div>

        <!-- 新增/编辑对话框 -->
        <el-dialog v-model="dialog.visible" :title="dialog.title" width="30%">
            <el-form :model="form" label-width="80px">
                <el-form-item label="账号">
                    <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.phone" />
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialog.visible = false">取消</el-button>
                    <el-button type="primary" @click="handleSave">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import {
    Search, Plus, Delete, Download, Upload, ArrowDown, Refresh
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
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

const multipleTableRef = ref(null)
const multipleSelection = ref([])

const form = reactive({
    username: '',
    name: '',
    phone: '',
    email: ''
});

const dialog = reactive({
    visible: false,
    title: ''
});

// --- 加载数据 ---
const load = () => {
    data.loading = true;
    request.get('/admin/selectPage', { params }).then(res => {
        data.tableData = res.data.rows;
        params.total = res.data.total;
        data.loading = false;
    });
};

// --- 分页处理 ---
const handleSizeChange = (val) => {
    params.pageSize = val;
    load();
};

const handlePageChange = (val) => {
    params.pageNum = val;
    load();
};

// --- 搜索和清空 ---
const handleSearch = () => {
    params.pageNum = 1;
    load();
};

const handleClear = () => {
    params.name = '';
    params.pageNum = 1;
    load();
};

// --- 新增 ---
const openCreateDialog = () => {
    Object.assign(form, { id: null, username: '', name: '', phone: '', email: '' });
    dialog.title = '新增管理员';
    dialog.visible = true;
};

// --- 编辑 ---
const openEditDialog = (row) => {
    Object.assign(form, row);
    dialog.title = '编辑管理员';
    dialog.visible = true;
};

// --- 保存 ---
const handleSave = () => {
    request.post('/admin/save', form).then(res => {
        ElMessage.success('保存成功');
        dialog.visible = false;
        load(); // 刷新数据
    });
};

// --- 删除 ---
const handleDelete = (row) => {
    ElMessageBox.confirm('确定删除该管理员吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        request.delete('/admin/delete/' + row.id).then(res => {
            ElMessage.success('删除成功');
            load();

        });
    }).catch(() => {
    });
};

const handleSelectionChange = (selection) => {
    multipleSelection.value = selection
}
const handleBatchDelete = () => {
    if (multipleSelection.value.length === 0) {
        ElMessage.warning('请选择要删除的管理员');
        return;
    }

    ElMessageBox.confirm('确定批量删除这些管理员吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        const ids = multipleSelection.value.map(item => item.id);
        request.post('/admin/deleteBatch', ids).then(res => {
            ElMessage.success('批量删除成功');
            load(); // 刷新数据
            multipleTableRef.value.clearSelection()
        });
    }).catch(() => {
    });
};

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

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
