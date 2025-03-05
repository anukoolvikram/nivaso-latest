import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import './App.css';

const App = () => {
    const isAuthenticated = localStorage.getItem("token"); 

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="register" element={<Register />} />
                    <Route path="login" element={<Login />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
