export const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };
  
  export const isAdmin = () => {
    return localStorage.getItem("role") === "ADMIN";
  };
  