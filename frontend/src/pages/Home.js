import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreVertical,
  Filter,
  Search,
  Plus,
  TrendingUp,
  Calendar,
  Users,
  FileText,
  Bell,
  Clock,
  MapPin,
  Eye,
  ThumbsUp,
  Download,
  CheckCircle
} from 'lucide-react';

// Custom UI Components (No ShadCN required)
const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    link: "text-blue-600 underline-offset-4 hover:underline"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-9 rounded-md px-3 text-sm",
    lg: "h-11 rounded-md px-8 text-base",
    icon: "h-10 w-10"
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", type = "text", ...props }) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Badge = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800 border border-blue-200",
    secondary: "bg-gray-100 text-gray-800 border border-gray-200",
    destructive: "bg-red-100 text-red-800 border border-red-200",
    outline: "border border-gray-300 text-gray-700",
    success: "bg-green-100 text-green-800 border border-green-200"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = "" }) => (
  <div className={`p-6 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

const Avatar = ({ children, className = "", src, fallback }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
    {src ? (
      <img src={src} alt="Avatar" className="aspect-square h-full w-full" />
    ) : (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
        {fallback}
      </div>
    )}
  </div>
);

const Tabs = ({ children, value, onValueChange }) => {
  return (
    <div className="tabs">
      {React.Children.map(children, child => 
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  );
};

const TabsList = ({ children, className = "" }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 ${className}`}>
    {children}
  </div>
);

const TabsTrigger = ({ children, value, className = "" }) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm ${className}`}
    data-state={value === 'all' ? 'active' : ''}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value, className = "" }) => (
  <div className={`mt-2 ${className}`}>
    {children}
  </div>
);

const DropdownMenu = ({ children, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownMenuTrigger = ({ children }) => children;
const DropdownMenuContent = ({ children }) => <div>{children}</div>;
const DropdownMenuItem = ({ children, className = "" }) => (
  <div className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 ${className}`}>
    {children}
  </div>
);

// Mock data
const mockPosts = [
  {
    id: 1,
    user: {
      name: "Aarav Sharma",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav",
      role: "Computer Science",
      verified: true
    },
    content: "Just found an amazing resource for Data Structures! All PYQs from 2015-2023 with solutions. Sharing the drive link in comments.",
    media: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&auto=format&fit=crop",
    type: "Resource Share",
    category: "PYQs",
    likes: 42,
    comments: 8,
    shares: 3,
    saves: 12,
    views: 156,
    timestamp: "2 hours ago",
    isLiked: false,
    isSaved: false
  },
  {
    id: 2,
    user: {
      name: "Priya Patel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      role: "Event Coordinator",
      verified: true
    },
    content: "🎉 Hackathon 2024 registrations are open! Win prizes worth ₹50,000. Last date: 25th Dec. Register now at campus-hackathon.in",
    media: null,
    type: "Event Announcement",
    category: "Campus Event",
    likes: 89,
    comments: 24,
    shares: 45,
    saves: 31,
    views: 420,
    timestamp: "5 hours ago",
    isLiked: true,
    isSaved: true
  },
  {
    id: 3,
    user: {
      name: "Rohan Verma",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
      role: "Mathematics",
      verified: false
    },
    content: "Lost my laptop charger in the Central Library yesterday. It's a Dell 65W Type-C charger. Please DM if found! #LostAndFound",
    media: null,
    type: "Lost Item",
    category: "Help",
    likes: 15,
    comments: 7,
    shares: 3,
    saves: 2,
    views: 98,
    timestamp: "1 day ago",
    isLiked: false,
    isSaved: false
  },
  {
    id: 4,
    user: {
      name: "Dr. Mehta",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehta",
      role: "Faculty",
      verified: true
    },
    content: "Attention all final year students: Project submission deadline extended to January 15th. Please check your emails for updated guidelines.",
    media: "https://images.unsplash.com/photo-1589279003513-467d320f6c6d?w=800&auto=format&fit=crop",
    type: "Official Announcement",
    category: "Academic",
    likes: 67,
    comments: 12,
    shares: 28,
    saves: 41,
    views: 312,
    timestamp: "1 day ago",
    isLiked: true,
    isSaved: false
  },
  {
    id: 5,
    user: {
      name: "Ananya Singh",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
      role: "Electrical Engineering",
      verified: true
    },
    content: "Sharing my complete notes for Circuit Theory. Includes diagrams, formulas, and solved examples. Hope it helps!",
    media: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop",
    type: "Notes Share",
    category: "Study Material",
    likes: 123,
    comments: 18,
    shares: 31,
    saves: 87,
    views: 567,
    timestamp: "2 days ago",
    isLiked: false,
    isSaved: true
  }
];

const trendingTopics = [
  { name: "Exam Schedule", posts: 45 },
  { name: "Hackathon 2024", posts: 32 },
  { name: "Placement Prep", posts: 28 },
  { name: "Festival Week", posts: 24 },
  { name: "Hostel Issues", posts: 19 }
];

