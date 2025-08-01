<template>
    <div class="card">
        <el-input style="width: 240px;margin-right: 10px;" v-model="data.name" placeholder="请输入查询条件" :prefix-icon="Search" />
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="danger" @click="clean">清空</el-button>
    </div>

    <div class="card"> 
        <el-button type="primary" @click="add">添加</el-button>
        <el-button type="danger" @click="batchDelete">批量删除</el-button>
        <el-button type="success" @click="importData">导入</el-button>
        <el-button type="warning" @click="exportData">导出</el-button>
    </div>

    <div class="card"> 
        <el-table :data="data.tableData" stripe>
            <el-table-column label="编号" prop="id"/>
            <el-table-column label="名称" prop="name"/>
            <el-table-column label="年龄" prop="age"/>
            <el-table-column label="性别" prop="sex"/>
        </el-table>
        <div style="margin-top: 15px;">
            <el-pagination
                v-model:current-page="data.currentPage"
                v-model:page-size="data.pageSize"
                :page-sizes="[5, 10, 20, 30]"
                background
                layout="total, sizes, prev, pager, next, jumper"  
                :total="data.total"
            />
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { Search } from "@element-plus/icons-vue";

const data = reactive({
    name: null,
    tableData: [
        { id: 1, name: '张三', age: 18, sex: '男' },
        { id: 2, name: '李四', age: 22, sex: '女' },
        { id: 3, name: '王五', age: 25, sex: '男' },
        { id: 4, name: '赵六', age: 30, sex: '女' },
        { id: 5, name: '孙七', age: 28, sex: '男' },
    ],
    currentPage: 1,
    pageSize: 10,
    total: 10
});

const search = () => {
    console.log(data.name);
}
const clean = () => {
    data.name = "";
}

const add = () => {
}
const batchDelete = () => {
}
const importData = () => {
}
const exportData = () => {
}
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
