import axios from 'axios';
import { ElMessage } from 'element-plus';

const request = axios.create({
    baseURL: 'http://localhost:9090',
    timeout: 5000
});

// request拦截器
request.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// response拦截器
request.interceptors.response.use(
    response => {
        if (response.data instanceof Blob) {
            return response.data;
        }
        const res = response.data;
        if (res.code !== 200) {
            ElMessage.error(res.msg || res.message || '操作失败');
            return Promise.reject(new Error(res.msg || res.message || 'Error'));
        } else {
            return res;
        }
    },
    error => {
        if (error.response) {
            ElMessage.error(`请求失败: ${error.response.status} ${error.response.statusText}`);
        } else if (error.request) {
            ElMessage.error('请求超时或网络连接问题');
        } else {
            ElMessage.error(`发生错误: ${error.message}`);
        }
        return Promise.reject(error);
    }

)

export default request;
