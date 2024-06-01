import { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface UseDeleteResult<T> {
    data: T | null;
    loading: boolean;
    error: AxiosError | null;
    deleteData: () => Promise<void>;
}

const useDelete = <T,>(url: string): UseDeleteResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AxiosError | null>(null);

    const deleteData = async () => {
        setLoading(true);
        try {
            const response = await axios.delete<T>(url);
            setData(response.data);
        } catch (error) {
            setError(error as AxiosError);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, deleteData };
};

export default useDelete;