import {useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const HomeClusterItem: React.FC<{ cluster: Cluster, texts: any, jwt:String }> = ({ cluster, texts, jwt }) => {
    const [storages, setStorages] = useState<StorageB[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<string>('m');

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUnit(e.target.value);
    };

    const handleExpandClick = async () => {
        if (!isExpanded) {
            try {
                const res = await axios.get(`http://localhost:5000/clusters/${cluster._id}`, {
                    headers: {
                        Authorization: "Bearer " + jwt,
                        lang: "EN"
                    }
                });
                setStorages(res.data.storages);
            } catch (error:any) {
                console.error(texts.storageError, error);
                alert(error.response.data.message)
            }
        }
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="border p-4 rounded shadow mb-4">
            <Link to={`/cluster/${cluster._id}`} className="text-xl font-bold text-blue-800 hover:underline">
                {cluster.name}
            </Link>
            <p>{texts.city}: {cluster.city}</p>
            <p>{texts.type}: {cluster.type}</p>
            <p>{texts.workTime}: {texts.from} {cluster.workTime.from} {texts.to} {cluster.workTime.to}</p>
            <button
                onClick={handleExpandClick}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                {isExpanded ? texts.hideStorages : texts.showStorages}
            </button>
            {isExpanded && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold">{texts.storages}</h4>
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
                                            <select value={selectedUnit} onChange={handleUnitChange} className="border p-1 rounded mt-1 mb-2">
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
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HomeClusterItem;