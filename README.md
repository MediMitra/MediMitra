<div align="center">
  <img src="frontend/public/logo.png" alt="MediMitra Logo" width="120" height="120">
  
  # MediMitra
  ### Your Trusted Healthcare Partner
  
  <p align="center">
    A modern, full-stack healthcare e-commerce platform connecting patients with quality medicines and trusted medical stores
    <br />
    <br />
    <a href="#-features"><strong>Explore Features »</strong></a>
    <br />
    <br />
    <a href="#-screenshots">View Screenshots</a>
    ·
    <a href="#-getting-started">Getting Started</a>
    ·
    <a href="#-tech-stack">Tech Stack</a>
  </p>
</div>

<div align="center">
  
  ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen?style=for-the-badge&logo=springboot)
  ![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)

</div>

---

## 📖 About MediMitra

**MediMitra** is a comprehensive healthcare e-commerce platform designed to bridge the gap between patients and quality medical services. Built with modern web technologies, it offers a seamless experience for browsing medicines, managing orders, and connecting with trusted pharmacy stores.

### 🎯 Project Vision

To provide accessible, reliable, and efficient healthcare services through a digital platform that prioritizes:
- **Patient Care** - Easy medicine search and ordering
- **Store Management** - Efficient inventory and order handling
- **Admin Control** - Platform oversight and management
- **Security** - Secure authentication and data protection

### 👥 User Roles

- **Patients** - Browse medicines, place orders, track deliveries
- **Store Partners** - Manage inventory, process orders, update stock
- **Administrators** - Oversee platform, manage users and stores

## ✨ Features

### 🏥 For Patients
- **Smart Medicine Search** - Search medicines by name, category, or composition
- **Detailed Product Info** - View medicine details, pricing, and availability
- **Shopping Cart** - Add items, update quantities, and manage cart
- **Secure Checkout** - Multiple address support with order confirmation
- **Order Tracking** - Real-time order status and history
- **Email Notifications** - Professional PDF invoices via email
- **Google OAuth** - Quick sign-in with Google account
- **Email Verification** - Secure account activation

### 🏪 For Store Partners
- **Inventory Management** - Add, update, and manage medicine stock
- **Order Processing** - View and fulfill customer orders
- **Store Dashboard** - Analytics and performance metrics
- **Stock Alerts** - Low inventory notifications
- **Revenue Tracking** - Sales reports and insights

### 👨‍💼 For Administrators
- **User Management** - Oversee all platform users
- **Store Verification** - Approve and manage pharmacy partners
- **Platform Analytics** - Comprehensive dashboard with insights
- **Medicine Database** - Add and manage medicine catalog
- **System Monitoring** - Track platform performance

### 🔐 Security Features
- **JWT Authentication** - Secure token-based auth
- **Password Encryption** - BCrypt hashing
- **Email Verification** - Account activation system
- **Role-Based Access** - Admin, Store, Patient roles
- **CORS Protection** - Secure API access
- **Input Validation** - Server-side data validation

### 🎨 User Experience
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Modern UI** - Clean, intuitive Tailwind CSS interface
- **Smooth Animations** - Framer Motion transitions
- **Fast Loading** - Optimized with Vite build tool
- **Error Handling** - User-friendly error messages
- **Loading States** - Visual feedback for async operations

## 📸 Screenshots

### Patient Portal

#### Home Page
*Modern landing page with featured medicines and quick access to services*
<!-- Add screenshot: ![Home Page](screenshots/home.png) -->

#### Medicine Browsing
*Comprehensive medicine catalog with search and filter options*
<!-- Add screenshot: ![Browse Medicines](screenshots/browse.png) -->

#### Shopping Cart
*Intuitive cart management with real-time updates*
<!-- Add screenshot: ![Shopping Cart](screenshots/cart.png) -->

#### Checkout Process
*Seamless checkout with address management*
<!-- Add screenshot: ![Checkout](screenshots/checkout.png) -->

#### Order History
*Track all orders with detailed invoices*
<!-- Add screenshot: ![Orders](screenshots/orders.png) -->

### Store Portal

