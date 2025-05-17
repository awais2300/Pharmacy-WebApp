# Eg-Group-WebApp
Web Application in Next.js (frontend) and DotNet Core WebApi (backend)

This repository contains a full-stack web application with:

- **WebAPI:** ASP.NET Core Web API (backend)
- **front-end:** Next.js (React)

## Local Development Setup Instructions

### Prerequisites

Make sure you have installed:

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [Node.js (LTS)](https://nodejs.org/en/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or a compatible SQL Server instance
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

## 1. Clone the repository

If using GIT Bash use below commands:
1. git clone https://github.com/awais2300/Eg-Group-WebApp.git
2. cd Eg-Group-WebApp

or download the project using below URL:
1. https://github.com/awais2300/Eg-Group-WebApp.git

## 2. Set up and run the Back-End API

Open the code is Visual Studio Code, in terminal use below commands:
1. cd .\WebAPI\
2. dotnet restore
3. dotnet run (The API will run at http://localhost:5222)

## 3. Create and initialize the database

Run the SQL script located at back-end/DbScripts/init.sql to create the database, tables.

Follow below steps:
    i.   Opening SQL Server Management Studio 
    ii.  Connecting to your local SQL Server instance
    iii. Running the script in WebAPI/DbScripts/init.sql using master db

The script create database with name "EG_Group_DB" a Users table.

## 4. Set up and run the Front-End (Next.js)

Navigate to the front-end folder, by using below commands in terminal of visual studio code:
1. cd .\front-end\
2. npm install
3. Create a .env.local file in the front-end folder with the following content:
    NEXT_PUBLIC_API_BASE_URL=http://localhost:5222
4. npm run dev (The app will be available at http://localhost:3000.)

## 5. How to Use the Application Locally

1. First of all open the web application using url (http://localhost:3000/) 
2. Register a new user, by pressing the Register button on main page
3. Enter Name, Password and select Role and press Register Button. User will be created successfully

Important: Before logging in, you must create/register a user account.

## 6. Login the Application
1. Use the registered username, password, and role to log in.
2. Upon successful login, you will be redirected to the dashboard.

## 7. Additional Notes
1. The backend API supports CORS for local development.
2. Customize the database connection in string in WebAPI --> appsettings.json. Update SQL Server name and give credentials if not using windows authentication.
3. Passwords will be saved in DB in Hashed form.
4. Logs will be written in WebAPI --> Logs Folder 
