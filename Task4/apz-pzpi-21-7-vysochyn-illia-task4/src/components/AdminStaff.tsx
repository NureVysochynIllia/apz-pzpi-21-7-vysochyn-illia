import {useEffect, useState} from "react";
import axios from "axios";


const AdminStaff: React.FC<{ jwt: string; texts: any }> = ({ jwt, texts }) => {
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [selectedClusterId, setSelectedClusterId] = useState<string>("");
    const [selectedStorageId, setSelectedStorageId] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showStatistics, setShowStatistics] = useState<boolean>(false);

    const getClusters = async () => {
        try {
            const response = await axios.get("http://localhost:5000/staff/stat/", {
                headers: { Authorization: "Bearer " + jwt, lang:texts.locale }
            });
            setClusters(response.data.clusters);
        } catch (error:any) {
            console.error("Failed to fetch clusters:", error);
            alert(error.response.data.message)
        }
    };

    const changePrice = async () => {
        if (!price || !selectedClusterId) {
            alert(texts.providePriceAlert);
            return;
        }

        try {
            await axios.post("http://localhost:5000/staff/price/", {
                price: price,
                clusterId: selectedClusterId,
                storageId: selectedStorageId
            }, {
                headers: { Authorization: "Bearer " + jwt }
            });
            alert(texts.priceUpdated);
            getClusters();
        } catch (error:any) {
            console.error("Failed to change price:", error);
            alert(error.response.data.message);
        }
    };

    useEffect(() => {
        getClusters();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{texts.changeStoragePrice}</h2>
            <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center text-blue-500 hover:text-blue-700 transition duration-200 mb-4"
            >
                {showForm ? texts.hideForm : texts.showForm}
            </button>
            {showForm && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        changePrice();
                    }}
                    className="mb-8"
                >
                    <div className="mb-4">
                        <label className="block text-gray-700">{texts.cluster}</label>
                        <select
                            value={selectedClusterId}
                            onChange={(e) => setSelectedClusterId(e.target.value)}
                            className="mt-1 p-2 border rounded-md w-full"
                        >
                            <option value="" disabled>
                                {texts.selectCluster}
                            </option>
                            {clusters.map((cluster) => (
                                <option key={cluster._id} value={cluster._id}>
                                    {cluster.name} ({cluster.city})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">{texts.storage}</label>
                        <select
                            value={selectedStorageId}
                            onChange={(e) => setSelectedStorageId(e.target.value)}
                            className="mt-1 p-2 border rounded-md w-full"
                        >
                            <option value="">{texts.allStoragesInCluster}</option>
                            {selectedClusterId &&
                                clusters
                                    .find((cluster) => cluster._id === selectedClusterId)
                                    ?.storages?.map((storage) => (
                                    <option key={storage._id} value={storage._id}>
                                        {texts.storage} {storage.number}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">{texts.price}</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 p-2 border rounded-md w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        {texts.changePrice}
                    </button>
                </form>
            )}

            <h2 className="text-2xl font-bold mb-4">{texts.clusterStatistics}</h2>
            <button
                onClick={() => setShowStatistics(!showStatistics)}
                className="flex items-center text-blue-500 hover:text-blue-700 transition duration-200 mb-4"
            >
                {showStatistics ? texts.hideStatistics : texts.showStatistics}
            </button>
            {showStatistics &&
                clusters.map((cluster) => (
                    <div key={cluster._id} className="mb-6">
                        <h3 className="text-xl font-semibold">
                            {cluster.name} ({cluster.city})
                        </h3>
                        <table className="min-w-full bg-white border border-gray-200 mt-2">
                            <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">{texts.storageNumber}</th>
                                <th className="px-4 py-2 border-b">{texts.rentedHours}</th>
                                <th className="px-4 py-2 border-b">{texts.earnings}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cluster.storages?.map((storage) => (
                                <tr key={storage._id}>
                                    <td className="px-4 py-2 border-b">{storage.number}</td>
                                    <td className="px-4 py-2 border-b">
                                        {storage.statistics?.rentedHours || 0}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {storage.statistics?.earnings || 0}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ))}
        </div>
    );
};

export default AdminStaff;