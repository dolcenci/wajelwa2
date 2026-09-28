# Wajelwa – React E-Commerce Web Application

## 1. Project Overview

**Wajelwa** is a React-based e-commerce web application designed for an online fashion store. The application allows customers to browse products, view product details, manage their shopping cart, create an account, log in, and place orders.

The application focuses on providing a simple and user-friendly shopping experience for fashion products such as:

* T-Shirts
* Hoodies
* Sweaters

The system consists of a **React frontend**, **Node.js/Express backend**, and **PostgreSQL database**.

---

## 2. Technologies Used

### Frontend

* React.js
* React Router
* Axios
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* CORS
* dotenv

### Database

* PostgreSQL

### Payment

* Stripe

---

## 3. Main Features

### Customer Features

* User registration
* User login and authentication
* Browse products
* Search products
* Filter products by category
* Filter products by price
* Sort products by price
* View individual product details
* Select product quantity
* Add products to cart
* Update cart quantities
* Remove products from cart
* View order information
* User profile management
* Responsive navigation

### Product Categories

The application currently supports the following product categories:

* T-Shirts
* Hoodies
* Sweaters

---

# 4. Project Structure

The project is divided into a frontend and backend.

```text
Wajelwa/
│
├── frontend/
│   ├── public/
│   │   └── images/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json
│   └── README.md
│
└── backend/
    ├── config/
    │   └── db.js
    │
    ├── routes/
    │   ├── productRoutes.js
    │   ├── userRoutes.js
    │   ├── profileRoutes.js
    │   ├── cartRoutes.js
    │   └── orderRoutes.js
    │
    ├── index.js
    ├── package.json
    └── .env
```

---

# 5. Requirements

Before running the application, make sure the following software is installed:

* Node.js
* npm
* PostgreSQL
* pgAdmin 4 or PostgreSQL command-line tools
* Git (optional)

You can check whether Node.js and npm are installed by running:

```bash
node --version
npm --version
```

To check PostgreSQL:

```bash
psql --version
```

---

# 6. Installing the Project

Clone or download the Wajelwa project.

If using Git:


git clone https://github.com/dolcenci/wajelwa2


Navigate into the project directory:


cd Wajelwa2

---

# 7. Installing Frontend Dependencies

Navigate to the frontend directory:


cd frontend


Install the required dependencies:

npm install

---

# 8. Installing Backend Dependencies

Open another terminal and navigate to the backend directory:


cd backend


Install the backend dependencies:

```bash
npm install
```

---

# 9. PostgreSQL Database Setup

Wajelwa uses **PostgreSQL** as its database.

Before starting the application, the PostgreSQL database must be created and the supplied database SQL file must be imported.

## Step 1 – Open PostgreSQL

You can use either:

* pgAdmin 4
* PostgreSQL Command Prompt / Terminal

---

## Step 2 – Create the Database

Create a new PostgreSQL database for Wajelwa.

For example:

```text
wajelwa
```

### Using pgAdmin

1. Open **pgAdmin 4**.
2. Connect to your PostgreSQL server.
3. Right-click **Databases**.
4. Select **Create → Database**.
5. Enter:

```text
Database: wajelwa
```

6. Click **Save**.

---

# 10. Importing the Wajelwa Database

The project should contain a PostgreSQL database backup or SQL file, for example:

```text
wajelwa.sql
```

The SQL file contains the database structure and data required by the application.

There are two ways to import the database.

---

## Method 1 – Import Using pgAdmin

### Step 1

Open **pgAdmin 4**.

### Step 2

Navigate to:

```text
Servers
└── PostgreSQL
    └── Databases
        └── wajelwa
```

### Step 3

If the database file is a `.sql` file, open the **Query Tool** for the `wajelwa` database.

### Step 4

Open the SQL file:

```text
wajelwa.sql
```

You can open it using:

**File → Open**

or copy and paste the SQL contents into the Query Tool.

### Step 5

Click the **Execute** button.

The SQL script will create the required tables and insert the database records.

After the script has finished, refresh the database in pgAdmin.

You should see the application's tables under:

```text
wajelwa
└── Schemas
    └── public
        └── Tables
```

