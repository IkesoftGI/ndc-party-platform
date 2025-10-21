// src/pages/Regions/RegionHome.tsx
import React, { useEffect, useState, Suspense } from "react";
import { Link } from "react-router-dom";
import elephantIcon from "@assets/elephant-icon.webp";
import nppFlag from "@assets/ChatGPT-NPP.webp";
import FloatingBanner from "@components/FloatingBanner";
import RegionalNavbar from "@components/Navbars/RegionalNavbar";
import ExploreRegionsNavbar from "@components/Navbars/ExploreRegionsNavbar";
import BlogCarousel from "@components/BlogCarousel";
import { blogPosts as staticPosts } from "@data/blogPosts";
import type { BlogPost } from "../../types/Blog";

interface RegionHomeProps {
  region: string; // e.g., "Greater Accra"
  pathPrefix: string; // e.g., "/regions/greater-accra"
}

const RegionHome: React.FC<RegionHomeProps> = ({ region, pathPrefix }) => {
  const [nationalPosts, setNationalPosts] = useState<BlogPost[]>([]);
  const [regionalPosts, setRegionalPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let posts: BlogPost[] = [...staticPosts];
    try {
      const stored = localStorage.getItem("blogPosts");
      if (stored) {
        const parsed = JSON.parse(stored) as BlogPost[];
        parsed.forEach((p) => {
          if (!posts.find((sp) => sp.id === p.id)) posts.push(p);
        });
      }
    } catch (error) {
      console.error("Failed to parse blogPosts from localStorage", error);
    }

    setNationalPosts(posts.filter((p) => p.scope === "national"));
    setRegionalPosts(
      posts.filter(
        (p) =>
          p.scope === "regional" &&
          p.region?.toLowerCase().replace(/[-_]/g, " ").trim() === region.toLowerCase()
      )
    );
  }, [region]);

  return (
    <div
      className="home-page text-white"
      style={{
        backgroundImage: `url(${nppFlag})`,
        backgroundSize: "contain",
        backgroundPosition: "center top",
        backgroundColor: "#030577ff",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <ExploreRegionsNavbar />
      <RegionalNavbar region={region} />

      <div className="bg-warning-subtle py-1 border-bottom text-center">
        <Link to={`${pathPrefix}/constituencies`} className="btn btn-warning fw-semibold px-4">
          📍 Visit Constituencies
        </Link>
      </div>

      <header className="text-center py-5 bg-dark bg-opacity-50">
        <h1 className="fw-bold">🐘 Welcome to the {region} Regional NPP Platform</h1>
        <p className="lead">Advancing the values and mission of the NPP in the {region} Region.</p>
      </header>

      <Suspense fallback={<div>Loading National Blogs...</div>}>
        <BlogCarousel posts={nationalPosts} title="📝 National Blog Highlights" basePath="/blog" />
      </Suspense>

      <Suspense fallback={<div>Loading Regional Blogs...</div>}>
        <BlogCarousel
          posts={regionalPosts}
          title={`📍 ${region} Regional Blog`}
          basePath={`${pathPrefix}/blog`}
        />
      </Suspense>

      <FloatingBanner />

      <section className="text-center pb-4">
        <Link to={`${pathPrefix}/donate`} className="btn btn-success fw-bold mx-2">
          💰 Support the Region
        </Link>
      </section>

      <section className="text-center pt-5">
        <img src={elephantIcon} alt="Big Elephant" className="img-fluid standing-elephant" />
      </section>
    </div>
  );
};

export default RegionHome;
