import {Link, Outlet} from "react-router-dom";

const AdminPanel = () => {
    return (
        <div className="w-full ">
            <nav>
                <ul className="flex space-x-4 w-full justify-center p-4 bg-stone-400">
                    <li>
                        <Link to="/admin/clusters">Clusters</Link>
                    </li>
                    <li>
                        <Link to="/admin/storages">Storages</Link>
                    </li>
                    <li>
                        <Link to="/admin/main">Users</Link>
                    </li>
                    <li>
                        <Link to="/admin/staff">Staff</Link>
                    </li>
                </ul>
            </nav>
            <div className="p-4 justify-evenly flex">
                <Outlet />
            </div>
        </div>
    );
};
export default AdminPanel;