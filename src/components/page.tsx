import React from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`site-page-header ${className}`.trim()}>
      {eyebrow && <p className="site-eyebrow">{eyebrow}</p>}
      <h1 className="site-page-title">{title}</h1>
      {description && <div className="site-page-lead">{description}</div>}
    </header>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  centered?: boolean;
  className?: string;
};

export function PageSectionHeader({
  eyebrow,
  title,
  description,
  centered = false,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`site-section-header ${centered ? "text-center" : ""} ${className}`.trim()}
    >
      {eyebrow && <p className="site-eyebrow">{eyebrow}</p>}
      <h2 className="site-section-title">{title}</h2>
      {description && <div className="site-section-lead">{description}</div>}
    </div>
  );
}
