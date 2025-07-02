# 3. Epics and User Stories

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
* **US106: Sign-out flow** – (Completed)
* **US107: Build Profile page** – (Completed)
    * [cite_start]*As a Developer, I want to implement route protection, so that certain areas of the site are only accessible to authorized roles.* [cite: 375]

### Epic 2: Admin Dashboard
* **US201: Create the main layout for the Admin Dashboard**
* **US205: As an Admin, I can manage vendor applications**
* **US206: As an Admin, I can manage users**
* **US202: As an Admin, I can manage products**
* **US203: As an Admin, I can add a new product**
* **US204: As an Admin, I can edit an existing product**
* **US207: As an Admin, I can add a new category**
* **US208: As an Admin, I can edit an existing category**
* **US209: As an Admin, I can view detailed user and vendor profiles**
* **US210: As an Admin, I can easily navigate back to the main dashboard from any primary admin page**
* **US211: As an Admin, I see consistent role indicators across the dashboard**

### Epic 3: Vendor Portal
* **US301: Implement a Vendor registration flow**
* **US302: As a Vendor, I can manage my products**
* **US303: As a Vendor, I can manage orders for my products**
* **US304: As a Vendor, I can manage order status for my products**
* **US305: As a Vendor, I can easily navigate back from any nested page**
* **US306: As a Vendor, I can easily navigate back to the main dashboard from any primary vendor page**

### Epic 4: Buyer Shopping Experience
* **US401: [As a Buyer, I can view all products](../stories/4.1.story.md)**
* **US402: [As a Buyer, I can view a detailed product page](../stories/4.2.story.md)**
* **US403: [As a Buyer, I can manage my shopping cart](../stories/4.3.story.md)**
* **US404: [As a Buyer, I can complete the checkout process](../stories/4.4.story.md)**
* **US405: [As a Buyer, I can view my order history](../stories/4.5.story.md)**
* **US406: [As a Buyer, I can leave a rating and review](../stories/4.6.story.md)**