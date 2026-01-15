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
  Upload,
  User,
  Shield,
  GraduationCap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (token && storedUser) {
        // Parse stored user data
        const userData = JSON.parse(storedUser);
        
        // If you have an API endpoint to get user details, use it:
        // const response = await axios.get('/api/user/profile', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const userData = response.data;
        
        setUser({
          name: userData.name || "Student",
          email: userData.email || "",
          profilePicture: userData.profilePhoto || null,
          department: userData.department || "Not specified",
          branch: userData.branch || "",
          program: userData.program || "Not specified",
          registrationNo: userData.registrationNo || "",
          semester: userData.semester || "",
          phone: userData.phone || "",
          location: userData.location || "",
          bio: userData.bio || "CampusConnect user. Join me in sharing knowledge!",
          joinedDate: new Date(userData.createdAt || Date.now()).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          }),
          role: userData.role || "STUDENT",
          isBanned: userData.isBanned || false
        });
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Redirect to login if unauthorized
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Mock API calls - replace with actual API endpoints
        // const notesResponse = await axios.get('/api/user/stats/notes', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setStats(prev => ({ ...prev, notesShared: notesResponse.data.count }));
        
        // For now, using mock data
        setStats({
          notesShared: 42,
          pyqsUploaded: 18,
          reviewsPosted: 27,
          aiQueries: 156
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Update user data in localStorage
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        ...editedUser
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // If you have an API endpoint to update user, use it:
      // await axios.put('/api/user/profile', editedUser, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      setUser(editedUser);
      setIsEditing(false);
      
      // Show success message
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

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("File size must be less than 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profilePhoto', file);
      
      // If you have an API endpoint for profile picture upload, use it:
      // const token = localStorage.getItem("token");
      // const response = await axios.post('/api/user/upload-profile', formData, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      
      // For now, create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      
      const updatedUser = {
        ...user,
        profilePicture: imageUrl
      };
      
      setUser(updatedUser);
      if (editedUser) {
        setEditedUser(updatedUser);
      }
      
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      storedUser.profilePhoto = imageUrl;
      localStorage.setItem("user", JSON.stringify(storedUser));
      
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture");
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
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No User Found</h2>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold">My Profile</h1>
            </div>
            {user.isBanned && (
              <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Account Restricted</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            
            <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden shadow-xl">
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
                <label className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                  <Camera className="h-4 w-4 text-gray-700" />
                </label>
              </div>
              
              <div className="mb-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                    className="text-2xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none text-white"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                )}
                <p className="text-white/90 flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm px-2 py-1 bg-white/20 rounded-full">
                    {user.role}
                  </span>
                  {user.registrationNo && (
                    <span className="text-sm px-2 py-1 bg-white/20 rounded-full">
                      ID: {user.registrationNo}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            {/* Edit Button */}
            <div className="flex justify-end mb-6">
              {isEditing ? (
                <div className="flex space-x-2">
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
              ) : (
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
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {stats.notesShared}
                </div>
                <div className="text-sm text-gray-600">Notes Shared</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {stats.pyqsUploaded}
                </div>
                <div className="text-sm text-gray-600">PYQs Uploaded</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {stats.reviewsPosted}
                </div>
                <div className="text-sm text-gray-600">Reviews Posted</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {stats.aiQueries}
                </div>
                <div className="text-sm text-gray-600">AI Queries</div>
              </div>
            </div>

            {/* User Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-blue-500" />
                    <span>Academic Information</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedUser.department}
                            onChange={(e) => setEditedUser({...editedUser, department: e.target.value})}
                            className="font-medium border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                          />
                        ) : (
                          <p className="font-medium">{user.department}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-500">Program</p>
                        {isEditing ? (
                          <select
                            value={editedUser.program}
                            onChange={(e) => setEditedUser({...editedUser, program: e.target.value})}
                            className="font-medium border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                          >
                            <option value="">Select Program</option>
                            <option value="BTECH">BTECH</option>
                            <option value="MTECH">MTECH</option>
                            <option value="MCA">MCA</option>
                            <option value="MBA">MBA</option>
                          </select>
                        ) : (
                          <p className="font-medium">{user.program}</p>
                        )}
                      </div>
                    </div>

                    {user.branch && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-500">Branch (MTECH)</p>
                          <p className="font-medium">{user.branch}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Bio</h3>
                  {isEditing ? (
                    <textarea
                      value={editedUser.bio}
                      onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      rows="3"
                    />
                  ) : (
                    <p className="text-gray-700">{user.bio}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editedUser.email}
                            onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                            className="font-medium border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                          />
                        ) : (
                          <p className="font-medium">{user.email}</p>
                        )}
                      </div>
                    </div>
                    
                    {user.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editedUser.phone}
                              onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                              className="font-medium border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                            />
                          ) : (
                            <p className="font-medium">{user.phone}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {user.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedUser.location}
                              onChange={(e) => setEditedUser({...editedUser, location: e.target.value})}
                              className="font-medium border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                            />
                          ) : (
                            <p className="font-medium">{user.location}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">CampusConnect Member Since</h3>
                  <p className="text-gray-700">{user.joinedDate}</p>
                  <div className="mt-3 text-sm text-gray-600">
                    <p className="flex items-center space-x-2 mb-1">
                      <span className="text-blue-500">✨</span>
                      <span>Premium Features Available</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <span className="text-green-500">📱</span>
                      <span>Mobile App Coming Soon</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Phone icon component
const Phone = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

export default Profile;