<template>
    <div class="login-container">
        <!-- 注册卡片 -->
        <div class="login-card">
            <!-- 标题区域 -->
            <div class="login-header">
                <div class="logo">
                    <el-icon size="40" color="#409EFF">
                        <UserFilled />
                    </el-icon>
                </div>
                <h2>创建您的账户</h2>
            </div>

            <!-- 表单区域 -->
            <el-form ref="formRef" :model="form" :rules="rules" class="login-form" @keyup.enter="handleRegister">
                <el-form-item prop="username">
                    <el-input v-model="form.username" prefix-icon="User" placeholder="设置您的用户名" size="large" clearable />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" prefix-icon="Lock" placeholder="设置您的密码" size="large" show-password
                        clearable />
                </el-form-item>
                <el-form-item prop="confirmPassword">
                    <el-input v-model="form.confirmPassword" prefix-icon="Lock" placeholder="请再次输入密码" size="large"
                        show-password clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="large" class="login-button" :loading="loading"
                        @click="handleRegister">
                        {{ loading ? '注册中...' : '注 册' }}
                    </el-button>
                </el-form-item>
                <div class="form-footer">
                    <span>已有账号？</span>
                    <el-link type="primary" @click="goToLogin">返回登录</el-link>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { UserFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import request from '@/utils/request';

const router = useRouter();
const formRef = ref(null);
const loading = ref(false);

const form = reactive({
    username: '',
    password: '',
    confirmPassword: ''
});

const validateConfirmPassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入您的密码'));
    } else if (value !== form.password) {
        callback(new Error('两次输入的密码不一致！'));
    } else {
        callback();
    }
};

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 15, message: '用户名长度在 3 到 15 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { validator: validateConfirmPassword, trigger: 'blur' }
    ]
});


const handleRegister = async () => {
    if (!formRef.value) return;

    try {
        await formRef.value.validate();

        loading.value = true;

        const { confirmPassword, ...payload } = form;

        const res = await request.post('/register', payload);

        ElMessage.success('注册成功！即将跳转到登录页...');
        setTimeout(() => {
            router.push('/login');
        }, 1500);
    } catch (error) {
        console.error('Register failed:', error);
    } finally {
        loading.value = false;
    }
};

const goToLogin = () => {
    router.push('/login');
};

</script>

<style lang="scss" scoped>
@use "@/assets/css/login.scss";

.form-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #606266;

    .el-link {
        margin-left: 5px;
        font-weight: 500;
    }
}
</style>
