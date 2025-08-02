<template>
    <div>
        <div class="card">
            <el-input style="width: 240px;margin-right: 10px;" v-model="data.name" placeholder="请输入名称查询"
                :prefix-icon="Search" />
            <el-button type="primary" @click="load">查询</el-button>
            <el-button type="danger" @click="clean">清空</el-button>
        </div>

        <div class="card">
            <el-button type="primary" @click="add">添加</el-button>
            <el-button type="danger" @click="batchDelete">批量删除</el-button>
            <el-button type="success" @click="importData">导入</el-button>
            <el-button type="warning" @click="exportData">导出</el-button>
        </div>

        <div class="card">
            <el-table :data="data.EmployeeList" stripe>
                <el-table-column label="名称" prop="name" />
                <el-table-column label="工号" prop="workNumber" />
                <el-table-column label="年龄" prop="age" />
                <el-table-column label="性别" prop="sex">
                    <template #default="scope">
                        <span v-if="scope.row.sex === '1'">男</span>
                        <span v-else>女</span>
                    </template>
                </el-table-column>
                <el-table-column label="部门" prop="departmentName" />
            </el-table>
            <div style="margin-top: 15px;">
                <el-pagination @change="load" v-model:current-page="data.currentPage" v-model:page-size="data.pageSize"
                    :page-sizes="[5, 10, 20, 30]" background layout="total, sizes, prev, pager, next, jumper"
                    :total="data.total" />
            </div>
        </div>

        <el-dialog v-model="data.dialogFormVisible" title="新增员工信息" width="500">
            <el-form :model="data.form" label-width="80px" style="padding-right: 40px; padding-top: 20px;">
                <el-form-item label="员工姓名" label-width="80px">
                    <el-input v-model="data.form.name" autocomplete="off" placeholder="请输入员工姓名" />
                </el-form-item>
                <el-form-item label="工号" label-width="80px">
                    <el-input v-model="data.form.workNumber" autocomplete="off" placeholder="请输入工号" />
                </el-form-item>
                <el-form-item label="年龄" label-width="80px">
                    <el-input-number v-model="data.form.age" :min="0" :max="100" autocomplete="off" placeholder="请输入年龄"
                        style="width: 200px;" />
                </el-form-item>
                <el-form-item label="性别" label-width="80px">
                    <el-radio-group v-model="data.form.sex">
                        <el-radio value="1">男</el-radio>
                        <el-radio value="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="部门" label-width="80px">
                    <el-select v-model="data.form.departmentId" placeholder="请选择部门" @click="selectDepartment">
                        <el-option v-for="dept in data.departments" :key="dept.id" :label="dept.departmentName" :value="dept.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="个人介绍" label-width="80px">
                    <el-input v-model="data.form.description" :rows="3" type="textarea" placeholder="请输入个人介绍" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="data.dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="save">
                        保 存
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>

</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { Search } from "@element-plus/icons-vue";
import request from "@/utils/request";
import { ElMessage } from 'element-plus';

const data = reactive({
    name: null,
    EmployeeList: [],
    currentPage: 1,
    pageSize: 10,
    total: 0,
    dialogFormVisible: false,
    form: {
        name: "",
        wokrNumber: "",
        age: "",
        sex: "",
        departmentId: "",
        description: ""
    },
    departments: [],
});

const selectDepartment = () => {
    request.get("/department/selectAll").then(res => {
        data.departments = res.data;
    })
}

const clean = () => {
    data.name = "";
    load();
}

const add = () => {
    data.dialogFormVisible = true
    data.form = {}
}

const save = () => {
    request.post("/employee/add", data.form).then(res => { 
        console.log(res);
        if (res.code === 200) {
            data.dialogFormVisible = false;
            ElMessage.success("添加成功");
            load();
        } else {
            data.dialogFormVisible = false;
            ElMessage.error("添加失败");
            load();
        }
    })
}
const batchDelete = () => {
}
const importData = () => {
}
const exportData = () => {
}

const load = () => {
    request.get("/employee/selectPage", {
        params: {
            name: data.name,
            pageNum: data.currentPage,
            pageSize: data.pageSize
        }
    }).then(res => {
        data.EmployeeList = res.data.list;
        data.total = res.data.total;
    })
}

onMounted(() => {
    load();
});

</script>

<style scoped>
.card {
    background-color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 2px 2px 2px 2px rgba(45, 125, 186, 0.664);
    margin: 3px;
}
</style>
