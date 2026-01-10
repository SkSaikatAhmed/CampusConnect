export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const isAdmin = () => {
  const role = getRole();
  return role === "ADMIN" || role === "SUPER_ADMIN";
};

export const isSuperAdmin = () => {
  return getRole() === "SUPER_ADMIN";
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};