const upcomingEvents = [
  { title: "Cultural Fest", date: "Dec 20", location: "Auditorium" },
  { title: "Tech Talk: AI", date: "Dec 22", location: "CS Dept" },
  { title: "Sports Day", date: "Dec 25", location: "Ground" }
];

function Home() {
  const [posts, setPosts] = useState(mockPosts);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter(post => {
    if (activeTab === "all") return true;
    if (activeTab === "announcements") return post.type.includes("Announcement");
    if (activeTab === "resources") return ["Resource Share", "Notes Share"].includes(post.type);
    if (activeTab === "events") return post.type.includes("Event");
    if (activeTab === "help") return ["Lost Item", "Help"].includes(post.type);
    return true;
  });

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleSave = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isSaved: !post.isSaved,
            saves: post.isSaved ? post.saves - 1 : post.saves + 1
          }
        : post
    ));
  };

  const handleShare = (postId) => {
    const post = posts.find(p => p.id === postId);
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, shares: p.shares + 1 } : p
    ));
    alert(`Sharing post: "${post.content.substring(0, 50)}..."`);
  };

  const PostCard = ({ post }) => (
    <Card className="mb-6 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar src={post.user.avatar} fallback={post.user.name.charAt(0)} />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                {post.user.verified && (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-blue-600 ml-1">Verified</span>
                  </div>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <span>{post.user.role}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {post.timestamp}
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu
            trigger={
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            }
          >
            <DropdownMenuContent>
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Hide post</DropdownMenuItem>
              <DropdownMenuItem>Mute user</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <Badge className="mb-2">
            {post.type}
          </Badge>
          <p className="text-gray-800">{post.content}</p>
        </div>
        
        {post.media && (
          <div className="rounded-lg overflow-hidden mb-4">
            <img 
              src={post.media} 
              alt="Post media" 
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              {post.likes} likes
            </span>
            <span>{post.comments} comments</span>
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {post.views} views
            </span>
          </div>
          {post.category === "PYQs" || post.category === "Study Material" ? (
            <Badge variant="success" className="flex items-center">
              <Download className="h-3 w-3 mr-1" />
              Download Available
            </Badge>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3">
        <div className="flex w-full space-x-1">
          <Button 
            variant="ghost" 
            size="sm"
            className={`flex-1 ${post.isLiked ? 'text-red-500' : ''}`}
            onClick={() => handleLike(post.id)}
          >
            <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-red-500' : ''}`} />
            Like
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Comment
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1"
            onClick={() => handleShare(post.id)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1"
            onClick={() => handleSave(post.id)}
          >
            <Bookmark className={`h-4 w-4 mr-2 ${post.isSaved ? 'fill-blue-500' : ''}`} />
            Save
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to CampusConnect</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            Your central hub for campus resources, announcements, and connections. 
            Stay updated, share knowledge, and grow together.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="search"
                  placeholder="Search for notes, events, or people..."
                  className="pl-10 bg-white text-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              <Plus className="h-5 w-5 mr-2" />
              Create New Post
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-24 mb-6">
              <CardHeader>
                <h3 className="font-semibold text-lg text-gray-900">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Notes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Post Announcement
                </Button>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Trending Topics
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <span className="font-medium text-gray-900">#{topic.name}</span>
                      <Badge variant="secondary">{topic.posts} posts</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Events
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="font-semibold text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {event.date}
                        <MapPin className="h-3 w-3 ml-3 mr-1" />
                        {event.location}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:w-2/4">
            <div className="mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Posts</TabsTrigger>
                  <TabsTrigger value="announcements">Announcements</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="help">Help</TabsTrigger>
                </TabsList>
                
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Campus Feed</h2>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <TabsContent value={activeTab} className="mt-0">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => <PostCard key={post.id} post={post} />)
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-gray-500">No posts found in this category.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Feed End Message */}
            <div className="text-center py-8">
              <p className="text-gray-500">You're all caught up! 🎉</p>
              <p className="text-sm text-gray-400 mt-2">
                New posts will appear here as they're created
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-1/4">
            <Card className="mb-6">
              <CardHeader>
                <h3 className="font-semibold text-lg text-gray-900">Campus Stats</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Users</span>
                    <span className="font-bold text-gray-900">1,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Resources Shared</span>
                    <span className="font-bold text-gray-900">567</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Live Events</span>
                    <span className="font-bold text-gray-900">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Posts Today</span>
                    <span className="font-bold text-gray-900">48</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg text-gray-900">Top Contributors</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Alex Chen', 'Sneha Roy', 'Vikram Singh', 'Neha Kapoor'].map((name, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Avatar fallback={name.charAt(0)} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{name}</div>
                        <div className="text-xs text-gray-500">{index * 24 + 42} contributions</div>
                      </div>
                      <Badge>#{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;