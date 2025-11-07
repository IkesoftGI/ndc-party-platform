// src/components/Layout/PageWithFlagBackground.tsx
import React from "react";
import FloatingBanner from "../FloatingBanner";
import ndcFlag from "../../assets/ChatGPT-NDC.png";
import "../../styles/PageWithFlagBackground.css";

interface PageWithFlagBackgroundProps {
  title?: string;
  children: React.ReactNode;
  customBackground?: string;
}

const PageWithFlagBackground: React.FC<PageWithFlagBackgroundProps> = ({
  title,
  children,
  customBackground,
}) => {
  return (
    <div
      className="page-flag-bg"
      style={{
        backgroundImage: `url(${customBackground || ndcFlag})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
        minHeight: "100vh",
      }}
    >
      {title && (
        <header className="flag-header text-center py-5">
          <h1 className="fw-bold ndc-header-text">{title}</h1>
        </header>
      )}

      <FloatingBanner />

      <main className="page-main container py-4 ndc-main-bg">{children}</main>

      <section className="text-center pt-5">
        <img
          src={ndcFlag}
          alt="NDC Flag Bottom"
          className="img-fluid mb-4"
          style={{ maxHeight: "120px" }}
        />
      </section>
    </div>
  );
};

export default PageWithFlagBackground;
