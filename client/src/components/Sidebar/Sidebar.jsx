import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="w-64 h-screen bg-gray-800 text-white p-5">
            <h2 className="text-xl font-bold mb-4">Menu</h2>
            <ul>
                <li className="mb-2"><Link to="/dashboard" className="block p-2 hover:bg-gray-700">Dashboard</Link></li>
                <li className="mb-2"><Link to="/settings" className="block p-2 hover:bg-gray-700">Settings</Link></li>
                <li className="mb-2"><Link to="/profile" className="block p-2 hover:bg-gray-700">Profile</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