#### Store Dashboard
*Comprehensive analytics and order management*
<!-- Add screenshot: ![Store Dashboard](screenshots/store-dashboard.png) -->

#### Inventory Management
*Easy medicine stock management*
<!-- Add screenshot: ![Inventory](screenshots/inventory.png) -->

### Admin Portal

#### Admin Dashboard
*Platform-wide analytics and controls*
<!-- Add screenshot: ![Admin Dashboard](screenshots/admin-dashboard.png) -->

#### Medicine Management
*Add and manage medicine database*
<!-- Add screenshot: ![Medicine Management](screenshots/admin-medicines.png) -->

### Authentication

#### Login Page
*Secure authentication with Google OAuth support*
<!-- Add screenshot: ![Login](screenshots/login.png) -->

#### Registration
*Simple sign-up process with email verification*
<!-- Add screenshot: ![Register](screenshots/register.png) -->

> **Note:** To add screenshots, create a `screenshots` folder in the root directory and update the image paths above.

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Spring Boot** | 3.2.1 | Core framework |
| **Java** | 17 | Programming language |
| **Spring Security** | 6.2.1 | Authentication & authorization |
| **Spring Data JPA** | 3.2.1 | Database ORM |
| **PostgreSQL** | 15+ | Primary database (Supabase) |
| **JWT** | 0.11.5 | Token-based auth |
| **Maven** | 3.8+ | Build tool |
| **JavaMail** | 2.7.0 | Email service |
| **iText PDF** | 7.2.5 | PDF invoice generation |
| **Lombok** | 1.18.30 | Code generation |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **TypeScript** | 5.2.2 | Type-safe JavaScript |
| **Vite** | 5.0.8 | Build tool & dev server |
| **Tailwind CSS** | 3.4.0 | Styling framework |
| **React Router** | 6.21.1 | Routing |
| **Axios** | 1.6.5 | HTTP client |
| **Framer Motion** | 10.18.0 | Animations |
| **Lucide React** | 0.303.0 | Icon library |

### Additional Services
- **Supabase** - PostgreSQL database hosting
- **Gmail SMTP** - Email delivery
- **Google OAuth** - Social authentication
- **Render** - Deployment platform

## 📁 Project Structure

```
MediMitra/
├── 📂 backend/                     # Spring Boot Backend
│   ├── 📂 src/main/java/com/medimitra/
│   │   ├── 📂 controller/          # REST API Endpoints
│   │   │   ├── AuthController.java
│   │   │   ├── MedicineController.java
│   │   │   ├── CartController.java
│   │   │   ├── OrderController.java
│   │   │   ├── StoreController.java
│   │   │   └── AdminController.java
│   │   ├── 📂 model/               # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Medicine.java
│   │   │   ├── Cart.java
│   │   │   ├── Order.java
│   │   │   ├── Store.java
│   │   │   └── Address.java
│   │   ├── 📂 repository/          # Data Access Layer
│   │   ├── 📂 service/             # Business Logic
│   │   │   ├── AuthService.java
│   │   │   ├── EmailService.java
│   │   │   ├── OrderService.java
│   │   │   └── InvoicePdfGenerator.java
│   │   ├── 📂 security/            # Security Configuration
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── JwtTokenProvider.java
│   │   │   └── SecurityConfig.java
│   │   └── 📂 dto/                 # Data Transfer Objects
│   ├── 📂 src/main/resources/
│   │   └── application.properties  # Application Config
│   ├── Dockerfile
│   └── pom.xml                     # Maven Dependencies
│
├── 📂 frontend/                    # React Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/          # Reusable Components
│   │   │   ├── Navbar.tsx
│   │   │   ├── MedicineCard.tsx
│   │   │   ├── PrivateRoute.tsx
│   │   │   ├── EmailVerification.tsx
│   │   │   └── GoogleSignInButton.tsx
│   │   ├── 📂 pages/               # Page Components
│   │   │   ├── 📂 auth/            # Authentication Pages
│   │   │   │   ├── LoginUser.tsx
│   │   │   │   ├── LoginStore.tsx
│   │   │   │   ├── LoginAdmin.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── 📂 user/            # Patient Pages
│   │   │   │   ├── HomeNew.tsx
│   │   │   │   ├── CartNew.tsx
│   │   │   │   ├── Checkout.tsx
│   │   │   │   └── OrdersNew.tsx
│   │   │   ├── 📂 store/           # Store Partner Pages
│   │   │   │   └── StoreDashboard.tsx
│   │   │   ├── 📂 admin/           # Admin Pages
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── AddMedicine.tsx
│   │   │   │   └── AddStore.tsx
│   │   │   └── 📂 common/          # Shared Pages
│   │   │       ├── BrowseMedicines.tsx
│   │   │       ├── StoreLocator.tsx
│   │   │       └── Feedback.tsx
│   │   ├── 📂 context/             # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── 📂 api/                 # API Services
│   │   │   └── api.ts
│   │   ├── 📂 utils/               # Utility Functions
│   │   │   └── invoiceGenerator.ts
│   │   ├── App.tsx                 # Main App Component
│   │   └── main.tsx                # Entry Point
│   ├── 📂 public/
│   │   └── logo.png                # MediMitra Logo
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── 📄 README.md                    # Project Documentation
├── 📄 render.yaml                  # Deployment Config
└── 📄 .gitignore
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Java 17** or higher ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Maven 3.8+** ([Download](https://maven.apache.org/download.cgi))
- **Node.js 18+** and npm ([Download](https://nodejs.org/))
- **PostgreSQL 15+** or Supabase account ([Supabase](https://supabase.com/))
- **Git** ([Download](https://git-scm.com/downloads))

### 📥 Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/medimitra.git
cd medimitra
```

