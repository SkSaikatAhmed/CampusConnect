import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import {
  FaThumbsUp, FaHeart, FaSadTear, FaAngry,
  FaShare, FaComment, FaImage, FaLink,
  FaPaperPlane, FaEllipsisH, FaSmile,
  FaGlobeAmericas, FaUserFriends, FaLock
} from "react-icons/fa";
import { MdEmojiEmotions } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

const CATEGORIES = [
  "GENERAL",
  "ANNOUNCEMENT",
  "LOST_ITEM",
  "EVENT",
  "SPORTS",
  "CODING",
  "HOSTEL",
  "AWARENESS",
  "HELP",
  "PLACEMENT",
  "FEST",
  "COMPETITION",
];

const REACTIONS = [
  { type: "like", label: "Like", icon: "👍", color: "#1877F2", emoji: "👍" },
  { type: "love", label: "Love", icon: "❤️", color: "#F02849", emoji: "❤️" },
  { type: "sad", label: "Sad", icon: "😢", color: "#F7B928", emoji: "😢" },
  { type: "angry", label: "Angry", icon: "😠", color: "#E41E3F", emoji: "😠" },
];

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function Home() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [postCategory, setPostCategory] = useState("GENERAL");
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [activeReaction, setActiveReaction] = useState({});
  const [hoveredPostId, setHoveredPostId] = useState(null);
  const navigate = useNavigate();
  const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

  const observer = useRef();
  const lastPostRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // ---------------- FETCH POSTS ----------------
  const fetchPosts = async (pageNum = 1, reset = false) => {
    setLoading(true);
    try {
      const url = category
        ? `${API}/posts?category=${category}&page=${pageNum}&limit=10`
        : `${API}/posts?page=${pageNum}&limit=10`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.length) {
        setHasMore(false);
        return;
      }

      const userId = localStorage.getItem("token")
        ? JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id
        : null;

        const processedPosts = data.map((p) => {
          let myReaction = null;
        
          ["like", "love", "sad", "angry"].forEach((r) => {
            if (p.reactions?.[r]?.includes(userId)) {
              myReaction = r;
            }
          });
        
          return {
            ...p,
            myReaction,
          };
        });
        

      if (reset) {
        setPosts(processedPosts);
      } else {
        setPosts(prev => [...prev, ...processedPosts]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, true);
  }, [category]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  // ---------------- FIXED REAL-TIME REACTIONS ----------------
  useEffect(() => {
    const handleReaction = ({ postId, reactions, userId: reactingUserId }) => {
      const currentUserId = localStorage.getItem("token")
        ? JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id
        : null;

      setPosts(prev => prev.map(post => {
        if (post._id !== postId) return post;

        const reactionTypes = ["like", "love", "sad", "angry"];
        let myReaction = post.myReaction;

        // If current user is the one who reacted, update their reaction
        if (currentUserId === reactingUserId) {
          myReaction = null;
          reactionTypes.forEach(r => {
            if (reactions[r]?.includes(currentUserId)) {
              myReaction = r;
            }
          });
        } else {
          // For other users, preserve current user's reaction
          if (myReaction && !reactions[myReaction]?.includes(currentUserId)) {
            myReaction = null;
          }
        }

        return {
          ...post,
          reactions,
            myReaction,

        };
      }));
    };

    socket.on("post-reacted", handleReaction);

    socket.on("new-comment", (comment) => {
      setComments(prev => ({
        ...prev,
        [comment.post]: [...(prev[comment.post] || []), comment],
      }));

      setPosts(prev =>
        prev.map(p =>
          p._id === comment.post
            ? { ...p, commentsCount: p.commentsCount + 1 }
            : p
        )
      );
    });

    socket.on("post-shared", ({ postId, shares }) => {
      setPosts(prev =>
        prev.map(p =>
          p._id === postId ? { ...p, shares } : p
        )
      );
    });

    return () => {
      socket.off("post-reacted");
      socket.off("new-comment");
      socket.off("post-shared");
    };
  }, []);

  // ---------------- CREATE POST ----------------
  const createPost = async () => {
    if (!localStorage.getItem("token")) {
      alert("Login required");
      return;
    }

    if (!content && !image) {
      alert("Post must have text or image");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    formData.append("category", postCategory);
    if (link) formData.append("link", link);
    if (image) formData.append("image", image);

    await fetch(`${API}/posts`, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    });

    setContent("");
    setLink("");
    setImage(null);
    setImagePreview(null);

    fetchPosts(1, true);
  };

  // ---------------- REACT TO POST (Facebook-style) ----------------
  const reactPost = async (postId, type) => {
    const post = posts.find(p => p._id === postId);
  
    let finalType = type;
  
    // Withdraw if same reaction clicked
    if (post.myReaction === type) {
      finalType = null;
    }
  
    // Optimistic UI (smooth like Facebook)
    setPosts(prev =>
      prev.map(p => {
        if (p._id !== postId) return p;
  
        const reactions = { ...p.reactions };
  
        // remove user from all
        ["like", "love", "sad", "angry"].forEach(r => {
          reactions[r] = reactions[r].filter(
            id => id !== user._id
          );
        });
  
        if (finalType) {
          reactions[finalType].push(user._id);
        }
  
        return { ...p, reactions, myReaction: finalType };
      })
    );
  
    await fetch(`${API}/posts/${postId}/react`, {
      method: "POST",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: finalType }),
    });
  };
  

  // ---------------- SHARE POST ----------------
  const sharePost = async (postId) => {
    const shareUrl = `${window.location.origin}/post/${postId}`;

    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: "CampusConnect Post",
          text: "Check out this post",
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.log("Native share failed, fallback used");
      }
    }

    await navigator.clipboard.writeText(shareUrl);
    alert("Post link copied! You can share it anywhere.");
  };

  // ---------------- COMMENTS ----------------
  const loadComments = async (postId) => {
    socket.emit("join-post", postId);

    const res = await fetch(`${API}/comments/${postId}`);
    const data = await res.json();
    setComments(prev => ({ ...prev, [postId]: data }));
  };

  const addComment = async (postId) => {
    if (!localStorage.getItem("token")) {
      alert("Login required");
      return;
    }

    await fetch(`${API}/comments`, {
      method: "POST",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId,
        text: commentText[postId],
      }),
    });

    setCommentText(prev => ({ ...prev, [postId]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getReactionCounts = (post) => {
    return REACTIONS.filter(r => post.reactions?.[r.type]?.length > 0)
      .map(r => ({
        type: r.type,
        emoji: r.emoji,
        count: post.reactions[r.type].length,
      }));
  };
  
  

  return (
    <div className="facebook-feed">

      <div className="main-container">
        {/* LEFT SIDEBAR - SIMPLIFIED FOR MOBILE */}
        <aside className="left-sidebar">
          {/* <div className="sidebar-section">
            <button className="sidebar-item active">
              <FaThumbsUp />
              <span>News Feed</span>
            </button>
            <button className="sidebar-item">
              <FaUserFriends />
              <span>Friends</span>
            </button>
            <button className="sidebar-item">
              <FaGlobeAmericas />
              <span>Groups</span>
            </button>
          </div> */}

          {/* CATEGORIES FOR MOBILE */}
          <div className="mobile-categories">
            <div className="categories-header">
              <h3>Categories</h3>
              <button 
                className="categories-toggle"
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              >
                {showCategoryMenu ? "Hide" : "Show"}
              </button>
            </div>
            
            {showCategoryMenu && (
              <div className="categories-grid">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`category-chip ${category === cat ? 'active' : ''}`}
                    onClick={() => setCategory(category === cat ? "" : cat)}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* MAIN FEED */}
        <main className="feed-main">
          {/* CREATE POST */}
          <div className="create-post-container">
            <div className="create-post-header">
              <div className="post-author">
              <div
  className="author-avatar clickable"
  onClick={() => navigate("/profile")}
>
  {user?.profilePhoto ? (
    <img
      src={user.profilePhoto}
      alt={user.name}
      className="avatar-img"
    />
  ) : (
    <span>{user?.name?.charAt(0) || "Y"}</span>
  )}
</div>


                <div className="author-info">
                  <div className="author-name">What's on your mind?</div>
                  <div className="post-privacy">
                    <FaGlobeAmericas />
                    <span>Public</span>
                  </div>
                </div>
              </div>
            </div>






            <div className="create-post-body">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..."
                className="post-input"
                rows="3"
              />
              
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" />
                  <button 
                    className="remove-image"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    ×
                  </button>
                </div>
              )}

              {link && (
                <div className="link-preview">
                  <FaLink />
                  <span>{link}</span>
                </div>
              )}

              <div className="create-post-actions">
                <label className="action-btn photo-btn">
                  <FaImage />
                  <span>Photo/Video</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
                
                {/* <button className="action-btn feeling-btn">
                  <MdEmojiEmotions />
                  <span>Feeling/Activity</span>
                </button> */}

                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="category-select"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={createPost} 
              className="post-button"
              disabled={!content && !image}
            >
              Post
            </button>
          </div>

          {/* POSTS FEED */}
          <div className="posts-feed">
            {posts.map((post, index) => {
              
              return (
                <div 
                  key={post._id} 
                  className="post-card"
                  ref={index === posts.length - 5 ? lastPostRef : null}

                >
                  {/* POST HEADER */}
                  <div className="post-header">
                    <div className="post-author">
                    <div
  className="author-avatar clickable"
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/profile/${post.author._id}`);
  }}
>
  {post.author?.profilePhoto ? (
    <img
      src={post.author.profilePhoto}
      alt={post.author.name}
      className="avatar-img"
    />
  ) : (
    <span>{post.author?.name?.charAt(0) || "A"}</span>
  )}
</div>


                      <div className="author-details">
                      <div
  className="author-name clickable"
  onClick={() => navigate(`/profile/${post.author?._id}`)}
>
  {post.author?.name || "Anonymous"}
</div>

                        <div className="post-info">
                          <span className="post-time">{formatDate(post.createdAt)}</span>
                          <span className="post-category">• {post.category.replace('_', ' ')}</span>
                          <span className="post-privacy">• <FaGlobeAmericas /></span>
                        </div>
                      </div>
                    </div>
                    <button className="post-options">
                      <FiMoreHorizontal />
                    </button>
                  </div>

                  {/* POST CONTENT */}
                  <div className="post-content">
                    <p>{post.content}</p>
                    
                    {post.image && (
                      <div className="post-media">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="post-image"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {post.link && (
                      <a 
                        href={post.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="post-link-preview"
                      >
                        <div className="link-icon">
                          <FaLink />
                        </div>
                        <div className="link-text">
                          <div className="link-title">Shared Link</div>
                          <div className="link-url">{post.link}</div>
                        </div>
                      </a>
                    )}
                  </div>

                  {/* POST STATS */}
                  {(getReactionCounts(post).length > 0 || post.commentsCount > 0 || post.shares > 0) && (
                    <div className="post-stats">
                      {getReactionCounts(post).length > 0 && (
  <div className="reactions-summary">
    {getReactionCounts(post).map(r => (
      <span key={r.type} className="reaction-item">
        {r.emoji} {r.count}
      </span>
    ))}
  </div>
)}

                      
                      <div className="stats-right">
                        {post.commentsCount > 0 && (
                          <span className="comments-count">
                            {post.commentsCount} comments
                          </span>
                        )}
                        {post.shares > 0 && (
                          <span className="shares-count">
                            {post.shares} shares
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* POST ACTIONS */}
                  <div className="post-actions">
                    {/* FACEBOOK-STYLE REACTION BUTTON */}
                    <div
  className="reaction-container"
  onMouseEnter={() => setHoveredPostId(post._id)}
  onMouseLeave={() => setHoveredPostId(null)}
>

                      <button 
                        className={`action-button like-btn ${post.myReaction ? 'active' : ''}`}
                        onClick={() => reactPost(post._id, "like")}
                        onMouseEnter={() => setActiveReaction(prev => ({...prev, [post._id]: post.myReaction || 'like'}))}
                      >
                        {post.myReaction ? (
                          <>
                            <span className="reaction-emoji">
                              {REACTIONS.find(r => r.type === post.myReaction)?.emoji}
                            </span>
                            <span className="action-text" style={{ color: REACTIONS.find(r => r.type === post.myReaction)?.color }}>
                              {REACTIONS.find(r => r.type === post.myReaction)?.label}
                            </span>
                          </>
                        ) : (
                          <>
                            <FaThumbsUp />
                            <span className="action-text">Like</span>
                          </>
                        )}
                      </button>
                      
                      {/* REACTION HOVER EFFECT */}
                      <div className={`reaction-hover ${hoveredPostId === post._id ? 'visible' : ''}`}>
                        {REACTIONS.map(reaction => (
                          <button
                            key={reaction.type}
                            className={`reaction-option ${activeReaction[post._id] === reaction.type ? 'active' : ''}`}
                            onClick={() => reactPost(post._id, reaction.type)}
                            onMouseEnter={() => setActiveReaction(prev => ({...prev, [post._id]: reaction.type}))}
                            style={{ 
                              backgroundColor: activeReaction[post._id] === reaction.type ? reaction.color : 'white' 
                            }}
                          >
                            <span className="reaction-emoji-large">{reaction.emoji}</span>
                            <span className="reaction-label">{reaction.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      className="action-button"
                      onClick={() => loadComments(post._id)}
                    >
                      <FaComment />
                      <span className="action-text">Comment</span>
                    </button>

                    <button 
                      className="action-button"
                      onClick={() => sharePost(post._id)}
                    >
                      <FaShare />
                      <span className="action-text">Share</span>
                    </button>
                  </div>

                  {/* COMMENTS SECTION */}
                  {comments[post._id] && (
                    <div className="comments-section">
                      <div className="comments-list">
                        {comments[post._id].map(comment => (
                          <div key={comment._id} className="comment">
                            <div className="comment-avatar">
  {comment.user.profilePhoto ? (
    <img
      src={comment.user.profilePhoto}
      alt={comment.user.name}
      className="avatar-img"
    />
  ) : (
    <span>{comment.user.name?.charAt(0) || "U"}</span>
  )}
</div>

                            <div className="comment-content">
                              <div className="comment-header">
                              <span
  className="comment-author clickable"
  onClick={() => navigate(`/profile/${comment.user._id}`)}
>
  {comment.user.name}
</span>

                                <span className="comment-time">{formatDate(comment.createdAt)}</span>
                              </div>
                              <div className="comment-text">{comment.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="add-comment">
                        <div className="comment-input-container">
                          <input
                            type="text"
                            value={commentText[post._id] || ""}
                            onChange={(e) =>
                              setCommentText(prev => ({
                                ...prev,
                                [post._id]: e.target.value,
                              }))
                            }
                            placeholder="Write a comment..."
                            className="comment-input"
                            onKeyPress={(e) => e.key === 'Enter' && addComment(post._id)}
                          />
                          <button 
                            onClick={() => addComment(post._id)}
                            className="send-comment"
                            disabled={!commentText[post._id]}
                          >
                            <FaPaperPlane />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <span>Loading more posts...</span>
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="end-of-feed">
                <div className="end-icon">🎉</div>
                <p>You've seen all posts for now</p>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR - HIDDEN ON MOBILE */}
        <aside className="right-sidebar">
          <div className="sidebar-section">
            <h3>Categories</h3>
            <div className="categories-list">
              <button 
                className={`category-item ${!category ? 'active' : ''}`}
                onClick={() => setCategory("")}
              >
                All Posts
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`category-item ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(category === cat ? "" : cat)}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Home;