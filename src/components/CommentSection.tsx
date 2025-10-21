import React, { useEffect, useState } from "react";

interface Comment {
  id: string;
  name: string;
  text: string;
  date: string;
}

interface CommentSectionProps {
  type: "blog" | "project";
  id: string; // blog post id or project id
}

const CommentSection: React.FC<CommentSectionProps> = ({ type, id }) => {
  const storageKey = `${type}-comments-${id}`;
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setComments(JSON.parse(stored));
    }
  }, [storageKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      name: name.trim(),
      text: text.trim(),
      date: new Date().toLocaleString(),
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    setName("");
    setText("");
  };

  return (
    <div className="comment-section mt-4">
      <h5 className="fw-bold text-dark">💬 Comments</h5>

      <form onSubmit={handleSubmit} className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="form-control mb-2"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="btn btn-primary">
          Post Comment
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="text-muted">No comments yet. Be the first!</p>
      ) : (
        <ul className="list-group">
          {comments.map((c) => (
            <li key={c.id} className="list-group-item">
              <strong>{c.name}</strong>{" "}
              <span className="text-muted" style={{ fontSize: "0.8em" }}>
                ({c.date})
              </span>
              <p className="mb-0">{c.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentSection;
