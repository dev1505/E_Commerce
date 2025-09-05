import axios, { AxiosRequestConfig } from 'axios';

const CommonApiCall = async <T = any>(
    url: string,
    config: AxiosRequestConfig,
): Promise<T | null> => {
    try {
        const response = await axios({
            url,
            withCredentials: true,
            ...config,
        });

        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 401) {
            // Redirect manually
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        } else {
            console.error('API Error:', error.response?.data || error.message);
        }

        return null;
    }
};

export default CommonApiCall;
