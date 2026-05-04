# Full-Stack Dashboard Setup

You're now running a **PostgreSQL Database**, an **Express Backend API**, and a **Vite + React Frontend**!

## 1. Setting up the PostgreSQL Database

If you haven't set up your local database yet:
1. Open **pgAdmin** (comes with Windows PostgreSQL installation).
2. Right-click "Databases" -> Create -> Database. Name it **`leonidb`**.
3. *That's it!*

## 2. Initializing the Database

Before you start the app for the very first time, run this command in your terminal to create all the tables and setup the default admin account:
\`\`\`bash
npm run db:setup
\`\`\`
*(This will create the tables and the default `hacker` account).*

## 3. Running the Entire Application

I have set up a command that runs **both** the frontend and the backend at the exact same time. Just run:
\`\`\`bash
npm run dev
\`\`\`

## 4. Default Login

You can log in to the dashboard using the Hacker/Admin credentials:
- **Username**: `hacker`
- **Password**: `hacker123`

Once logged in, go to the **Hacker Admin Control** page via the Sidebar to create new accounts for your `supervisor` and `assistante`.

---
*All your manual entries and Excel uploads are now saved permanently in the PostgreSQL database!*
