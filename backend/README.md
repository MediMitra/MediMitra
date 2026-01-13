# MediMitra Backend - Setup Guide

## Prerequisites
- Java 21
- Maven 3.6+
- Supabase PostgreSQL Database

## Supabase Setup

### 1. Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Wait for database to be provisioned

### 2. Get Database Credentials
1. Go to Project Settings → Database
2. Copy the connection pooler string (Transaction mode)
3. Update `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
spring.datasource.username=postgres.YOUR_PROJECT_REF
spring.datasource.password=YOUR_SUPABASE_PASSWORD
```

### 3. Configure JWT Secret
Update the JWT secret in `application.properties`:
```properties
jwt.secret=your-secure-random-secret-key-min-64-chars-for-production
```

## Build & Run

### Build the project
```bash
cd backend
mvn clean install
```

### Run the application
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Medicines
- GET `/api/medicines` - Get all medicines
- GET `/api/medicines/{id}` - Get medicine by ID
- GET `/api/medicines/search?query=` - Search medicines
- GET `/api/medicines/category/{category}` - Get by category

### Cart (Requires Authentication)
- GET `/api/cart` - Get user cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/{itemId}` - Update cart item
- DELETE `/api/cart/{itemId}` - Remove from cart
- DELETE `/api/cart` - Clear cart

### Orders (Requires Authentication)
- GET `/api/orders` - Get user orders
- GET `/api/orders/{orderId}` - Get order by ID
- POST `/api/orders/checkout` - Checkout and create order

### Addresses (Requires Authentication)
- GET `/api/addresses` - Get user addresses
- POST `/api/addresses` - Create address
- PUT `/api/addresses/{id}` - Update address
- DELETE `/api/addresses/{id}` - Delete address

## Database Tables

The application will auto-create these tables on first run:
- users
- medicines
- carts
- cart_items
- orders
- order_items
- addresses

## Initial Data

To add sample medicines, you can use the POST `/api/medicines` endpoint or insert directly into the database.

Example medicine:
```json
{
  "name": "Paracetamol 500mg",
  "description": "Fever and pain relief medication",
  "price": 50.00,
  "stock": 100,
  "category": "Pain Relief",
  "manufacturer": "ABC Pharma",
  "imageUrl": "https://example.com/paracetamol.jpg",
  "prescriptionRequired": false
}
```
