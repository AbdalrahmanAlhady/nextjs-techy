# 2. Requirements

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