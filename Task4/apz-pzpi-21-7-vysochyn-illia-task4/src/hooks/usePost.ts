import { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface UsePostResult<T> {
    data: T | null;
    loading: boolean;
    error: AxiosError | null;
    postData: (body: any) => Promise<void>;
}

const usePost = <T,>(url: string): UsePostResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AxiosError | null>(null);

    const postData = async (body: any) => {
        setLoading(true);
        try {
            const response = await axios.post<T>(url, body);
            setData(response.data);
        } catch (error) {
            setError(error as AxiosError);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, postData };
};

export default usePost;