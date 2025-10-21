// src/components/Layout/PageWithFlagBackground.tsx
import React from "react";
import FloatingBanner from "../FloatingBanner";
import nppFlag from "../../assets/ChatGPT-NPP.webp";
import "../../styles/PageWithFlagBackground.css";

interface PageWithFlagBackgroundProps {
  title?: string;               // optional title
  children: React.ReactNode;
  customBackground?: string;    // optional override for background image
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
        backgroundImage: `url(${customBackground || nppFlag})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
        minHeight: "100vh",
      }}
    >
      {title && (
        <header className="flag-header text-center py-5">
          <h1 className="fw-bold">{title}</h1>
        </header>
      )}

      <FloatingBanner />

      <main className="page-main container py-4">{children}</main>

      <section className="text-center pt-5">
        <img
          src={nppFlag}
          alt="NPP Flag Bottom"
          className="img-fluid mb-4"
          style={{ maxHeight: "120px" }}
        />
      </section>
    </div>
  );
};

export default PageWithFlagBackground;
