-- Create Pharmacy_DB if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'Pharmacy_DB')
BEGIN
    CREATE DATABASE Pharmacy_DB;
END
GO

USE Pharmacy_DB;
GO

-- Drop tables in reverse dependency order (for development purposes)
IF OBJECT_ID('dbo.Payments', 'U') IS NOT NULL DROP TABLE dbo.Payments;
IF OBJECT_ID('dbo.OrderDetails', 'U') IS NOT NULL DROP TABLE dbo.OrderDetails;
IF OBJECT_ID('dbo.Orders', 'U') IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID('dbo.Prescriptions', 'U') IS NOT NULL DROP TABLE dbo.Prescriptions;
IF OBJECT_ID('dbo.InventoryLogs', 'U') IS NOT NULL DROP TABLE dbo.InventoryLogs;
IF OBJECT_ID('dbo.PurchaseDetails', 'U') IS NOT NULL DROP TABLE dbo.PurchaseDetails;
IF OBJECT_ID('dbo.Purchases', 'U') IS NOT NULL DROP TABLE dbo.Purchases;
IF OBJECT_ID('dbo.Medicines', 'U') IS NOT NULL DROP TABLE dbo.Medicines;
IF OBJECT_ID('dbo.Suppliers', 'U') IS NOT NULL DROP TABLE dbo.Suppliers;
IF OBJECT_ID('dbo.Categories', 'U') IS NOT NULL DROP TABLE dbo.Categories;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
GO

-- Users table
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(150) NOT NULL,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255),
    Phone NVARCHAR(20),
    Role NVARCHAR(50) NOT NULL CHECK (Role IN ('Admin', 'Pharmacist', 'Customer')),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Categories table
CREATE TABLE Categories (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL
);

-- Suppliers table
CREATE TABLE Suppliers (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(150) NOT NULL,
    ContactInfo NVARCHAR(255),
    Address NVARCHAR(255)
);

-- Medicines table
CREATE TABLE Medicines (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(150) NOT NULL,
    CategoryId INT FOREIGN KEY REFERENCES Categories(Id),
    SupplierId INT FOREIGN KEY REFERENCES Suppliers(Id),
    Price DECIMAL(10, 2) NOT NULL,
    PurchasePrice DECIMAL(10, 2) NULL,
    RackNumber NVARCHAR(100),
    Quantity INT NOT NULL,
    ExpiryDate DATE,
    Description NVARCHAR(255)
);

-- Purchases table
CREATE TABLE Purchases (
    Id INT PRIMARY KEY IDENTITY(1,1),
    SupplierId INT FOREIGN KEY REFERENCES Suppliers(Id),
    PurchaseDate DATE DEFAULT GETDATE(),
    TotalAmount DECIMAL(10, 2)
);

-- PurchaseDetails table
CREATE TABLE PurchaseDetails (
    Id INT PRIMARY KEY IDENTITY(1,1),
    PurchaseId INT FOREIGN KEY REFERENCES Purchases(Id),
    MedicineId INT FOREIGN KEY REFERENCES Medicines(Id),
    Quantity INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL
);

-- InventoryLogs table
CREATE TABLE InventoryLogs (
    Id INT PRIMARY KEY IDENTITY(1,1),
    MedicineId INT FOREIGN KEY REFERENCES Medicines(Id),
    ChangeType NVARCHAR(50) CHECK (ChangeType IN ('Add', 'Sale')),
    Quantity INT NOT NULL,
    ChangedAt DATETIME DEFAULT GETDATE()
);

-- Prescriptions table
CREATE TABLE Prescriptions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CustomerId INT FOREIGN KEY REFERENCES Users(Id),
    FilePath NVARCHAR(255),
    UploadedAt DATETIME DEFAULT GETDATE(),
    VerifiedBy INT FOREIGN KEY REFERENCES Users(Id)
);

-- Orders table
CREATE TABLE Orders (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CustomerId INT FOREIGN KEY REFERENCES Users(Id),
    OrderDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(50) CHECK (Status IN ('Pending', 'Approved', 'Shipped', 'Delivered', 'Cancelled')),
    TotalAmount DECIMAL(10, 2)
);

-- OrderDetails table
CREATE TABLE OrderDetails (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT FOREIGN KEY REFERENCES Orders(Id),
    MedicineId INT FOREIGN KEY REFERENCES Medicines(Id),
    Quantity INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL
);

-- Payments table
CREATE TABLE Payments (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT FOREIGN KEY REFERENCES Orders(Id),
    Method NVARCHAR(50),
    Amount DECIMAL(10, 2),
    Status NVARCHAR(50) CHECK (Status IN ('Pending', 'Completed', 'Failed')),
    PaidAt DATETIME
);

CREATE TABLE DailyExpenses (
    Id INT PRIMARY KEY IDENTITY,
    ExpenseDate DATE NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE TABLE DailyExpenseItems (
    Id INT PRIMARY KEY IDENTITY,
    DailyExpenseId INT NOT NULL FOREIGN KEY REFERENCES DailyExpenses(Id) ON DELETE CASCADE,
    Title NVARCHAR(100) NOT NULL,
    Amount DECIMAL(18, 2) NOT NULL,
    Notes NVARCHAR(255)
);
GO
