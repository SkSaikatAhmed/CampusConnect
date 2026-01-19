import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  FileText, 
  BookOpen, 
  Star, 
  Sparkles,
  User,
  ChevronDown,
  LogOut,
  Settings,
  Bell,
  Search,
  LogIn,
  UserPlus
} from "lucide-react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to get user from localStorage
const getUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (token) {
      let userData;
      
      // Check if user data is stored as JSON string
      if (storedUser) {
        userData = JSON.parse(storedUser);
      } else {
        // Fallback to individual localStorage items (for backward compatibility)
        userData = {
          name: localStorage.getItem("name") || "Student",
          email: "", // Email might not be stored separately
          role: localStorage.getItem("role") || "STUDENT",
          token: token
        };
      }
      
      return {
        name: userData.name || "Student",
        email: userData.email || "",
        profilePicture: userData.profilePhoto || null,
        department: userData.department || "Not specified",
        semester: userData.semester || "Not specified",
        registrationNo: userData.registrationNo || "",
        program: userData.program || "",
        role: userData.role || "STUDENT",
        isBanned: userData.isBanned || false
      };
    }
    return null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

  // Load user data
  useEffect(() => {
    const loadUser = () => {
      const userData = getUserFromStorage();
      setUser(userData);
      setLoading(false);
    };

    loadUser();

    // Listen for storage changes (when user logs in/out in another tab/window)
    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === "token") {
        loadUser();
      }
    };

    // Listen for custom event (when user logs in/out in same tab)
    const handleUserChange = () => {
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userStateChange", handleUserChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userStateChange", handleUserChange);
    };
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // 1. Clear auth state FIRST
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  
    // 2. Update local React state
    setUser(null);
    setProfileDropdown(false);
  
    // 3. Notify other components (Navbar, guards, etc.)
    window.dispatchEvent(new Event("userStateChange"));
  
    // 4. Now navigate
    navigate("/login", { replace: true });
  };
  

  // Don't show navbar on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // Navigation items with icons
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/notes", label: "Notes", icon: FileText },
    { path: "/pyq", label: "PYQs", icon: BookOpen },
    { path: "/reviews", label: "Reviews", icon: Star },
    { path: "/ai", label: "AI Generator", icon: Sparkles },
  ];

  // Get profile menu items based on user status
  const getProfileMenuItems = () => {
    if (user) {
      return [
        { icon: User, label: "My Profile", path: "/profile" },
        { icon: Settings, label: "Settings", path: "/settings" },
        { icon: Bell, label: "Notifications", path: "/notifications" },
        { 
          icon: LogOut, 
          label: "Logout", 
          onClick: handleLogout,
          isLogout: true 
        },
      ];
    } else {
      return [
        { icon: LogIn, label: "Login", path: "/login" },
        { icon: UserPlus, label: "Register", path: "/register" },
      ];
    }
  };

  const profileMenuItems = getProfileMenuItems();

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  Campus<span className="text-blue-600">Connect</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Section - Search & Profile */}
            <div className="flex items-center space-x-4">
              
              {/* Search Button */}
              <button className="p-2 rounded-full transition-all hover:bg-gray-100 text-gray-600">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications - Only show if logged in */}
              {user && (
                <button className="relative p-2 rounded-full transition-all hover:bg-gray-100 text-gray-600">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
              )}

              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                  disabled={loading}
                >
                  <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-blue-500">
                    {loading ? (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200 animate-pulse">
                        <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                      </div>
                    ) : user && user.profilePicture ? (
                      <img 
                      src={user.profilePicture}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : user ? (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-500">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                    profileDropdown ? "rotate-180" : ""
                  } text-gray-600`} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdown && !loading && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                    {user ? (
                      <>
                        {/* Logged In User Info */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
                              {user.profilePicture ? (
                                <img 
                                src={user.profilePicture}
                                  alt={user.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{user.name}</h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {user.department && user.department !== "Not specified" && (
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                    {user.department}
                                  </span>
                                )}
                                {user.program && (
                                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                                    {user.program}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {profileMenuItems.map((item, index) => (
                            <Link
                              key={index}
                              to={item.path || "#"}
                              onClick={() => {
                                setProfileDropdown(false);
                                if (item.onClick) item.onClick();
                              }}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              <item.icon className="h-4 w-4" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          ))}
                        </div>

                        {/* Upgrade Button */}
                        <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                          <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-[1.02]">
                            ✨ Upgrade to Premium
                          </button>
                        </div>
                      </>
                    ) : (
                      /* Guest User View */
                      <div className="p-4">
                        <div className="text-center mb-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 mx-auto mb-3 flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">Guest User</h3>
                          <p className="text-sm text-gray-600">Login to access all features</p>
                        </div>
                        <div className="space-y-2">
                          {profileMenuItems.map((item, index) => (
                            <Link
                              key={index}
                              to={item.path}
                              onClick={() => setProfileDropdown(false)}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                            >
                              <item.icon className="h-4 w-4" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-gray-200 mt-2 pt-2">
            <div className="flex justify-around">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs mt-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;