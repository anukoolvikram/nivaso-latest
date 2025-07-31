import axios from 'axios';

export const register = (data) => {
  const payload = {
    email: data.email,
    password: data.password,
    society_code: data.societyCode,
    society_name: data.societyName,
    no_of_wings: data.noOfWings,
    floor_per_wing: data.floorPerWing,
    rooms_per_floor: data.roomsPerFloor,
    userType:'society'
  };
  return axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, payload);
};

export const selfRegister = (data) => {
  const payload = {
    email: data.email,
    password: data.password,
    society_name: data.societyName,
    no_of_wings: data.noOfWings,
    floor_per_wing: data.floorPerWing,
    rooms_per_floor: data.roomsPerFloor,
    society_type: data.societyType,
  };
  return axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/self-register`, payload);
};

export const handleAuthSuccess = (data, navigate) => {
  localStorage.setItem("token", data.token);
  navigate("/");
};
