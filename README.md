# Eg-Group-WebApp
Web Application in Next.js (frontend) and DotNet Core WebApi (backend)

This repository contains a full-stack web application with:

- **Back-End:** ASP.NET Core Web API
- **Front-End:** Next.js (React)

---

## Local Development Setup Instructions

### Prerequisites

Make sure you have installed:

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [Node.js (LTS)](https://nodejs.org/en/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or a compatible SQL Server instance
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

---

## 1. Clone the repository

```bash
git clone https://github.com/awais2300/Eg-Group-WebApp.git
cd Eg-Group-WebApp


## 2. Set up and run the Back-End API
Navigate to the back-end folder:

cd back-end
dotnet restore

## 3. Create and initialize the database
Run the SQL script located at back-end/DbScripts/init.sql to create the database, tables.


Follow below steps:
    i.   Opening SQL Server Management Studio or Azure Data Studio
    ii.  Connecting to your local SQL Server instance
    iii. Running the script in WebAPI/DbScripts/init.sql using master db

The script create database with name "EG_Group_DB" a Users table.


## 4. Run the Web API
dotnet run
The API will run at http://localhost:5222.

## 5. Set up and run the Front-End (Next.js)

Navigate to the front-end folder:
cd ../front-end
npm install
Create a .env.local file in the front-end folder with the following content:

NEXT_PUBLIC_API_BASE_URL=http://localhost:5222
Run the development server

npm run dev
The app will be available at http://localhost:3000.

## 6. How to Use the Application Locally

1. First of all open the web application using url (http://localhost:3000/) 
2. Register a new user, by pressing the Register button on main page
3. Enter Name, Password and select Role and press Register Button. User will be created successfully

Important: Before logging in, you must create/register a user account.

## 7. Login the Application
1. Use the registered username, password, and role to log in.
2. Upon successful login, you will be redirected to the dashboard.

## Additional Notes
1. The backend API supports CORS for local development.
2. Customize the database connection string in appsettings.json if your SQL Server uses different credentials or settings.
3. Passwords will be saved in DB in Hashed form.