---

# 11. Importing Using PostgreSQL Command Line

If you prefer using the PostgreSQL terminal, first create the database:

```bash
createdb -U postgres wajelwa
```

Then import the SQL file:

```bash
psql -U postgres -d wajelwa -f wajelwa.sql
```

You may be asked to enter your PostgreSQL password.

For example:

```text
Password for user postgres:
```

Enter the password you created when installing PostgreSQL.

---

# 12. Configure the Backend Database Connection

After importing the database, the backend needs the PostgreSQL connection details.

Create a `.env` file inside the **backend** folder.

Example:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=wajelwa
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_PORT=5432
PORT=5000
```

Replace:

```text
YOUR_POSTGRES_PASSWORD
```

with the password for your PostgreSQL user.

For example:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=wajelwa
DB_PASSWORD=postgres123
DB_PORT=5432
PORT=5000
```



---

# 13. Backend Database Connection

The backend connects to PostgreSQL using the database configuration located in:

```text
backend/config/db.js
```

The backend uses the PostgreSQL connection details stored in the `.env` file.

The database must be running before starting the backend.

---

# 14. Running the Backend

Open a terminal and navigate to the backend:

```bash
cd backend
```

Start the backend server:

```bash
node index.js
```

If everything is configured correctly, the backend should run on:

```text
http://localhost:5000
```

---

# 15. Running the Frontend

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Start the React application:

```bash
npm start
```

The React application should open in your browser at:

```text
http://localhost:3000
```

The frontend communicates with the backend through:

```text
http://localhost:5000
```

---

# 16. Running the Complete Application

To run Wajelwa, make sure all three components are available:

```text
PostgreSQL Database
        ↓
Node.js / Express Backend
        ↓
React Frontend
```

### Step 1

Start PostgreSQL.

### Step 2

Start the backend:

```bash
cd backend
node index.js
```

### Step 3

Start the frontend in a separate terminal:

```bash
cd frontend
npm start
```

### Step 4

Open:

```text
http://localhost:3000
```

---

# 17. API Communication

The React frontend communicates with the Express backend through API services.

The frontend uses Axios to send requests to the backend.

Examples of application functionality handled through the API include:

```text
Products
Users
Profiles
Cart
Orders
```

The backend routes include:

```text
/product
/user
/profile
/cart
/order
```

---

# 18. Environment Variables

The following environment variables may be required by the backend:

```env
DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=
PORT=
```

If Stripe is configured for the application, Stripe environment variables should also be added to the `.env` file.

For example:

```env
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
```

Never commit secret keys or passwords to a public repository.

---

# 19. Troubleshooting

## Database Connection Error

If you receive an error such as:

```text
connection refused
```

check that:

1. PostgreSQL is running.
2. The database name is correct.
3. The PostgreSQL username is correct.
4. The PostgreSQL password is correct.
5. The PostgreSQL port is correct.
6. The `.env` file is located in the backend folder.

The default PostgreSQL port is:

```text
5432
```

---

## Frontend Cannot Connect to Backend

Make sure the backend is running:

```bash
node index.js
```

The backend should be running on:

```text
http://localhost:5000
```

Also check that the frontend `package.json` contains the correct proxy:

```json
"proxy": "http://localhost:5000"
```

---

## Products Are Not Displaying

Check that:

1. PostgreSQL is running.
2. The Wajelwa database was imported correctly.
3. The products table contains data.
4. The backend is running.
5. The frontend is running.
6. The API endpoint is correct.

---

# 20. Security

Sensitive information should not be stored directly in the source code.

The following should be stored in `.env`:

* Database passwords
* Stripe secret keys
* Authentication secrets
* Other private API keys

The `.env` file should be added to `.gitignore`:

```text
.env
node_modules/
```

---

# 21. Future Improvements

Possible future improvements include:

* Product reviews and ratings
* Wishlist functionality
* Advanced product filtering
* Order tracking
* Admin dashboard
* Product management
* Inventory management
* Customer order history
* Additional payment methods
* Improved mobile responsiveness

#

---

# 22. License

This project was developed as part of the Wajelwa e-commerce web application project.
