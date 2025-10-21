import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import type { BlogPost } from "../types/Blog";

interface BlogCarouselProps {
  posts: BlogPost[];
  title: string;
  basePath: string; // e.g., "/blog", "/regions/greater-accra/blog"
}

export default function BlogCarousel({ posts, title, basePath }: BlogCarouselProps) {
  return (
    <section className="container py-4 bg-white bg-opacity-75 rounded">
      <h3 className="text-center fw-bold text-dark">{title}</h3>

      <div className="mt-4">
        {posts.length === 0 ? (
          <p className="text-center text-muted">No blog posts available.</p>
        ) : (
          <Carousel
            interval={4000}
            fade
            pause="hover"
            controls
            indicators={false}
            className="carousel-with-arrows"
          >
            {posts.map((post) => {
              const firstMedia = post.media?.[0] || "/No Image Available.png";

              return (
                <Carousel.Item key={post.id}>
                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      <div className="card shadow h-100">
                        <img
                          src={firstMedia}
                          alt={post.title}
                          className="card-img-top"
                          style={{ height: "500px", objectFit: "cover" }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/No Image Available.png";
                          }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title text-dark fw-bold">{post.title}</h5>
                          <p className="card-text text-dark">
                            {post.excerpt?.slice(0, 120)}
                            {post.excerpt && post.excerpt.length > 120 ? "..." : ""}
                          </p>
                          <div className="mt-auto">
                            <Link to={`${basePath}/${post.id}`} className="btn btn-primary">
                              Read More
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Carousel.Item>
              );
            })}
          </Carousel>
        )}
      </div>

      {/* View All Button */}
      <div className="text-center mt-4">
        <Link to={basePath} className="btn btn-outline-dark fw-bold mx-2">
          📚 View All Blog Posts
        </Link>
      </div>
    </section>
  );
}
