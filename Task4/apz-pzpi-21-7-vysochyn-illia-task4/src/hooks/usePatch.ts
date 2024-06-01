import { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface UsePatchResult<T> {
    data: T | null;
    loading: boolean;
    error: AxiosError | null;
    patchData: (body: any) => Promise<void>;
}

const usePatch = <T,>(url: string): UsePatchResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AxiosError | null>(null);

    const patchData = async (body: any) => {
        setLoading(true);
        try {
            const response = await axios.patch<T>(url, body);
            setData(response.data);
        } catch (error) {
            setError(error as AxiosError);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, patchData };
};

export default usePatch;