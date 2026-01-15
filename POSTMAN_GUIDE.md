# Postman Testing Guide for Ecommerce API

## 1. Prerequisites
- Ensure the backend is running: `npm run start:dev`
- Base URL: `http://localhost:3000`

## 2. Authentication Flow (Setup)
Most endpoints are protected and require a JWT Token. You must get this token first.

### A. Register a User
- **Method**: `POST`
- **URL**: `http://localhost:3000/auth/register`
- **Body** (JSON):
  ```json
  {
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }
  ```
- **Response**: Should return the created user object (without password).

### B. Login
- **Method**: `POST`
- **URL**: `http://localhost:3000/auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbGqiOiJIUzI1NiIsInR5cCI..."
  }
  ```

### C. Configure Authorization in Postman
1. Copy the `access_token` from the login response.
2. In Postman, go to the **Authorization** tab of your collection or request.
3. Select **Type**: **Bearer Token**.
4. Paste the token into the **Token** field.
5. Now subsequent requests will be authenticated.

---

## 3. Operations

### A. Get Profile
- **Method**: `GET`
- **URL**: `http://localhost:3000/users/profile`
- **Auth**: Bearer Token required.
- **Response**: User details.

### B. Create Product (Admin/User)
- **Method**: `POST`
- **URL**: `http://localhost:3000/products`
- **Auth**: Bearer Token required.
- **Body** (JSON):
  ```json
  {
    "name": "Cool T-Shirt",
    "description": "A very cool t-shirt",
    "price": 29.99,
    "stock": 100
  }
  ```

### C. List Products
- **Method**: `GET`
- **URL**: `http://localhost:3000/products`
- **Auth**: None (Public).

### D. Create Order
- **Method**: `POST`
- **URL**: `http://localhost:3000/orders`
- **Auth**: Bearer Token required.
- **Body** (JSON):
  ```json
  {
    "items": [
      {
        "productId": "UUID_OF_PRODUCT_FROM_STEP_B",
        "quantity": 2
      }
    ]
  }
  ```
- **Note**: Copy the `id` from the **Create Product** response and paste it into `productId`.
- **Response**: Order object with `totalAmount`.

### E. Initiate Payment
- **Method**: `POST`
- **URL**: `http://localhost:3000/payments/create-intent/ORDER_UUID_HERE`
- **Auth**: Bearer Token required.
- **Response**:
  ```json
  {
    "clientSecret": "pi_3M...",
    "paymentIntentId": "pi_3M..."
  }
  ```

---

## 4. Swagger UI
Alternatively, you can test everything in your browser without Postman:
- Open: http://localhost:3000/api
- Click **Authorize** button and paste your token (Format: `Bearer <token>`).
