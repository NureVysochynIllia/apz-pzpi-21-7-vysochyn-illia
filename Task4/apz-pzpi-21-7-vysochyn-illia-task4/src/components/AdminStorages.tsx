import {useEffect, useState} from "react";
import axios from "axios";


const AdminStorages: React.FC<{ jwt: string; texts: any }> = ({ jwt, texts }) => {
    const [storage, setStorage] = useState<StorageB>({
        number: "",
        isOpened: false,
        price: 0,
        clusterId: "",
        volumes: []
    });

    const [volume, setVolume] = useState<Volume>({
        height: 0,
        width: 0,
        length: 0,
        unit: "m"
    });

    const [storageId, setStorageId] = useState("");
    const [storages, setStorages] = useState<StorageB[]>([]);
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [formType, setFormType] = useState<"add" | "edit" | "delete" | "addVol"|"editVol"|"">("");
    const [tableOpened, setTableOpened] = useState(false);

    const getStorages = async () => {
        try {
            const resp = await axios.get("http://localhost:5000/storages/", {
                headers: { Authorization: "Bearer " + jwt }
            });
            setStorages(resp.data);
        } catch (error:any) {
            console.error("Failed to fetch storages:", error);
            alert(error.response.data.message);
        }
    };

    const getClusters = async () => {
        try {
            const resp = await axios.get("http://localhost:5000/clusters/", {
                headers: { Authorization: "Bearer " + jwt, lang: "EN" }
            });
            setClusters(resp.data.clusters);
        } catch (error:any) {
            console.error("Failed to fetch clusters:", error);
            alert(error.response.data.message)
        }
    };

    const handleAddStorage = () => {
        const { number, price, clusterId } = storage;
        if (!number || !price || !clusterId || !volume) {
            alert("All fields must be filled out");
            return;
        }
        axios.post("http://localhost:5000/storages/", {
            number:storage.number,
            price:storage.price,
            clusterId:storage.clusterId,
            height:volume.height,
            width:volume.width,
            length:volume.length,
            unit:volume.unit
        }, {
            headers: { Authorization: "Bearer " + jwt }
        }).then(resp=>{
            alert(resp.data.message)
        }).then(getStorages).catch(error => {
            alert(error.response.data.message);
        });
    };

    const handleEditStorage = () => {
        if (!storageId) {
            alert("All fields must be filled out");
            return;
        }
        axios.patch(`http://localhost:5000/storages/${storageId}/`, storage, {
            headers: { Authorization: "Bearer " + jwt }
        }).then(resp=>{
            alert(resp.data.message)
        }).then(getStorages).catch(error => {
            alert(error.response.data.message);
        });
    };

    const handleDeleteStorage = () => {
        if (!storageId) {
            alert("All fields must be filled out");
            return;
        }
        axios.delete(`http://localhost:5000/storages/${storageId}/`, {
            headers: { Authorization: "Bearer " + jwt }
        }).then(resp=>{
            alert(resp.data.message)
        }).then(getStorages).catch(error => {
            alert(error.response.data.message);
        });
    };

    const handleAddVolume = () => {
        if (!storageId) {
            alert("All fields must be filled out");
            return;
        }
        axios.post("http://localhost:5000/storages/volume/", { storageId, ...volume }, {
            headers: { Authorization: "Bearer " + jwt }
        }).then(resp=>{
            alert(resp.data.message)
        }).then(getStorages).catch(error => {
            alert(error.response.data.message);
        });
    };

    const handleEditVolume = () => {
        if (!storageId) {
            alert("All fields must be filled out");
            return;
        }
        axios.patch("http://localhost:5000/storages/volume/", { storageId, ...volume }, {
            headers: { Authorization: "Bearer " + jwt }
        }).then(resp=>{
            alert(resp.data.message)
        }).then(getStorages).catch(error => {
            alert(error.response.data.message);
        });
    };

    const handleSelectStorage = (id: string) => {
        setStorageId(id);
        const selectedStorage = storages.find(storage => storage._id === id);
        if (selectedStorage) {
            setStorage(selectedStorage);
            if (selectedStorage.volumes)
                if (selectedStorage.volumes.length > 0) {
                    setVolume(selectedStorage.volumes[0]);
                }
        }
    };

    useEffect(() => {
        getStorages();
        getClusters();
    }, []);

    return (
        <div style={{ overflowY: "auto" , maxHeight: "80vh" }}>
            <h2 className={"cursor-pointer text-center text-2xl my-2"} onClick={()=>{setTableOpened(!tableOpened)}}>{texts.allStorages}</h2>{tableOpened&&
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr>
                    <th className="px-4 py-2 border-b">{texts.number}</th>
                    <th className="px-4 py-2 border-b">{texts.price}</th>
                    <th className="px-4 py-2 border-b">{texts.cluster}</th>
                    <th className="px-4 py-2 border-b">{texts.isOpened}</th>
                    <th className="px-4 py-2 border-b">{texts.volumes}</th>
                </tr>
                </thead>
                <tbody>
                {storages.map((storage) => (
                    <tr key={storage._id}>
                        <td className="px-4 py-2 border-b">{storage.number}</td>
                        <td className="px-4 py-2 border-b">{storage.price}</td>
                        <td className="px-4 py-2 border-b">{clusters.find(cluster => cluster._id === storage.clusterId)?.name || "Unknown"}</td>
                        <td className="px-4 py-2 border-b">{storage.isOpened ? texts.yes : texts.no}</td>
                        <td className="px-4 py-2 border-b">
                            {storage.volumes && storage.volumes.map((volume, index) => (
                                <div key={index}>
                                    {volume.height}x{volume.width}x{volume.length} {volume.unit}
                                </div>
                            ))}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>}
            <div className="flex space-x-4 mt-4">
                <button onClick={() => setFormType("add")}
                        className="bg-gray-200 py-2 px-4 border rounded">{texts.addStorage}</button>
                <button onClick={() => setFormType("edit")}
                        className="bg-gray-200 py-2 px-4 border rounded">{texts.editStorage}</button>
                <button onClick={() => setFormType("delete")}
                        className="bg-gray-200 py-2 px-4 border rounded">{texts.deleteStorage}</button>
                <button onClick={() => setFormType("addVol")}
                        className="bg-gray-200 py-2 px-4 border rounded">{texts.addVolume}</button>
                <button onClick={() => setFormType("editVol")}
                        className="bg-gray-200 py-2 px-4 border rounded">{texts.editVolume}</button>
            </div>

            {formType == "add" &&
                <form onSubmit={e => {
                    e.preventDefault();
                    handleAddStorage()
                }} className="mt-4 p-4 bg-white shadow-md rounded-lg space-y-4">
                    <h3>{texts.addStorage}</h3>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.number}</label>
                        <input value={storage.number}
                               type={'number'}
                               onChange={(e) => setStorage(s => ({...s, number: e.target.value}))}
                               className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.price}</label>
                        <input value={storage.price}
                               type={'number'}
                               onChange={(e) => setStorage(s => ({...s, price: parseFloat(e.target.value)}))}
                               className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.cluster}</label>
                        <select value={storage.clusterId}
                                onChange={(e) => setStorage(s => ({...s, clusterId: e.target.value}))}
                                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="" disabled>{texts.selectCluster}</option>
                            {clusters.map((cluster) => (
                                <option key={cluster._id} value={cluster._id}>
                                    {cluster.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.height}</label>
                        <input value={volume.height}
                               onChange={(e) => setVolume(v => ({...v, height: parseFloat(e.target.value)}))}
                               className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.width}</label>
                        <input value={volume.width}
                               onChange={(e) => setVolume(v => ({...v, width: parseFloat(e.target.value)}))}
                               className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.length}</label>
                        <input value={volume.length}
                               onChange={(e) => setVolume(v => ({...v, length: parseFloat(e.target.value)}))}
                               className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.unit}</label>
                        <select value={volume.unit} onChange={(e) => setVolume(v => ({...v, unit: e.target.value}))}
                                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="m">{texts.meters}</option>
                            <option value="ft">{texts.feet}</option>
                            <option value="yd">{texts.yard}</option>
                            <option value="in">{texts.inch}</option>
                        </select>
                    </div>
                    <button type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">
                        {texts.addStorage}
                    </button>
                </form>}
            {formType == "edit" &&
                <form onSubmit={e => {
                    e.preventDefault();
                    handleEditStorage()
                }} className="mt-4 p-4 bg-white shadow-md rounded-lg space-y-4">
                    <h3>{texts.editStorage}</h3>
                    <div className="flex flex-col">
                        <select value={storageId} onChange={(e) => handleSelectStorage(e.target.value)}
                                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="" disabled>{texts.selectStorage}</option>
                            {storages.map((storage) => (
                                <option key={storage._id} value={storage._id}>
                                    {clusters.find(cluster => cluster._id === storage.clusterId)?.name+" №"+storage.number}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.number}</label>
                        <input value={storage.number}
                               type={'number'}
                               onChange={(e) => setStorage(s => ({...s, number: e.target.value}))}
                               className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.price}</label>
                        <input value={storage.price}
                               type={'number'}
                               onChange={(e) => setStorage(s => ({...s, price: parseFloat(e.target.value)}))}
                               className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.cluster}</label>
                        <select value={storage.clusterId}
                                onChange={(e) => setStorage(s => ({...s, clusterId: e.target.value}))}
                                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="" disabled>{texts.selectCluster}</option>
                            {clusters.map((cluster) => (
                                <option key={cluster._id} value={cluster._id}>
                                    {cluster.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">
                        {texts.editStorage}
                    </button>
                </form>}
            {formType == "delete" &&
                <form onSubmit={e => {
                    e.preventDefault();
                    handleDeleteStorage()
                }} className="mt-4 p-4 bg-white shadow-md rounded-lg space-y-4">
                    <h3>{texts.deleteStorage}</h3>
                    <div className="flex flex-col">
                        <select value={storageId} onChange={(e) => handleSelectStorage(e.target.value)}
                                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="" disabled>{texts.selectStorage}</option>
                            {storages.map((storage) => (
                                <option key={storage._id} value={storage._id}>
                                    {clusters.find(cluster => cluster._id === storage.clusterId)?.name+" №"+storage.number}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit"
                            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200">
                        {texts.deleteStorage}
                    </button>
                </form>}
            {formType == "addVol" &&
                <form onSubmit={e => {
                    e.preventDefault();
                    handleAddVolume()
                }} className="mt-4 p-4 bg-white shadow-md rounded-lg space-y-4">
                    <h3>{texts.addVolume}</h3>
                    <div className="flex flex-col">
                        <select value={storageId} onChange={(e) => handleSelectStorage(e.target.value)}
                                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="" disabled>{texts.selectStorage}</option>
                            {storages.map((storage) => (
                                <option key={storage._id} value={storage._id}>
                                    {clusters.find(cluster => cluster._id === storage.clusterId)?.name + " №" + storage.number}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.unit}</label>
                        <select value={volume.unit} onChange={(e) => setVolume(v => ({...v, unit: e.target.value}))}
                                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="m">{texts.meters}</option>
                            <option value="ft">{texts.feet}</option>
                            <option value="yd">{texts.yard}</option>
                            <option value="in">{texts.inch}</option>
                        </select>
                    </div>
                    <button type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">
                        {texts.addVolume}
                    </button>
                </form>}
            {formType == "editVol" &&
                <form onSubmit={e => {
                    e.preventDefault();
                    handleEditVolume()
                }} className="mt-4 p-4 bg-white shadow-md rounded-lg space-y-4">
                    <h3>{texts.editVolume}</h3>
                    <div className="flex flex-col">
                        <select value={storageId} onChange={(e) => handleSelectStorage(e.target.value)}
                                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="" disabled>{texts.selectStorage}</option>
                            {storages.map((storage) => (
                                <option key={storage._id} value={storage._id}>
                                    {clusters.find(cluster => cluster._id === storage.clusterId)?.name + " №" + storage.number}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.height}</label>
                        <input value={volume.height}
                               onChange={(e) => setVolume(v => ({...v, height: parseFloat(e.target.value)}))}
                               className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.width}</label>
                        <input value={volume.width}
                               onChange={(e) => setVolume(v => ({...v, width: parseFloat(e.target.value)}))}
                               className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.length}</label>
                        <input value={volume.length}
                               onChange={(e) => setVolume(v => ({...v, length: parseFloat(e.target.value)}))}
                               className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.unit}</label>
                        <select value={volume.unit} onChange={(e) => setVolume(v => ({...v, unit: e.target.value}))}
                                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="m">{texts.meters}</option>
                            <option value="ft">{texts.feet}</option>
                            <option value="yd">{texts.yard}</option>
                            <option value="in">{texts.inch}</option>
                        </select>
                    </div>
                    <button type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">
                        {texts.editVolume}
                    </button>
                </form>}
        </div>
    );
};

export default AdminStorages;