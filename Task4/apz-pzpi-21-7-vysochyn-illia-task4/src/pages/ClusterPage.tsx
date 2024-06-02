import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const ClusterPage: React.FC<{ texts: any,jwt:String }> = ({ texts ,jwt}) => {
    const { clusterId } = useParams<{ clusterId: string }>();
    const [cluster, setCluster] = useState<Cluster | null>(null);
    const [storages, setStorages] = useState<StorageB[]>([]);
    const [selectedStorageId, setSelectedStorageId] = useState<string>('');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [isStorages, setIsStorages] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<string>('m');
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const navigate = useNavigate();

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUnit(e.target.value);
    };


    const handleBooking = async () => {
        try {
            if(fromDate=="" || toDate=="" || selectedUnit==""){
                return
            }
            await axios.post(
                'http://localhost:5000/rent/new/',
                {
                    storageId: selectedStorageId,
                    from: fromDate,
                    to: toDate
                },
                {
                    headers: {
                        Authorization: "Bearer " + jwt
                    }
                }
            );
            alert(texts.bookingSuccess);
            navigate('/active');
        } catch (error:any) {
            console.error( error);
            alert(error.response.data.message);
        }
    };

    const calculatePrice = () => {
        if (fromDate && toDate && selectedStorageId) {
            const selectedStorage = storages.find(storage => storage._id === selectedStorageId);
            if (!selectedStorage) return;

            const from = new Date(fromDate);
            const to = new Date(toDate);
            const timeDiff = to.getTime() - from.getTime();
            const hoursDiff = timeDiff / (1000 * 3600);

            setTotalPrice(selectedStorage.price * hoursDiff);
        }
    };

    useEffect(() => {
        const fetchCluster = async () => {
            try {
                let jwt = localStorage["jwt"];
                if (!jwt) {
                    return;
                }
                const res = await axios.get(`http://localhost:5000/clusters/${clusterId}`, {
                    headers: {
                        Authorization: "Bearer " + jwt,
                        lang: texts.locale
                    }
                });
                setCluster(res.data.cluster);
                setStorages(res.data.storages);
                setSelectedStorageId(res.data.storages[0]._id);
                setLoading(false)
            } catch (error) {
                console.error(texts.clusterError, error);
                setLoading(false)
                setError(texts.clusterError);
            }
        };

        fetchCluster();
    }, [clusterId, texts]);
    useEffect(() => {
        calculatePrice();
    }, [fromDate, toDate, selectedStorageId]);

    if (loading) {
        return <div>{texts.loading}</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            {cluster && (
                <div>
                    <h2 className="text-2xl font-bold">{cluster.name}</h2>
                    <p>{texts.city}: {cluster.city}</p>
                    <p>{texts.type}: {cluster.type}</p>
                    <p>{texts.workTime}: {texts.from} {cluster.workTime.from} {texts.to} {cluster.workTime.to}</p>
                    <div className="mt-4">
                        <h3 className="text-xl cursor-pointer text-green-900 hover:text-blue-800 font-semibold" onClick={()=>{setIsStorages(!isStorages)}}>{texts.storages}</h3>
                        {isStorages&&
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                            {storages.map(storage => (
                                <li key={storage._id} className="border p-2 rounded bg-gray-100">
                                    <p>{texts.number}: {storage.number}</p>
                                    <p>{texts.isOpened}: {storage.isOpened ? texts.yes : texts.no}</p>
                                    <p>{texts.isBooked}: {storage.isBooked ? texts.yes : texts.no}</p>
                                    <p>{texts.price}: {storage.price}</p>
                                    <div className="mt-2">
                                        <p className="font-bold">{texts.volume}:</p>
                                        {storage.volumes && storage.volumes.length > 0 && (
                                            <>
                                                <select value={selectedUnit} onChange={handleUnitChange}
                                                        className="border p-1 rounded mt-1 mb-2">
                                                    {storage.volumes.map((volume, index) => (
                                                        <option key={index} value={volume.unit}>
                                                            {volume.unit}
                                                        </option>
                                                    ))}
                                                </select>
                                                {storage.volumes
                                                    .filter((volume) => volume.unit === selectedUnit)
                                                    .map((volume, index) => (
                                                        <div key={index}>
                                                            <p>{texts.height}: {volume.height} {volume.unit}</p>
                                                            <p>{texts.width}: {volume.width} {volume.unit}</p>
                                                            <p>{texts.length}: {volume.length} {volume.unit}</p>
                                                        </div>
                                                    ))}
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>}
                        <hr className={"h-1 my-2 bg-gray-900"}/>
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold">{texts.book}</h4>
                            <div className="flex flex-col space-y-2">
                                <select
                                    value={selectedUnit}
                                    onChange={(e) => setSelectedStorageId(e.target.value)}
                                    className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>{texts.selectStorage}</option>
                                    {storages.map((storage) => (
                                        <option key={storage._id} value={storage._id}>
                                            {storage.number}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="datetime-local"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="datetime-local"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="border p-2 rounded bg-gray-900"
                                />
                                <h4 className="text-lg font-semibold">{texts.price + " "+ totalPrice}</h4>
                                <button
                                    onClick={handleBooking}
                                    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {texts.book}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClusterPage;