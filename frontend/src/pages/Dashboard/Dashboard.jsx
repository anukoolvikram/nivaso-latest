import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchUserInfo } from "../../services/authService"
// components
import Loading from "../../components/Loading/Loading"
import DashboardLayout from "../../Layout/DashboardLayout"
import { federationConfig } from "../../config/federationConfig"
import { societyConfig } from "../../config/societyConfig"
import { residentConfig } from "../../config/residentConfig"

export default function Dashboard() {
  const [dashboardType, setDashboardType] = useState()
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const userData = await fetchUserInfo(token);
        setLoading(false);
        setDashboardType(userData.role)
      } catch (error) {
        console.error('Invalid token, removing and redirecting:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);


  if (loading) {
    return <Loading/>;
  }

  switch (dashboardType) {
    case 'federation':
      return  <DashboardLayout pageConfig={federationConfig} role="federation" defaultPage="Profile"/>
    case 'society':
      return <DashboardLayout pageConfig={societyConfig} role="society" defaultPage="Profile"/>
    case 'resident':
      return <DashboardLayout pageConfig={residentConfig} role="resident" defaultPage="Profile"/>
  }
}