#### 2️⃣ Database Setup

**Option A: Local PostgreSQL**
```sql
CREATE DATABASE medimitra;
```

**Option B: Supabase** (Recommended)
1. Create account at [supabase.com](https://supabase.com/)
2. Create new project
3. Copy connection string from project settings

#### 3️⃣ Backend Configuration

Navigate to backend directory:
```bash
cd backend
```

Update `src/main/resources/application.properties`:

```properties
# Database Configuration (Use your Supabase connection string)
spring.datasource.url=jdbc:postgresql://your-project.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=your-password

# Email Configuration (Gmail)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# JWT Secret
jwt.secret=your-secure-secret-key-here

# Google OAuth (Optional)
google.client.id=your-google-client-id
google.client.secret=your-google-client-secret
```

> 📘 **Setup Guides:**
> - Email: See [EMAIL_VERIFICATION_SETUP.md](EMAIL_VERIFICATION_SETUP.md)
> - Google OAuth: See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)
> - Environment Variables: See [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)

Build and run the backend:
```bash
mvn clean install
mvn spring-boot:run
```

✅ Backend will start at: **http://localhost:8080**

#### 4️⃣ Frontend Configuration

Navigate to frontend directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Start development server:
```bash
npm run dev
```

✅ Frontend will start at: **http://localhost:5173**

