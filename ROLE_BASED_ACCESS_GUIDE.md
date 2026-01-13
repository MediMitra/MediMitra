# MediMitra - Role-Based Access Control Guide

## Overview
MediMitra now features a complete role-based access control system with three distinct user portals: **Admin**, **Store**, and **Customer/User**. Each portal has its own dedicated interface and capabilities.

---

## 🚪 Login Portal (Landing Page)

**Route:** `/` or `/login-selection`

When users first visit the application, they see a clean login portal with three prominent buttons:

- **USER LOGIN** (Blue) - For customers
- **STORE LOGIN** (Green) - For pharmacy owners
- **ADMIN LOGIN** (Red) - For platform administrators

This design matches the image you provided and ensures clear separation between different user types.

---

## 👤 Customer/User Access

### Features:
- **Registration Available** ✅
- **Beautiful promotional interface**
- Full shopping experience with medicines, cart, orders, etc.

### Routes:
- `/login-user` - User login page
- `/register` - User registration page
- `/home` - Promotional page with benefits and features
- `/medicines` - Browse medicines (after login)
- `/cart` - Shopping cart
- `/orders` - Order history
- `/feedback` - Submit feedback
- `/store-locator` - Find nearby pharmacies

### Demo Credentials:
- **Email:** user@medimitra.com
- **Password:** user123

### User Journey:
1. Click "USER LOGIN" from main portal
2. Can login or register (registration link provided)
3. Can view promotions and benefits via the "View Promotions & Benefits" link
4. After login, access the beautiful shopping interface

---

## 🏪 Store Portal

### Features:
- **No Registration** (Admin creates store accounts)
- **Login Only**
- Inventory management
- Customer database
- Sales data and analytics
- Medicine quantity management

### Routes:
- `/login-store` - Store login page
- `/store` - Store dashboard (after login)

### Demo Credentials:
- **Email:** store@medimitra.com
- **Password:** store123

### Dashboard Capabilities:
- ✅ View and manage inventory
- ✅ Track medicine stock levels
- ✅ View customer data
- ✅ Monitor sales and orders
- ✅ Update medicine quantities

---

## 👨‍💼 Admin Portal

### Features:
- **No Registration** (System-level access only)
- **Login Only**
- Complete platform management
- Medicine and cosmetics management
- Store management and mapping
- Sales insights and analytics

### Routes:
- `/login-admin` - Admin login page
- `/admin` - Admin dashboard (after login)

### Demo Credentials:
- **Email:** admin@medimitra.com
- **Password:** admin123

### Dashboard Capabilities:
- ✅ Add/Remove medicines and cosmetics
- ✅ Add/Remove stores
- ✅ Mark stores on map
- ✅ View platform-wide insights
- ✅ Monitor total sales
- ✅ Track overall activity
- ✅ System configuration

---

## 🔒 Security & Access Control

### Role Separation:
- Each role can only access their designated dashboard
- Users are redirected to appropriate pages based on their role
- Invalid role access is prevented with error messages

### Authentication Flow:
1. User selects their role from the main portal
2. Enters credentials on role-specific login page
3. System validates credentials and role
4. User is redirected to their dashboard
5. Navbar appears only after successful login

### Protected Routes:
- All dashboards require authentication
- Role verification on login
- Automatic redirect based on user role

---

## 🎨 Design Features

### Main Portal (LoginSelection):
- Clean, minimal design matching your reference image
- Three color-coded buttons (Blue, Green, Red)
- Responsive layout
- Copyright footer

### Login Pages:
- Color-themed based on role
  - **Blue** gradient for Users
  - **Green** gradient for Stores
  - **Red** gradient for Admins
- Quick demo login buttons
- Back to portal navigation
- Modern, professional design

### User Benefits:
- Registration page with promotional link
- Access to view benefits and features before registering
- Beautiful shopping interface after login
- Seamless navigation experience

---

## 📁 Modified Files

1. **LoginSelection.jsx** - Updated to match portal image design
2. **App.jsx** - Modified routing to start with LoginSelection
3. **LoginUser.jsx** - Added promotions link
4. **Register.jsx** - Enhanced UI with promotional link
5. **AuthContext.jsx** - Updated for flexible authentication
6. **HomeNew.jsx** - Promotional landing page (accessible via /home)

---

## 🚀 Getting Started

### For Customers:
1. Visit the application
2. Click "USER LOGIN"
3. Register for a new account or use demo credentials
4. Start shopping!

### For Store Owners:
1. Contact admin for account creation
2. Click "STORE LOGIN"
3. Use provided credentials
4. Manage your inventory and customers

### For Administrators:
1. Use system-provided credentials
2. Click "ADMIN LOGIN"
3. Access complete platform management tools

---

## 📝 Notes

- **No interference between roles** - Each user type has isolated access
- **Professional separation** - Clear distinction in UI and functionality
- **Easy navigation** - Intuitive flow for all user types
- **Demo credentials available** - Quick access for testing

---

## 🔄 Future Enhancements

Potential improvements for the future:
- Two-factor authentication
- Password reset functionality
- Role-based permissions granularity
- Activity logging and audit trails
- Multi-store support for store owners
- Advanced analytics dashboards

---

**Last Updated:** December 23, 2025
**Version:** 2.0
**Status:** ✅ Production Ready
