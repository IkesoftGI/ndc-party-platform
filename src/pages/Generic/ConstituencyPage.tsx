import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import umbrellaIcon from "@assets/NDC.png";
import ndcFlag from "@assets/NDC.png";
import FloatingBanner from "@components/FloatingBanner";
import ExploreRegionsNavbar from "@components/Navbars/ExploreRegionsNavbar";
import ConstituencyNavbar from "@components/Navbars/ConstituencyNavbar";
import BlogCarousel from "@components/BlogCarousel";
import { blogPosts as staticPosts } from "@data/blogPosts";
import type { BlogPost } from "../../types/Blog";

interface ConstituencyPageProps {
  regionParam?: string;
  constituencyParam?: string;
}

const ConstituencyPage: React.FC<ConstituencyPageProps> = ({ regionParam, constituencyParam }) => {
  const params = useParams<{ region: string; constituency: string }>();
  const region = regionParam || params.region || "";
  const constituency = constituencyParam || params.constituency || "";

  const [nationalPosts, setNationalPosts] = useState<BlogPost[]>([]);
  const [regionalPosts, setRegionalPosts] = useState<BlogPost[]>([]);
  const [constituencyPosts, setConstituencyPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let posts = [...staticPosts];
    try {
      const stored = localStorage.getItem("blogPosts");
      if (stored) {
        const parsed = JSON.parse(stored) as BlogPost[];
        parsed.forEach(p => {
          if (!posts.find(sp => sp.id === p.id)) posts.push(p);
        });
      }
    } catch {}

    const normalize = (s?: string) => s?.toLowerCase().replace(/[-_]/g, " ").trim() || "";

    setNationalPosts(posts.filter(p => p.scope === "national"));
    setRegionalPosts(posts.filter(p => p.scope === "regional" && normalize(p.region) === normalize(region)));
    setConstituencyPosts(posts.filter(
      p =>
        p.scope === "constituency" &&
        normalize(p.region) === normalize(region) &&
        normalize(p.constituency) === normalize(constituency)
    ));
  }, [region, constituency]);

  return (
    <div
      className="home-page text-white"
      style={{
        backgroundImage: `url(${ndcFlag})`,
        backgroundSize: "contain",
        backgroundPosition: "center top",
        backgroundColor: "#565753ff",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <ExploreRegionsNavbar />
      <ConstituencyNavbar region={region} constituency={constituency} />

      

      <header className="text-center py-5 bg-dark bg-opacity-50">
        <h1 className="fw-bold">🐘 Welcome to the {constituency} NPP Constituency Platform</h1>
        <p className="lead">Advancing the NPP vision and grassroots strength in {constituency}.</p>
      </header>

      <BlogCarousel posts={nationalPosts} title="📰 National Blog Highlights" basePath="/blog" />
      <BlogCarousel posts={regionalPosts} title={`📍 ${region} Regional Blog`} basePath={`/regions/${region}/blog`} />
      <BlogCarousel posts={constituencyPosts} title={`📰 ${constituency} Constituency Blog`} basePath={`/regions/${region}/constituencies/${constituency}/blog`} />

      <FloatingBanner />

      <section className="text-center pb-4">
        <Link to={`/regions/${region}/constituencies/${constituency}/donate`} className="btn btn-success fw-bold mx-2">
          💰 Support {constituency}
        </Link>
      </section>

      <section className="text-center pt-5">
        <img src={umbrellaIcon} alt="Big Elephant" className="img-fluid standing-elephant" />
      </section>
    </div>
  );
};

export default ConstituencyPage;
