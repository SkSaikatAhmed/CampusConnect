export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const getRole = () => {
  return getUser()?.role || null;
};

export const isAdmin = () => {
  const role = getRole();
  return role === "ADMIN" || role === "SUPER_ADMIN";
};

export const isSuperAdmin = () => {
  return getRole() === "SUPER_ADMIN";
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
