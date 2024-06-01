import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface UseGetResult<T> {
    data: T | null;
    loading: boolean;
    error: AxiosError | null;
}

const useGet = <T,>(url: string): UseGetResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AxiosError | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<T>(url);
                setData(response.data);
            } catch (error) {
                setError(error as AxiosError);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useGet;