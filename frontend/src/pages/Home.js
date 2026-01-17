import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const API = "http://localhost:5000/api";

// 🔥 SOCKET CONNECTION
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

// ---------- helper ----------
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function Home() {
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("");

  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [postCategory, setPostCategory] = useState("GENERAL");

  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});

  // ---------------- FETCH FEED (PUBLIC) ----------------
  const fetchPosts = async () => {
    const url = category
      ? `${API}/posts?category=${category}`
      : `${API}/posts`;

    const res = await fetch(url);
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  // ---------------- SOCKET LISTENERS ----------------
  useEffect(() => {
    socket.on("new-comment", (comment) => {
      setComments((prev) => ({
        ...prev,
        [comment.post]: [...(prev[comment.post] || []), comment],
      }));

      // update comment count
      setPosts((prev) =>
        prev.map((p) =>
          p._id === comment.post
            ? { ...p, commentsCount: p.commentsCount + 1 }
            : p
        )
      );
    });

    socket.on("post-liked", ({ postId, likes }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: Array(likes).fill(0) } : p
        )
      );
    });

    socket.on("post-shared", ({ postId, shares }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, shares } : p
        )
      );
    });

    return () => {
      socket.off("new-comment");
      socket.off("post-liked");
      socket.off("post-shared");
    };
  }, []);

  // ---------------- CREATE POST ----------------
  const createPost = async () => {
    if (!localStorage.getItem("token")) {
      alert("Login required");
      return;
    }
  
    const formData = new FormData();
    formData.append("content", content);
    formData.append("category", postCategory);
  
    if (link) formData.append("link", link);
    if (image) formData.append("image", image);
  
    await fetch(`${API}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
  
    setContent("");
    setLink("");
    setImage(null);
  };
  

  // ---------------- LIKE ----------------
  const likePost = async (postId) => {
    if (!localStorage.getItem("token")) {
      alert("Login required");
      return;
    }

    await fetch(`${API}/posts/${postId}/like`, {
      method: "POST",
      headers: authHeaders(),
    });
  };

  // ---------------- SHARE ----------------
  const sharePost = async (postId, link) => {
    await fetch(`${API}/posts/${postId}/share`, {
      method: "POST",
      headers: authHeaders(),
    });

    if (link) window.open(link, "_blank");
  };

  // ---------------- COMMENTS ----------------
  const loadComments = async (postId) => {
    socket.emit("join-post", postId);

    const res = await fetch(`${API}/comments/${postId}`);
    const data = await res.json();
    setComments((prev) => ({ ...prev, [postId]: data }));
  };

  const addComment = async (postId) => {
    if (!localStorage.getItem("token")) {
      alert("Login required");
      return;
    }

    await fetch(`${API}/comments`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        postId,
        text: commentText[postId],
      }),
    });

    setCommentText((prev) => ({ ...prev, [postId]: "" }));
  };

  // ====================================================
  return (
    <div style={{ padding: 20 }}>
      <h2>CampusConnect Feed</h2>

      {/* CREATE POST */}
      <div style={{ border: "1px solid #ccc", padding: 10 }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
        />
        <input
  type="file"
  accept="image/*"
  onChange={(e) => setImage(e.target.files[0])}
/>

        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Optional link"
        />
        <select
          value={postCategory}
          onChange={(e) => setPostCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button onClick={createPost}>Post</button>
      </div>

      <hr />

      {posts.map((post) => (
        <div key={post._id} style={{ border: "1px solid #ddd", margin: 10 }}>
          <b>{post.author?.name}</b> — {post.category}
          <p>{post.content}</p>

          <button onClick={() => likePost(post._id)}>
            ❤️ {post.likes.length}
          </button>
          <button onClick={() => sharePost(post._id, post.link)}>
            🔁 {post.shares}
          </button>
          <button onClick={() => loadComments(post._id)}>
            💬 {post.commentsCount}
          </button>
          {post.image && (
  <img
    src={`http://localhost:5000${post.image}`}
    alt="post"
    style={{ maxWidth: "100%", marginTop: 10 }}
  />
)}


          {comments[post._id] && (
            <div>
              {comments[post._id].map((c) => (
                <div key={c._id}>
                  <b>{c.user.name}:</b> {c.text}
                </div>
              ))}
              <input
                value={commentText[post._id] || ""}
                onChange={(e) =>
                  setCommentText((p) => ({
                    ...p,
                    [post._id]: e.target.value,
                  }))
                }
              />
              <button onClick={() => addComment(post._id)}>Send</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Home;
