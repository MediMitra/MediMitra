# MediMitra - Medical E-Commerce Platform

A modern full-stack medical e-commerce application built with **Spring Boot** (backend) and **React with Tailwind CSS** (frontend).

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2.1
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security with BCrypt password encoding

### Frontend (React)
- **Framework**: React 18.2
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Build Tool**: Vite

## 📁 Project Structure

```
medimitra_new/
├── backend/                        # Spring Boot Backend
│   ├── src/main/java/com/medimitra/
│   │   ├── controller/             # REST API Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── MedicineController.java
│   │   │   ├── CartController.java
│   │   │   ├── OrderController.java
│   │   │   └── AddressController.java
│   │   ├── model/                  # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Medicine.java
│   │   │   ├── CartItem.java
│   │   │   ├── Order.java
│   │   │   ├── OrderItem.java
│   │   │   └── Address.java
│   │   ├── repository/             # Data Access Layer
│   │   ├── service/                # Business Logic
│   │   ├── security/               # JWT & Security Config
│   │   └── dto/                    # Data Transfer Objects
│   ├── src/main/resources/
│   │   └── application.properties  # Configuration
│   └── pom.xml                     # Maven Dependencies
│
└── frontend/                       # React Frontend
    ├── src/
    │   ├── components/             # Reusable Components
    │   │   ├── Navbar.jsx
    │   │   ├── MedicineCard.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── pages/                  # Page Components
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Medicines.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   └── Orders.jsx
    │   ├── context/                # React Context (Auth)
    │   ├── api/                    # API Service Layer
    │   ├── App.jsx                 # Main App Component
    │   └── main.jsx                # Entry Point
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## 🚀 Getting Started

### Prerequisites
- **Java 21** or higher
- **Maven 3.8+**
- **Node.js 18+** and npm
- **MySQL 8.0**

### Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE medimitra;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/medimitra
spring.datasource.username=root
spring.datasource.password=your_password
```

3. The application will auto-create tables on first run (Hibernate DDL set to `update`)

4. Import sample data from the original project:
```bash
mysql -u root -p medimitra < ../database/sample_data.sql
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd medimitra_new/backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

Backend will start at: **http://localhost:8080/api**

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd medimitra_new/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will start at: **http://localhost:3000**

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Medicines (Public)
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/{id}` - Get medicine by ID
- `GET /api/medicines/search?query=` - Search medicines
- `GET /api/medicines/category/{categoryId}` - Get by category

### Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{itemId}` - Update cart item
- `DELETE /api/cart/{itemId}` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Orders (Protected)
- `GET /api/orders` - Get user orders
- `GET /api/orders/{orderId}` - Get order details
- `POST /api/orders/checkout` - Place order

### Addresses (Protected)
- `GET /api/addresses` - Get user addresses
- `POST /api/addresses` - Create address
- `PUT /api/addresses/{id}` - Update address
- `DELETE /api/addresses/{id}` - Delete address

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend generates JWT token
3. Frontend stores token in localStorage
4. Token sent in Authorization header: `Bearer <token>`
5. Backend validates token on protected routes

## 🎨 Features

### Implemented
✅ User Registration & Login with JWT  
✅ Browse Medicines with Search  
✅ Add to Cart / Update Quantity  
✅ Checkout with Address Management  
✅ Order History  
✅ Responsive Design (Tailwind CSS)  
✅ Protected Routes  
✅ CORS Configuration  

### Tech Highlights
- **RESTful API** design
- **JWT-based** stateless authentication
- **Spring Security** integration
- **React Context API** for state management
- **Tailwind CSS** utility-first styling
- **Vite** for fast development builds
- **Axios interceptors** for token management

## 🛠️ Development

### Build for Production

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

### Environment Variables

Create `.env` file in frontend:
```
VITE_API_URL=http://localhost:8080/api
```

## 📝 Default Test Users

Use the sample data from the original database:
- Email: `john_doe@example.com` / Password: `password123`
- Email: `jane_smith@example.com` / Password: `password123`

## 🔧 Configuration

### CORS Settings
Configured in `SecurityConfig.java`:
```java
cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

### JWT Secret
Set in `application.properties`:
```properties
jwt.secret=your-secret-key
jwt.expiration=86400000  # 24 hours
```

## 📦 Dependencies

### Backend
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- MySQL Connector
- JWT (jjwt)
- Lombok
- Spring Boot DevTools

### Frontend
- React & React DOM
- React Router DOM
- Axios
- Tailwind CSS
- Vite

## 🎯 Next Steps

1. Install dependencies in both directories
2. Start MySQL database
3. Run backend application
4. Run frontend development server
5. Access application at http://localhost:3000

## 📄 License

This project is for educational purposes.

---

**Created**: December 2025  
**Tech Stack**: Spring Boot + React + Tailwind CSS + MySQL
