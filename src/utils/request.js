import axios from 'axios';
import { ElMessage } from 'element-plus';

const request = axios.create({
    baseURL: 'http://localhost:9090',
    timeout: 5000,
    validateStatus: function (status) {
        return status >= 200 && status < 510;
    }
});

// request 拦截器
request.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        const user = JSON.parse(localStorage.getItem('code_user') || '{}');
        config.headers['token'] = user.token;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// response 拦截器
request.interceptors.response.use(
    response => {
        if (response.data instanceof Blob) {
            return response;
        }

        const res = response.data;
        const httpStatus = response.status;

        if (res.code === 200) {
            return res;
        }

        ElMessage({
            message: res.message || '操作失败',
            type: 'error',
            duration: 3 * 1000
        });

        if (httpStatus === 401) {
            console.error('认证失败，请重新登录');
        }

        return Promise.reject(new Error(res.message || 'Error'));
    },

    error => {
        console.error('网络请求错误:', error);
        ElMessage({
            message: '网络连接异常或服务器无响应，请稍后重试',
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

export default request;
