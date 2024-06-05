import {useEffect, useState} from "react";
import axios from "axios";


const AdminClusters: React.FC<{ jwt: string, texts: any }> = ({ jwt, texts }) => {
    const [cluster, setCluster] = useState<Cluster>({
        city: "",
        location: {
            type: "Point",
            coordinates: [0, 0]
        },
        name: "",
        type: "",
        workTime: {
            from: "",
            to: ""
        }
    });

    const [clusterId, setClusterId] = useState("");
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [formType, setFormType] = useState<"add" | "edit" | "delete" | "">("");
    const [tableOpened, setTableOpened] = useState(false);

    const getClusters = async () => {
        try{
        const resp = await axios.get("http://localhost:5000/clusters/", {
            headers: { Authorization: "Bearer " + jwt, lang:texts.locale }
        });
        setClusters(resp.data.clusters);
        } catch (error:any) {
            console.error("Failed to fetch clusters:", error);
            alert(error.response.data.message)
        }
    }

    const handleCoordinateChange = (index: number, value: string) => {
        setCluster(prevCluster => ({
            ...prevCluster,
            location: {
                ...prevCluster.location,
                coordinates: prevCluster.location.coordinates.map((coord, i) =>
                    i === index ? parseFloat(value) : coord
                ) as Coordinates
            }
        }));
    };

    const handleWorkTimeChange = (field: keyof WorkTime, value: string) => {
        setCluster(prevCluster => ({
            ...prevCluster,
            workTime: {
                ...prevCluster.workTime,
                [field]: value
            }
        }));
    };

    const handleAddCluster = () => {
        const { city, location, name, type, workTime } = cluster;
        const { from, to } = workTime;
        const { coordinates } = location;

        if (
            !city ||
            coordinates.some(coord => coord === 0) ||
            !name ||
            !type ||
            !from ||
            !to
        ) {
            alert(texts.allFieldsMustBeFilled);
            return;
        }
        axios.post("http://localhost:5000/clusters/", {
            name: name,
            location: {
                type: "Point",
                coordinates: coordinates
            },
            city: city,
            type: type,
            workTime: {
                from: from,
                to: to
            }
        }, {
            headers: { Authorization: "Bearer " + jwt }
        }).then(resp=>{
            alert(resp.data.message)
            getClusters();
        }).catch(error => {
            alert(error.response.data.message);
        });
    }

    const handleSelectCluster = (e: string) => {
        setClusterId(e);
        const editCluster = clusters.find(cluster => cluster._id === e);
        if (editCluster) {
            setCluster(editCluster);
        }
    }

    const handleEditCluster = () => {
        const { city, location, name, type, workTime } = cluster;
        const { from, to } = workTime;
        const { coordinates } = location;

        if (
            !city ||
            coordinates.some(coord => coord === 0) ||
            !name ||
            !type ||
            !from ||
            !to || clusterId === ""
        ) {
            alert(texts.allFieldsMustBeFilled);
            return;
        }
        axios.patch(`http://localhost:5000/clusters/${clusterId}/`, {
            name: name,
            location: {
                type: "Point",
                coordinates: coordinates
            },
            city: city,
            type: type,
            workTime: {
                from: from,
                to: to
            }
        }, {
            headers: { Authorization: "Bearer " + jwt }
        }).then(resp=>{
            alert(resp.data.message)
            getClusters();
        }).catch(error => {
            alert(error.response.data.message);
        });
    }

    const handleDeleteCluster = () => {
        if (clusterId === "") {
            alert(texts.allFieldsMustBeFilled);
            return;
        }
        axios.delete(`http://localhost:5000/clusters/${clusterId}/`, {
            headers: { Authorization: "Bearer " + jwt }
        }).then(resp=>{
            alert(resp.data.message)
            getClusters();
        }).catch(error => {
            alert(error.response.data.message);
        });
    }

    useEffect(() => {
        getClusters();
    }, []);

    return (
        <div style={{ overflowY: "auto" , maxHeight: "80vh" }}>
            <h2 className={"cursor-pointer text-center text-2xl my-2"} onClick={()=>{setTableOpened(!tableOpened)}}>{texts.allClusters}</h2>
            {tableOpened&&<table className="min-w-full bg-white border border-gray-300">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">{texts.name}</th>
                    <th className="py-2 px-4 border-b">{texts.city}</th>
                    <th className="py-2 px-4 border-b">{texts.type}</th>
                    <th className="py-2 px-4 border-b">{texts.latitude}</th>
                    <th className="py-2 px-4 border-b">{texts.longitude}</th>
                    <th className="py-2 px-4 border-b">{texts.workFrom}</th>
                    <th className="py-2 px-4 border-b">{texts.workTo}</th>
                </tr>
                </thead>
                <tbody>
                {clusters.map((cluster) => (
                    <tr key={cluster._id}>
                        <td className="py-2 px-4 border-b">{cluster.name}</td>
                        <td className="py-2 px-4 border-b">{cluster.city}</td>
                        <td className="py-2 px-4 border-b">{cluster.type}</td>
                        <td className="py-2 px-4 border-b">{cluster.location.coordinates[0]}</td>
                        <td className="py-2 px-4 border-b">{cluster.location.coordinates[1]}</td>
                        <td className="py-2 px-4 border-b">{cluster.workTime.from}</td>
                        <td className="py-2 px-4 border-b">{cluster.workTime.to}</td>
                    </tr>
                ))}
                </tbody>
            </table>}

            <div className="flex space-x-4 mt-4">
                <button onClick={() => setFormType("add")} className="bg-gray-200 py-2 px-4 border rounded">{texts.addCluster}</button>
                <button onClick={() => setFormType("edit")} className="bg-gray-200 py-2 px-4 border rounded">{texts.editCluster}</button>
                <button onClick={() => setFormType("delete")} className="bg-gray-200 py-2 px-4 border rounded">{texts.deleteCluster}</button>
            </div>

            {formType === "add" && (
                <form onSubmit={e => {
                    e.preventDefault();
                    handleAddCluster();
                }} className="mt-4 p-4 bg-white shadow-md rounded-lg space-y-4">
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.name}</label>
                        <input
                            value={cluster.name}
                            onChange={(e) => setCluster(c => ({...c, name: e.target.value}))}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.city}</label>
                        <input
                            value={cluster.city}
                            onChange={(e) => setCluster(c => ({...c, city: e.target.value}))}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.type}</label>
                        <input
                            value={cluster.type}
                            onChange={(e) => setCluster(c => ({...c, type: e.target.value}))}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.latitude}</label>
                        <input
                            value={cluster.location.coordinates[0]}
                            onChange={(e) => handleCoordinateChange(0, e.target.value)}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.longitude}</label>
                        <input
                            value={cluster.location.coordinates[1]}
                            onChange={(e) => handleCoordinateChange(1, e.target.value)}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.workFrom}</label>
                        <input
                            type={"time"}
                            value={cluster.workTime.from}
                            onChange={(e) => handleWorkTimeChange('from', e.target.value)}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.workTo}</label>
                        <input
                            type={"time"}
                            value={cluster.workTime.to}
                            onChange={(e) => handleWorkTimeChange('to', e.target.value)}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        {texts.confirm}
                    </button>
                </form>
            )}

            {formType === "edit" && (
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        handleEditCluster();
                    }}
                    className="mt-4 p-4 bg-white shadow-md rounded-lg space-y-4"
                >
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.selectCluster}</label>
                        <select
                            value={clusterId}
                            onChange={(e) => handleSelectCluster(e.target.value)}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>{texts.selectCluster}</option>
                            {clusters.map((cluster) => (
                                <option key={cluster._id} value={cluster._id}>
                                    {cluster.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.name}</label>
                        <input
                            value={cluster.name}
                            onChange={(e) => setCluster(c => ({...c, name: e.target.value}))}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.city}</label>
                        <input
                            value={cluster.city}
                            onChange={(e) => setCluster(c => ({...c, city: e.target.value}))}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.type}</label>
                        <input
                            value={cluster.type}
                            onChange={(e) => setCluster(c => ({...c, type: e.target.value}))}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.latitude}</label>
                        <input
                            value={cluster.location.coordinates[0]}
                            onChange={(e) => handleCoordinateChange(0, e.target.value)}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.longitude}</label>
                        <input
                            value={cluster.location.coordinates[1]}
                            onChange={(e) => handleCoordinateChange(1, e.target.value)}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.workFrom}</label>
                        <input
                            type={"time"}
                            value={cluster.workTime.from}
                            onChange={(e) => handleWorkTimeChange('from', e.target.value)}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.workTo}</label>
                        <input
                            type={"time"}
                            value={cluster.workTime.to}
                            onChange={(e) => handleWorkTimeChange('to', e.target.value)}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        {texts.confirm}
                    </button>
                </form>
            )}

            {formType === "delete" && (
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        handleDeleteCluster();
                    }}
                    className="mt-4 p-4 bg-white shadow-md rounded-lg space-y-4"
                >
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">{texts.selectCluster}</label>
                        <select
                            value={clusterId}
                            onChange={(e) => handleSelectCluster(e.target.value)}
                            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>{texts.selectCluster}</option>
                            {clusters.map((cluster) => (
                                <option key={cluster._id} value={cluster._id}>
                                    {cluster.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200"
                    >
                        {texts.confirm}
                    </button>
                </form>
            )}
        </div>
    );
}

export default AdminClusters;