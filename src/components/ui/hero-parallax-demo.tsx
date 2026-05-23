"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export default function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}

export const products = [
  {
    title: "Microsoft Certified: Power BI Data Analyst Associate Certification",
    link: "#",
    thumbnail: "/images/Credentials/Microsoft Power BI Certification /Microsoft Power BI Data Analyst Certification_Mohit Bhardwaj.jpg",
  },
  {
    title: "Microsoft Power BI Data Analyst Badge",
    link: "#",
    thumbnail: "/images/Credentials/Microsoft Power BI Certification /PowerBI-Data-Analyst badge_Mohit Bhardwaj.png",
  },
  {
    title: "Project Management Professional (PMP) Certification",
    link: "#",
    thumbnail: "/images/Credentials/PMP Badge & Certification/PMI Certification_Mohit Bhardwaj.jpg",
  },
  {
    title: "PMI Project Management Professional Badge",
    link: "#",
    thumbnail: "/images/Credentials/PMP Badge & Certification/PMP Badge_Mohit Bhardwaj.png",
  },
  {
    title: "ISB Product Management Certification",
    link: "#",
    thumbnail: "/images/Credentials/ISB certifications/ISB Product Management/ISB Product Management_Mohit Bhardwaj.png",
  },
  {
    title: "ISB Applied Business Analytics Certification",
    link: "#",
    thumbnail: "/images/Credentials/ISB certifications/ISB Applied Business Analytics/ISB Applied Business Analytics_Mohit Bhardwaj.png",
  },
  {
    title: "Airtable AI App Builder Certification",
    link: "#",
    thumbnail: "/images/Credentials/Airtable Certifications/Airtable AI App Builder Certification_Mohit Bhardwaj.jpg",
  },
  {
    title: "Airtable Admin Certification",
    link: "#",
    thumbnail: "/images/Credentials/Airtable Certifications/Airtable Admin Certification_Mohit Bhardwaj.jpg",
  },
  {
    title: "Airtable Builder Certification",
    link: "#",
    thumbnail: "/images/Credentials/Airtable Certifications/Airtable Builder Certification_Mohit Bhardwaj.jpg",
  },
  {
    title: "Lean Six Sigma Black Belt Certification",
    link: "#",
    thumbnail: "/images/Credentials/Six Sigma BLACK BELT/Certified Lean Six Sigma Black Belt.jfif",
  },
  {
    title: "Wharton Certificate: Revenue Analytics",
    link: "#",
    thumbnail: "/images/Credentials/Wharton Certifications/Wharton Certificate_Revenue Analytics.jfif",
  },
  {
    title: "Wharton Certificate: Marketing Analytics",
    link: "#",
    thumbnail: "/images/Credentials/Wharton Certifications/Wharton Certificate_Marketing Analytics.jfif",
  },
  // Key items repeated to fill 15-grid beautifully
  {
    title: "Microsoft Power BI Data Analyst Associate (Verified)",
    link: "#",
    thumbnail: "/images/Credentials/Microsoft Power BI Certification /PowerBI-Data-Analyst badge_Mohit Bhardwaj.png",
  },
  {
    title: "PMI Project Management Professional (PMP) Badge (Verified)",
    link: "#",
    thumbnail: "/images/Credentials/PMP Badge & Certification/PMP Badge_Mohit Bhardwaj.png",
  },
  {
    title: "ISB Product Management Certification (Verified)",
    link: "#",
    thumbnail: "/images/Credentials/ISB certifications/ISB Product Management/ISB Product Management_Mohit Bhardwaj.png",
  },
];
