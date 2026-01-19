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

const authHeaders = () => ({
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

  // ---------------- FETCH FEED ----------------
  const fetchPosts = async () => {
    const url = category
      ? `${API}/posts?category=${category}`
      : `${API}/posts`;

    const res = await fetch(url);
    const data = await res.json();

    const userId = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id;

const safePosts = data.map((p) => {
  const reactionTypes = ["like", "love", "sad", "angry"];
  let myReaction = null;

  reactionTypes.forEach((r) => {
    if (p.reactions?.[r]?.includes(userId)) {
      myReaction = r;
    }
  });

  return {
    ...p,
    reactions: {
      like: p.reactions?.like?.length || 0,
      love: p.reactions?.love?.length || 0,
      sad: p.reactions?.sad?.length || 0,
      angry: p.reactions?.angry?.length || 0,
      myReaction,
    },
    shares: p.shares || 0,
    commentsCount: p.commentsCount || 0,
  };
});


    setPosts(safePosts);
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

      setPosts((prev) =>
        prev.map((p) =>
          p._id === comment.post
            ? { ...p, commentsCount: p.commentsCount + 1 }
            : p
        )
      );
    });

    socket.on("post-reacted", ({ postId, reactions }) => {
      const userId = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1])
      ).id;
    
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== postId) return p;
    
          // 🧠 recompute myReaction based on latest state
          let myReaction = null;
          for (const r of ["like", "love", "sad", "angry"]) {
            if (p.reactions.myReaction === r && reactions[r] < p.reactions[r]) {
              myReaction = null;
            }
          }
    
          return {
            ...p,
            reactions: {
              ...p.reactions,
              ...reactions,
              myReaction,
            },
          };
        })
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
      socket.off("post-reacted");
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

    fetchPosts();
  };

  // ---------------- LIKE ----------------
  const reactPost = async (postId, type) => {
    if (!localStorage.getItem("token")) {
      alert("Login required");
      return;
    }
  
    const post = posts.find((p) => p._id === postId);
  
    // 🧠 If same reaction clicked again → REMOVE reaction
    const reactionType =
      post.reactions.myReaction === type ? null : type;
  
    await fetch(`${API}/posts/${postId}/react`, {
      method: "POST",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: reactionType }),
    });
  };
  
  

  // ---------------- SHARE ----------------
  const sharePost = async (postId) => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
  
    // ✅ Works on mobile / HTTPS
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
  
    // ✅ Always works fallback
    await navigator.clipboard.writeText(shareUrl);
    alert("Post link copied! You can share it anywhere.");
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
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
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

          {post.image && (
            <img
              src={post.image}
              alt="post"
              style={{ maxWidth: "100%", marginTop: 10 }}
            />
          )}

<button
  style={{ color: post.reactions.myReaction === "like" ? "blue" : "black" }}
  onClick={() => reactPost(post._id, "like")}
>
  👍 {post.reactions.like}
</button>

<button
  style={{ color: post.reactions.myReaction === "love" ? "red" : "black" }}
  onClick={() => reactPost(post._id, "love")}
>
  ❤️ {post.reactions.love}
</button>

<button
  style={{ color: post.reactions.myReaction === "sad" ? "orange" : "black" }}
  onClick={() => reactPost(post._id, "sad")}
>
  😢 {post.reactions.sad}
</button>

<button
  style={{ color: post.reactions.myReaction === "angry" ? "darkred" : "black" }}
  onClick={() => reactPost(post._id, "angry")}
>
  😡 {post.reactions.angry}
</button>


<button onClick={() => sharePost(post._id)}>
  🔗 Share
</button>


          <button onClick={() => loadComments(post._id)}>
            💬 {post.commentsCount}
          </button>

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
