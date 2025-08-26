<template>
    <div>
        <div class="card" style="margin-bottom: 5px;">
            <el-input style="width: 260px; margin-left: 5px;" v-model="date.name" placeholder="请输入内容"
                prefix-icon="Search"></el-input>
            <el-button type="primary" style="margin-left: 5px;">查询</el-button>
        </div>
        
        <div class="card">
            <el-button type="primary" style="margin-left: 5px;">新增</el-button>
            <el-button type="danger" style="margin-left: 5px;">批量删除</el-button>
            <el-button type="success" style="margin-left: 5px;">批量导出</el-button>
            <el-button type="info" style="margin-left: 5px;">批量导入</el-button>
        </div>

        <div class="card" style="margin-bottom: 5px;">
            <el-table :data="date.tableData" style="width: 100%;">
                <el-table-column type="selection" width="180px"></el-table-column>
                <el-table-column prop="data" label="姓名" width="180px"></el-table-column>
                <el-table-column prop="name" label="手机号" width="180px"></el-table-column>
                <el-table-column prop="adress" label="地址" width="180px"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'

const date = reactive({
    name: '',
    tableData: [
        { data: '王小虎', name: '12345678901', adress: '上海' },
        { data: '王小虎', name: '12345678901', adress: '上海' },   
    ]
})
</script>