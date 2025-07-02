# 📦 Project Brief: nextjs-techy

## 🧭 Executive Summary

**Techy** is a curated, multi-vendor e-commerce platform for tech enthusiasts and hardware makers. Unlike mass-market platforms, Techy focuses on trusted, high-quality products from independent tech vendors. The platform empowers small vendors with tools and visibility while providing buyers with authentic products and reliable reviews.

---

## ❗ Problem Statement

Large marketplaces like Amazon prioritize volume over quality. Small, innovative vendors struggle to gain visibility. Tech-savvy buyers face fake reviews, poor discovery, and untrustworthy listings. There’s a growing need for a focused, curated platform that connects passionate makers with quality-seeking buyers.

---

## ✅ Proposed Solution

Techy solves this with three pillars:
- **Curation & Trust**: Manual vendor approval, verified buyer reviews, and product reputation scores.
- **Vendor Empowerment**: A vendor dashboard for managing products and viewing buyer orders.
- **Community & Discovery**: Smooth Browse, clean checkout, and high-trust ratings.

---

## 👥 Target Users

### Buyers (Tech Enthusiasts):
- Ages 25–50: developers, gamers, prosumers.
- Value quality and authenticity.

### Vendors (Independent Tech Creators):
- Small brands/startups with unique products.
- Need visibility and simple tools.

---

## 🔧 MVP Scope

### ✅ Must-Have Features

[cite_start]This list defines the Minimum Viable Product. [cite: 217]

| Feature | Description |
|---|---|
| **Authentication & Role-Based Access** | Secure user signup, login, and route protection by role (Admin, Vendor, Buyer) |
| **Admin Dashboard** | A unified portal for Admins to manage vendor applications, all products, and all users. |
| **Vendor Portal** | A self-service portal for vendors to manage their own product listings and view their orders. |
| **Buyer Shopping Experience** | The complete public-facing shopping journey, from Browse products to checkout and leaving reviews. |

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + Tailwind CSS |
| Backend | Next.js Server Actions (with fallback API routes) |
| Database | PostgreSQL |
| **Auth** | **NextAuth.js** |
| Payments | Stripe |

---

## ⚠️ Constraints & Assumptions

- Launch limited to North America (logistics control).
- Community-powered trust is a key driver.
- Balanced vendor/buyer onboarding is essential.