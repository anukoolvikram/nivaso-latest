import { Navigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Dashboard from "../HomePages/Dashboard";
import './home.css'

const Home = () => {
    const isAuthenticated = localStorage.getItem("token"); 

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="home">
            <Sidebar />
            <div className="ml-64 flex-1 p-5">
                <Dashboard />
            </div>
        </div>
    );
};

export default Home;
