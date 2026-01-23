import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../api";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/api/posts/${id}`);
setPost(res.data);

      } catch (err) {
        console.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Loading post...</p>;
  if (!post) return <p style={{ padding: 20 }}>Post not found</p>;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h2>CampusConnect Post</h2>

      <div style={{ border: "1px solid #ddd", padding: 15 }}>
        <b>{post.author?.name}</b> — {post.category}

        <p style={{ marginTop: 10 }}>{post.content}</p>

        {post.image && (
          <img
            src={post.image}
            alt="post"
            style={{ maxWidth: "100%", marginTop: 10 }}
          />
        )}

        {/* Reactions (read-only for guests) */}
        <div style={{ marginTop: 10 }}>
          👍 {post.reactions.like.length} &nbsp;
          ❤️ {post.reactions.love.length} &nbsp;
          😢 {post.reactions.sad.length} &nbsp;
          😡 {post.reactions.angry.length}
        </div>

        {/* Guest hint */}
        {!isLoggedIn && (
          <p style={{ color: "gray", marginTop: 10 }}>
            Login to react or comment on this post
          </p>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
