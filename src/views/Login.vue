<template>
    <div class="login-container">
        <!-- 登录卡片 -->
        <div class="login-card">
            <!-- 标题区域 -->
            <div class="login-header">
                <div class="logo">
                    <el-icon size="40" color="#409EFF">
                        <UserFilled />
                    </el-icon>
                </div>
                <h2>欢迎回来</h2>
                <p>请登录您的账户以继续</p>
            </div>

            <!-- 表单区域 -->
            <el-form ref="formRef" :model="form" :rules="rules" class="login-form" @keyup.enter="handleLogin">
                <el-form-item prop="username">
                    <el-input v-model="form.username" prefix-icon="User" placeholder="用户名" size="large" clearable />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" prefix-icon="Lock" placeholder="密码" size="large" show-password
                        clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="large" class="login-button" :loading="loading" @click="handleLogin">
                        {{ loading ? '登录中...' : '登 录' }}
                    </el-button>
                </el-form-item>
                <div class="form-footer">
                    <span>还没有账号？</span>
                    <el-link type="primary" @click="handleRegister">立即注册</el-link>
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
    username: 'admin',
    password: '123456'
});

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 15, message: '用户名长度在 3 到 15 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
    ]
});


const handleLogin = async () => {
    if (!formRef.value) return;

    try {
        await formRef.value.validate();

        loading.value = true;

        const res = await request.post('/login', form);

        if (res.code === 200) {
            ElMessage.success('登录成功');
            console.log(res);
            localStorage.setItem("code_user", JSON.stringify(res.data || {}));
            router.push('/');
        } else {
            ElMessage.error(res.msg || '登录失败，请检查用户名或密码');
        }
    } catch (error) {
        console.error('Login failed:', error);
        ElMessage.error('登录失败，请稍后重试');
    } finally {
        loading.value = false;
    }
};

const handleRegister = () => {
    ElMessage.info('注册功能暂未开放，敬请期待！');
};
</script>

<style lang="scss" scoped>
@use "@/assets/css/login.scss";
</style>
