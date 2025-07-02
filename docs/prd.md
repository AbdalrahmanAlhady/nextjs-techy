# nextjs-techy Product Requirements Document (PRD)

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
| 2025-06-29 | 1.3 | Final version with NextAuth.js and complete story backlog. | Sarah (PO) |

## 1. Goals and Background Context
_(As previously defined)_

---
## 2. Requirements

### Functional Requirements
* **FR1**: The system must provide secure user authentication (signup/login) and role-based access for Admins, Vendors, and Buyers.
* **FR2**: Prospective vendors must be able to submit an application to sell on the platform.
* **FR3**: An Admin interface must exist to review, approve, or deny vendor applications.
* **FR4**: Approved vendors must be able to create, view, update, and delete their product listings.
* **FR5**: Product listings must include inventory tracking to manage stock levels.
* **FR6**: Vendors must have a dashboard to view their listed products and incoming customer orders.
* **FR7**: Buyers must be able to view a history of their past orders.
* **FR8**: All users must be able to browse products by category and perform keyword searches.
* **FR9**: The system must provide detailed product pages showing images, descriptions, price, and stock status.
* **FR10**: Buyers must be able to add products to a shopping cart and complete a purchase via a Stripe-integrated checkout.
* **FR11**: Only buyers who have purchased a product can leave a rating and a written review for it.
* **FR12**: Admins must be able to manage users, including suspending or deleting their accounts.

### Non-Functional Requirements
* **NFR1**: The frontend must be built using Next.js and styled with Tailwind CSS.
* **NFR2**: The backend logic must be implemented using Next.js Server Actions, with traditional API routes as a fallback mechanism.
* **NFR3**: The application's primary database must be PostgreSQL.
* **NFR4**: User authentication and session management must be handled by **NextAuth.js**.
* **NFR5**: All payment processing must be securely handled through Stripe.
* **NFR6**: The platform must launch with support for North America only.
* **NFR7**: The user interface must be responsive and provide a smooth, intuitive Browse experience on both desktop and mobile devices.
* **NFR8**: The system must integrate with a transactional email service (e.g., Resend) to notify users of critical status changes.

---
## 3. Epics and User Stories

The development work is broken down into the following epics. [cite_start]Each epic should deliver a significant, end-to-end, fully deployable increment of testable functionality. [cite: 365, 366]

### Epic 1: Authentication and Role-Based Access

* **US101: Setup base Next.js project**
    * [cite_start]*As a Developer, I want to set up the base Next.js project with PostgreSQL, Drizzle ORM, and Tailwind CSS, so that we have a functional foundation for development.* [cite: 375]
* **US101.5: Setup Redux Toolkit**
    * [cite_start]*As a Developer, I want to configure the Redux Toolkit store, so that we have a centralized and predictable way to manage client-side state.* [cite: 375]
* **US101.6: Generate and Run Initial DB Migration**
    * [cite_start]*As a Developer, I want to generate the initial SQL migration from the Drizzle schema and run it against the database, so that our database tables are created and ready for use.* [cite: 375]
* **US102: Configure NextAuth.js**
    * [cite_start]*As a Developer, I want to set up and configure NextAuth.js, so that we have a foundation for our authentication system.* [cite: 375]
* **US103: Build Authentication UI**
    * [cite_start]*As a Developer, I want to build the sign-up and sign-in pages, so that users can create an account and log in.* [cite: 375]
* **US104: Define and assign user roles**
    * [cite_start]*As a Developer, I want to define and assign user roles in the database, so that the application can differentiate between Admins, Vendors, and Buyers.* [cite: 375]
* **US105: Implement route protection**
    * [cite_start]*As a Developer, I want to implement route protection, so that certain areas of the site are only accessible to authorized roles.* [cite: 375]

### Epic 2: Admin Dashboard
* **US201: Create the main layout for the Admin Dashboard**
* **US205: As an Admin, I can manage vendor applications**
* **US206: As an Admin, I can manage users**
* **US202: As an Admin, I can manage products**
* **US203: As an Admin, I can add a new product**
* **US204: As an Admin, I can edit an existing product**

### Epic 3: Vendor Portal
* **US301: Implement a Vendor registration flow**
* **US302: As a Vendor, I can manage my products**
* **US303: As a Vendor, I can manage orders for my products**

### Epic 4: Buyer Shopping Experience
* **US401: As a Buyer, I can view all products**
* **US402: As a Buyer, I can view a detailed product page**
* **US403: As a Buyer, I can manage my shopping cart**
* **US404: As a Buyer, I can complete the checkout process**
* **US405: As a Buyer, I can view my order history**
* **US406: As a Buyer, I can leave a rating and review**