// src\components\BlogCards\ConstituencyBlogCard.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { BlogPost } from "../../types/Blog";

interface Props {
  region: string;
  constituency: string;
}

const ConstituencyBlogCard: React.FC<Props> = ({ region, constituency }) => {
  const [constituencyPosts, setConstituencyPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("blogPosts");
    if (stored) {
      const allPosts: BlogPost[] = JSON.parse(stored);
      const filtered = allPosts
        .filter(
          (post) =>
            post.region === region && post.constituency === constituency
        )
        .slice(0, 3);
      setConstituencyPosts(filtered);
    }
  }, [region, constituency]);

  return (
    <div className="bg-light rounded p-3 shadow-sm">
      <h4 className="text-dark mb-3">
        🏘️ {constituency} Constituency Blog Highlights
      </h4>

      {constituencyPosts.length === 0 ? (
        <p className="text-muted">No blog posts found for this constituency.</p>
      ) : (
        <div className="row">
          {constituencyPosts.map((post) => (
            <div className="col-md-4 mb-4" key={post.id}>
              <div className="card h-100">
                {post.media && post.media.length > 0 && (
                  <img
                    src={post.media[0]} // ✅ take the first image
                    alt={post.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title text-dark">{post.title}</h5>
                  <p className="card-text text-dark">{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} className="btn btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-3">
        <Link
          to={`/regions/${region.toLowerCase().replaceAll(" ", "-")}/constituencies/${constituency.toLowerCase().replaceAll(" ", "-")}/blog`}
          className="btn btn-outline-dark fw-semibold"
        >
          📰 View All Posts from {constituency}
        </Link>
      </div>
    </div>
  );
};

export default ConstituencyBlogCard;
