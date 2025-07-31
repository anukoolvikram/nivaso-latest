
export const loginFederation = async (email, password) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      email, 
      password,
      userType:'federation'
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error("Login failed. Please check your credentials.");
  }
  return data;
};

export const registerFederation = async (registrationData) => {
  const payload = {
    email: registrationData.email,
    password: registrationData.password,
    isFederation: true,
    name: registrationData.fedName,
    apartment: registrationData.numApartments,
    tenement: registrationData.numTenements,
    userType:'federation'
  };

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error("Registration failed. Please try again.");
  }
  return data;
};
