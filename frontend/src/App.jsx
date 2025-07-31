import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Dashboard from './pages/Dashboard/Dashboard';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='*' element={<Home />} />
            </Routes>
        </Router>
    );
};

export default App;
