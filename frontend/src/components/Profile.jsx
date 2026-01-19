import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Camera, 
  Mail, 
  BookOpen, 
  Calendar,
  MapPin,
  Edit2,
  Check,
  X,
  Shield,
  GraduationCap,
  Award,
  FileText,
  Star,
  Sparkles,
  IdCard,
  Building,
  Briefcase,
  Clock,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../api";

function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    notesShared: 0,
    pyqsUploaded: 0,
    reviewsPosted: 0,
    aiQueries: 0
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
    fetchUserStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get("/api/auth/me");
  
      const u = res.data;
  
      const formattedUser = {
        name: u.name,
        email: u.email,
        registrationNo: u.registrationNo,
        department: u.department,
        branch: u.branch || "",
        program: u.program,
        profilePicture: u.profilePhoto || null,
        joinedDate: new Date(u.createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        role: u.role,
        isBanned: u.isBanned || false,
        bio:
          u.bio ||
          `Welcome to my CampusConnect profile! I'm a ${u.department} student.`,
        phone: u.phone || "",
        location: u.location || "",
      };
  
      setUser(formattedUser);
      setEditedUser(formattedUser);
    } catch (err) {
      console.error("Profile fetch failed", err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };
  

  const fetchUserStats = async () => {
    try {
      const [notesRes, pyqRes] = await Promise.all([
        axios.get("/api/notes/my/count"),
        axios.get("/api/pyq/my/count"),
      ]);
  
      setStats({
        notesShared: notesRes.data.count,
        pyqsUploaded: pyqRes.data.count,
        reviewsPosted: 0, // add later when review module is ready
        aiQueries: 0,     // add later if AI usage tracking exists
      });
    } catch (err) {
      console.error("Stats fetch failed", err);
    }
  };
  

  const handleSave = async () => {
    try {
      // Update user data in localStorage
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        ...editedUser
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Dispatch event to notify navbar
      window.dispatchEvent(new Event("userStateChange"));
      
      setUser(editedUser);
      setIsEditing(false);
      
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    if (!file.type.startsWith("image/")) {
      alert("Only images allowed");
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("photo", file);
  
      const res = await axios.put(
        "/api/auth/profile-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const updatedUser = {
        ...user,
        profilePicture: res.data.profilePhoto,
      };
  
      setUser(updatedUser);
      setEditedUser(updatedUser);
  
      const storedUser = JSON.parse(localStorage.getItem("user"));
      storedUser.profilePhoto = res.data.profilePhoto;
      localStorage.setItem("user", JSON.stringify(storedUser));
  
      window.dispatchEvent(new Event("userStateChange"));
  
      alert("Profile picture updated successfully");
    } catch (error) {
      console.error("Profile upload failed", error);
      alert("Profile picture upload failed");
    }
  };
  
      
      



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to view your profile</p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Get program badge color
  const getProgramColor = (program) => {
    switch (program?.toUpperCase()) {
      case "BTECH": return "from-blue-500 to-cyan-500";
      case "MTECH": return "from-purple-500 to-pink-500";
      case "MCA": return "from-green-500 to-emerald-500";
      case "MBA": return "from-orange-500 to-red-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                  Student Profile
                </h1>
                <p className="text-blue-100/80 mt-1">Manage your academic profile</p>
              </div>
            </div>
            
            {user.isBanned && (
              <div className="flex items-center space-x-2 bg-red-500/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Account Restricted</span>
              </div>
            )}
          </div>

          {/* Professional Profile Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full border-4 border-white/30 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden shadow-2xl">
                    {user.profilePicture ? (
                      <img 
                      src={user.profilePicture}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                    
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/30 transition-colors cursor-pointer border border-white/30">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                    <Camera className="h-4 w-4 text-white" />
                  </label>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
                    <h2 className="text-3xl font-bold text-white mb-1 md:mb-0">
                      {user.name}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getProgramColor(user.program)} text-white`}>
                        {user.program}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <IdCard className="h-4 w-4 text-blue-300" />
                        <span className="text-blue-100">ID: {user.registrationNo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-blue-300" />
                        <span className="text-blue-100">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-blue-300" />
                        <span className="text-blue-100">{user.department}</span>
                      </div>
                    </div>
                    
                    {user.branch && (
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-purple-300" />
                        <span className="text-purple-100">Branch: {user.branch}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-center">
                  <Clock className="h-6 w-6 text-blue-300 mx-auto mb-2" />
                  <p className="text-sm text-blue-200/80">Member Since</p>
                  <p className="font-semibold text-white">{user.joinedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-12 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Notes Shared</p>
                <p className="text-3xl font-bold text-blue-600">{stats.notesShared}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500">Contributed study materials</div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">PYQs Uploaded</p>
                <p className="text-3xl font-bold text-purple-600">{stats.pyqsUploaded}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500">Previous year questions</div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl p-6 border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Reviews Posted</p>
                <p className="text-3xl font-bold text-green-600">{stats.reviewsPosted}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Star className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500">Faculty feedback & ratings</div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl p-6 border border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">AI Queries</p>
                <p className="text-3xl font-bold text-orange-600">{stats.aiQueries}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Sparkles className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500">AI assistant interactions</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Academic Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Academic Information Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                  <span>Academic Information</span>
                </h3>
                <button
                  onClick={() => {
                    setEditedUser(user);
                    setIsEditing(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <IdCard className="h-4 w-4" />
                      <span className="text-sm font-medium">Registration Number</span>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.registrationNo}
                        onChange={(e) => setEditedUser({...editedUser, registrationNo: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        placeholder="Enter registration number"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-800">{user.registrationNo}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm font-medium">Department</span>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.department}
                        onChange={(e) => setEditedUser({...editedUser, department: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        placeholder="Enter department"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-800">{user.department}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Award className="h-4 w-4" />
                      <span className="text-sm font-medium">Program</span>
                    </div>
                    {isEditing ? (
                      <select
                        value={editedUser.program}
                        onChange={(e) => setEditedUser({...editedUser, program: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Select Program</option>
                        <option value="BTECH">Bachelor of Technology (BTECH)</option>
                        <option value="MTECH">Master of Technology (MTECH)</option>
                        <option value="MCA">Master of Computer Applications (MCA)</option>
                        <option value="MBA">Master of Business Administration (MBA)</option>
                      </select>
                    ) : (
                      <p className="text-lg font-semibold text-gray-800">{user.program}</p>
                    )}
                  </div>
                  
                  {user.branch && (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Briefcase className="h-4 w-4" />
                        <span className="text-sm font-medium">Branch (MTECH)</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.branch}
                          onChange={(e) => setEditedUser({...editedUser, branch: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                          placeholder="Enter branch"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-800">{user.branch}</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <span className="text-sm font-medium">About Me</span>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editedUser.bio}
                      onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {user.bio}
                    </p>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                  >
                    <Check className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact & Account */}
          <div className="space-y-8">
            {/* Contact Information Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <Mail className="h-6 w-6 text-blue-600" />
                <span>Contact Information</span>
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">Email Address</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">{user.email}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm font-medium">Phone Number</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">{user.phone || "Not provided"}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.location}
                      onChange={(e) => setEditedUser({...editedUser, location: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter location"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">{user.location || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Status Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Account Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-gray-700">Account Type</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {user.role}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-gray-700">Member Since</span>
                  <span className="font-semibold text-gray-800">{user.joinedDate}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-gray-700">Profile Completion</span>
                  <span className="font-semibold text-green-600">85%</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/50">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">Premium Features Available</p>
                    <p className="text-sm text-gray-600 mt-1">Upgrade for unlimited access</p>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                  Upgrade Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add these styles for animations */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Profile;