<template>
    <div class="home-container">
        <div class="card">
            <!-- 操作栏 -->
            <div class="table-controls">
                <div class="search-area">
                    <el-input v-model="params.name" placeholder="请输入姓名" prefix-icon="Search" clearable />
                    <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
                    <el-button :icon="Refresh" @click="handleClear">清空</el-button>
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
                                <el-dropdown-item :icon="Download" @click="exportData">批量导出</el-dropdown-item>
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

            <!-- 分页组件 -->
            <div class="pagination-container">
                <el-pagination background :current-page="params.pageNum" :page-size="params.pageSize"
                    :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="params.total"
                    @size-change="handleSizeChange" @current-change="handlePageChange" />
            </div>
        </div>

        <!-- 新增/编辑对话框 -->
        <el-dialog v-model="dialog.visible" :title="dialog.title" width="40%" @close="resetForm">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="form.username" :disabled="!!form.id" placeholder="请输入账号" />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入邮箱" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialog.visible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import {Search, Plus, Delete, Download, Upload, ArrowDown, Refresh} from '@element-plus/icons-vue';
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

const dialog = reactive({
    visible: false,
    title: ''
});

const form = ref({
    id: null,
    username: '',
    name: '',
    phone: '',
    email: ''
});

const multipleTableRef = ref(null);
const multipleSelection = ref([]);
const formRef = ref(null);

// --- 表单校验规则 ---
const rules = reactive({
    username: [
        { required: true, message: '账号不能为空', trigger: 'blur' },
    ],
    name: [
        { required: true, message: '姓名不能为空', trigger: 'blur' },
    ],
    phone: [
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ],
    email: [
        { message: '邮箱不能为空', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
    ]
});

const load = () => {
    data.loading = true;
    request.get('/admin/selectPage', { params }).then(res => {
        if (res.code === 200) {
            data.tableData = res.data.rows;
            params.total = res.data.total;
        } else {
            ElMessage.error(res.msg || '数据加载失败');
        }
    }).finally(() => {
        data.loading = false;
    });
};
load();

const resetForm = () => {
    form.value = { id: null, username: '', name: '', phone: '', email: '' };
    formRef.value?.clearValidate();
};

const openCreateDialog = () => {
    resetForm();
    dialog.title = '新增管理员';
    dialog.visible = true;
};

const openEditDialog = (row) => {
    resetForm();
    form.value = { ...row };
    dialog.title = '编辑管理员';
    dialog.visible = true;
};

const submitForm = async () => {
    if (!formRef.value) return;
    try {
        await formRef.value.validate();

        const requestPromise = form.value.id
            ? request.put('/admin/update', form.value)
            : request.post('/admin/save', form.value);

        const res = await requestPromise;
        if (res.code === 200) {
            ElMessage.success(form.value.id ? '更新成功' : '新增成功');
            dialog.visible = false;
            load();
        } else {
            ElMessage.error(res.msg || '操作失败');
        }
    } catch (error) {
        console.error('Validation or request failed:', error);
    }
};

const handleDelete = (row) => {
    ElMessageBox.confirm(`确定删除管理员 [${row.name}] 吗?`, '危险操作', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        const res = await request.delete('/admin/delete/' + row.id);
        if (res.code === 200) {
            ElMessage.success('删除成功');
            load();
        } else {
            ElMessage.error(res.msg || '删除失败');
        }
    }).catch(() => {
        ElMessage.info('已取消删除');
    });
};

const handleBatchDelete = () => {
    if (multipleSelection.value.length === 0) {
        ElMessage.warning('请至少选择一项进行删除');
        return;
    }
    ElMessageBox.confirm('确定批量删除选中的管理员吗?', '危险操作', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        const ids = multipleSelection.value.map(item => item.id);
        const res = await request.post('/admin/deleteBatch', ids);
        if (res.code === 200) {
            ElMessage.success('批量删除成功');
            load();
            multipleTableRef.value.clearSelection();
        } else {
            ElMessage.error(res.msg || '批量删除失败');
        }
    }).catch(() => {
        ElMessage.info('已取消批量删除');
    });
};

const handleSearch = () => {
    params.pageNum = 1;
    load();
};

const handleClear = () => {
    params.name = '';
    params.pageNum = 1;
    load();
};

const handleSizeChange = (val) => {
    params.pageSize = val;
    load();
};

const handlePageChange = (val) => {
    params.pageNum = val;
    load();
};

const handleSelectionChange = (selection) => {
    multipleSelection.value = selection;
};

const exportData = () => { 
     request.get('/admin/export').then(res => {});
};
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