### 🎉 Access the Application

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8080/api](http://localhost:8080/api)

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/verify-email` | Verify email with token | ❌ |
| POST | `/api/auth/google` | Google OAuth login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Medicine Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/medicines` | Get all medicines | ❌ |
| GET | `/api/medicines/{id}` | Get medicine by ID | ❌ |
| GET | `/api/medicines/search?query=` | Search medicines | ❌ |
| POST | `/api/medicines` | Add new medicine | ✅ (Admin/Store) |
| PUT | `/api/medicines/{id}` | Update medicine | ✅ (Admin/Store) |
| DELETE | `/api/medicines/{id}` | Delete medicine | ✅ (Admin) |

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get user's cart | ✅ |
| POST | `/api/cart` | Add item to cart | ✅ |
| PUT | `/api/cart/{itemId}` | Update cart item | ✅ |
| DELETE | `/api/cart/{itemId}` | Remove from cart | ✅ |
| DELETE | `/api/cart` | Clear cart | ✅ |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | Get user orders | ✅ |
| GET | `/api/orders/{id}` | Get order details | ✅ |
| POST | `/api/orders/checkout` | Place order | ✅ |
| GET | `/api/orders/{id}/invoice/download` | Download PDF invoice | ✅ |

### Address Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/addresses` | Get user addresses | ✅ |
| POST | `/api/addresses` | Create address | ✅ |
| PUT | `/api/addresses/{id}` | Update address | ✅ |
| DELETE | `/api/addresses/{id}` | Delete address | ✅ |

### Store Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/stores` | Get all stores | ❌ |
| GET | `/api/stores/{id}` | Get store details | ❌ |
| POST | `/api/stores` | Create store | ✅ (Admin) |
| PUT | `/api/stores/{id}` | Update store | ✅ (Store/Admin) |

## 🔐 Authentication Flow

1. **User Registration**
   - User provides email, password, and details
   - Email verification link sent
   - User verifies email via link

2. **User Login**
   - User provides credentials
   - Backend validates and generates JWT token
   - Frontend stores token in localStorage
   - Token included in Authorization header for protected routes

3. **Token Validation**
   - JWT token validated on each protected API request
   - Expired tokens return 401 Unauthorized
   - User redirected to login page

4. **Google OAuth**
   - User clicks "Sign in with Google"
   - Google authentication flow
   - Backend receives Google token and creates/updates user
   - JWT token returned to frontend

## 🏗️ Architecture

### Backend Architecture

```
┌─────────────────┐
│   Controllers   │ ← REST API Layer
└────────┬────────┘
         │
┌────────▼────────┐
│    Services     │ ← Business Logic
└────────┬────────┘
         │
┌────────▼────────┐
│  Repositories   │ ← Data Access Layer
└────────┬────────┘
         │
┌────────▼────────┐
│   PostgreSQL    │ ← Database
└─────────────────┘
```

### Security Layers

```
Request → CORS Filter → JWT Filter → Security Config → Controller
                            │
                            ▼
                    Token Validation
                            │
                            ▼
                    User Authentication
```

## 🎨 Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#3B82F6` | Buttons, links, accents |
| Medical Teal | `#14B8A6` | Store elements |
| Medical Red | `#EF4444` | Admin elements |
| Medical Green | `#10B981` | Success states |
| Gray | `#6B7280` | Text, borders |
| Light Gray | `#F3F4F6` | Backgrounds |

## 📦 Build & Deployment

### Production Build

**Backend:**
```bash
cd backend
mvn clean package
java -jar target/medimitra-backend-1.0.0.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# Output in dist/ directory
```

### Docker Deployment

```bash
# Backend
cd backend
docker build -t medimitra-backend .
docker run -p 8080:8080 medimitra-backend

# Frontend (requires nginx)
cd frontend
docker build -t medimitra-frontend .
docker run -p 80:80 medimitra-frontend
```

### Render Deployment (Backend)

This project includes a `render.yaml` configuration for easy deployment to Render.

**Step-by-Step Guide:**

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Create Render Account** at [render.com](https://render.com)

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml`

4. **Configure Environment Variables** (Critical!)
   
   In Render Dashboard → Environment → Add the following:
   
   ```env
   # Database (Supabase)
   DATABASE_URL=jdbc:postgresql://your-project.supabase.co:5432/postgres
   DB_USERNAME=postgres.your-project-ref
   DB_PASSWORD=your-database-password
   
   # Email (Gmail) - MUST USE PORT 465 FOR RENDER
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-16-digit-app-password
   
   # JWT Secret (generate a strong random key)
   JWT_SECRET=your-secure-random-key-at-least-32-characters
   
   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   
   # CORS (Add your Vercel frontend URL)
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
   
   # Logging
   LOG_LEVEL=INFO
   MAIL_DEBUG=false
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (5-10 minutes)
   - Your backend will be live at `https://your-app.onrender.com`

### Vercel Deployment (Frontend)

**Step-by-Step Guide:**

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select `frontend` as root directory

3. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   
   In Vercel Dashboard → Settings → Environment Variables:
   
   ```env
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

5. **Deploy**
   - Click "Deploy"
   - Your frontend will be live at `https://your-app.vercel.app`

### Post-Deployment Checklist

✅ **Backend (Render)**
- [ ] All environment variables set correctly
- [ ] Database connection working
- [ ] Email sending working (test OTP/verification)
- [ ] CORS includes frontend URL
- [ ] Health check endpoint responding

✅ **Frontend (Vercel)**
- [ ] API calls reaching backend
- [ ] Google OAuth redirect URLs updated
- [ ] No CORS errors in console
- [ ] All pages loading correctly

✅ **Email Configuration**
- [ ] Gmail 2FA enabled
- [ ] App Password generated (16 digits)
- [ ] Port 465 configured (not 587)
- [ ] SSL enabled (not STARTTLS)
- [ ] Timeout increased to 60000ms

### Render Deployment

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
mvn test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Update documentation for new features
- Add tests for new functionality
- Ensure all tests pass before submitting PR

## 🐛 Known Issues & Troubleshooting

### Backend Issues

**Issue:** Backend keeps restarting
- **Solution:** Disable Spring DevTools in `application.properties`

**Issue:** Database connection failed
- **Solution:** Check Supabase connection string and credentials

**Issue:** Email not sending (Local development)
- **Solution:** Verify Gmail app password and SMTP settings

### Deployment Issues (Render/Vercel)

**Issue:** ❌ Email/OTP not sending - `MailConnectException: Couldn't connect to smtp.gmail.com`
- **Root Cause:** Render/Vercel **FREE TIER BLOCKS Gmail SMTP** (ports 587, 465, 25) to prevent spam
- **Solution:** Use **SendGrid** (free tier: 100 emails/day) instead of Gmail for production
  
  **Quick Fix:**
  1. Sign up at [SendGrid.com](https://sendgrid.com)
  2. Create API Key: Settings → API Keys → Create
  3. Verify sender email: Settings → Sender Authentication
  4. Update Render environment variables:
     ```env
     MAIL_HOST=smtp.sendgrid.net
     MAIL_PORT=587
     MAIL_USERNAME=apikey
     MAIL_PASSWORD=SG.your-sendgrid-api-key-here
     MAIL_FROM=your-verified-email@gmail.com
     ```
  5. Redeploy on Render
  
  📘 **Detailed Guide:** See [SENDGRID_SETUP.md](SENDGRID_SETUP.md)
  
  **Why this works:**
  - SendGrid uses API-based SMTP that isn't blocked by cloud providers
  - Better deliverability than Gmail
  - Professional email tracking and analytics
  - Gmail still works fine for localhost development

**Issue:** CORS errors in production
- **Solution:** Add your Vercel domain to `CORS_ALLOWED_ORIGINS` environment variable on Render
  ```
  CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
  ```

**Issue:** 502 Bad Gateway on Render
- **Solution:** Ensure `PORT` environment variable is set and app listens on `${PORT:8080}`

**Issue:** Database connection pool exhausted
- **Solution:** Adjust HikariCP settings in application.properties:
  ```properties
  spring.datasource.hikari.maximum-pool-size=5
  spring.datasource.hikari.minimum-idle=1
  ```

### Frontend Issues

**Issue:** API calls failing with CORS error
- **Solution:** Check CORS configuration in `SecurityConfig.java` and ensure frontend URL is in allowed origins

**Issue:** Google OAuth not working
- **Solution:** Add production URL to Google Cloud Console authorized origins and redirect URIs

**Issue:** Environment variables not loading on Vercel
- **Solution:** Set all `VITE_*` variables in Vercel dashboard (Settings → Environment Variables)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Spring Boot framework and community
- React and Vite teams
- Tailwind CSS for the amazing utility-first CSS framework
- Supabase for database hosting
- All open-source contributors

## 📞 Support

For support, email bisht.dheeraj2004c@example.com or open an issue in the GitHub repository.

---

<div align="center">
  <p>Made with ❤️ for better healthcare access</p>
  <p>
    <strong>MediMitra</strong> - Your Trusted Healthcare Partner
  </p>
  
  ⭐ Star this repository if you find it helpful!
</div>
