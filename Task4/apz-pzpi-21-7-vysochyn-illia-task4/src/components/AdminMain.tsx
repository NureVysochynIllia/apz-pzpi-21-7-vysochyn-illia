import {useEffect, useState} from "react";
import axios from "axios";


type User = {
    _id: string;
    email: string;
    role: string;
    username: string;
};

const AdminMain: React.FC<{ jwt: string; texts: any }> = ({ jwt, texts }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState<string>("user");

    const getUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/admin/users/", {
                headers: { Authorization: "Bearer " + jwt }
            });
            setUsers(response.data.users);
        } catch (error:any) {
            console.error("Failed to fetch users:", error);
            alert(error.response.data.message)
        }
    };

    const changeUserRole = async () => {
        if (!selectedUserId) {
            alert(texts.selectUserAlert);
            return;
        }

        try {
            await axios.patch("http://localhost:5000/admin/role/", {
                userId: selectedUserId,
                role: selectedRole
            }, {
                headers: { Authorization: "Bearer " + jwt }
            });
            alert(texts.roleUpdated);
            getUsers();
        } catch (error:any) {
            console.error("Failed to change user role:", error);
            alert(error.response.data.message);
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.get("http://localhost:5000/admin/export/", {
                headers: { Authorization: "Bearer " + jwt },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error:any) {
            console.error("Failed to export data:", error);
            alert(error.response.data.message);
        }
    };

    const handleImport = async () => {
        try {
            await axios.get("http://localhost:5000/admin/import/", {
                headers: { Authorization: "Bearer " + jwt }
            });
            alert(texts.importSuccess);
        } catch (error:any) {
            console.error("Failed to import data:", error);
            alert(error.response.data.message);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{texts.allUsers}</h2>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr>
                    <th className="px-4 py-2 border-b">{texts.email}</th>
                    <th className="px-4 py-2 border-b">{texts.role}</th>
                    <th className="px-4 py-2 border-b">{texts.username}</th>
                    <th className="px-4 py-2 border-b">{texts.changeRole}</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user._id}>
                        <td className="px-4 py-2 border-b">{user.email}</td>
                        <td className="px-4 py-2 border-b">{user.role}</td>
                        <td className="px-4 py-2 border-b">{user.username}</td>
                        <td className="px-4 py-2 border-b">
                            <select
                                value={user._id === selectedUserId ? selectedRole : user.role}
                                onChange={(e) => {
                                    setSelectedUserId(user._id);
                                    setSelectedRole(e.target.value);
                                }}
                                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="user">{texts.user}</option>
                                <option value="staff">{texts.staff}</option>
                                <option value="admin">{texts.admin}</option>
                            </select>
                            {user._id === selectedUserId && (
                                <button onClick={changeUserRole} className="ml-2 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200">
                                    {texts.changeRole}
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-4 space-x-2">
                <button onClick={handleExport} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200">
                    {texts.exportData}
                </button>
                <button onClick={handleImport} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
                    {texts.importData}
                </button>
            </div>
        </div>
    );
};

export default AdminMain;