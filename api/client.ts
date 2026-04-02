import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Platform } from 'react-native';

// 실기기: 개발 장비의 실제 IP 사용
const BASE_URL = Platform.select({
    default: 'https://bssm-api.zer0base.me',
});

// TODO: (1차) axios.create()로 인스턴스를 만들고 baseURL과 Content-Type 헤더를 설정한다
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
// 모든 요청 전에 실행 — 추후 토큰 주입, 로깅 등을 여기서 처리
apiClient.interceptors.request.use(
    (config: AxiosRequestConfig | any) => {
        // Request logging: HTTP method and URL
        const method = (config.method || 'GET').toString().toUpperCase();
        const url = config.url || config.baseURL || '';
        console.log(`${method} ${url}`);

        // For the exercise: explicitly show GET /content/list when that request is made
        if (method === 'GET' && url.includes('/content/list')) {
            console.log('GET /content/list');
        }

        // TODO: 인증 토큰이 생기면 여기서 주입
        // const token = getToken();
        // if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

// Response Interceptor
// 모든 응답 후에 실행 — 에러 코드를 한 곳에서 처리
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const status = error.response?.status;

        if (status === 404) {
            console.warn(`404 Not Found: ${error.config?.url ?? 'unknown'}`);
        } else if (status === 401) {
            console.warn(`401 Unauthorized: ${error.config?.url ?? 'unknown'}`);
        } else if (status) {
            console.error(`API Error (${status}): ${error.message}`);
        } else {
            // Network or no response
            console.error(`Network/Unknown Error: ${error.message}`);
        }

        return Promise.reject(error);
    },
);

export default apiClient;
