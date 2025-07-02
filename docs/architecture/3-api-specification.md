# 3. API Specification
Authorization for all sensitive Server Actions will be centralized using a wrapper function (`withRole`) that checks the user's role from the **NextAuth.js session object** before executing business logic.

---