# Database Setup Guide

## Prerequisites
- MySQL Server installed and running
- MySQL credentials: username=root, password=root (or update in application.properties)

## Option 1: Automatic Setup (Recommended)
The backend will automatically create tables when you start it:
```bash
cd food-donation-backend
mvn spring-boot:run
```
Spring Boot will create all tables based on your entity classes.

## Option 2: Manual Setup
If you prefer to create the database manually:

### Step 1: Start MySQL
```bash
net start MySQL80
# or
net start MySQL
```

### Step 2: Login to MySQL
```bash
mysql -u root -p
# Enter password: root
```

### Step 3: Run Schema File
```sql
source C:/Users/2427899/SpringBoot/food-donation-backend/database/schema.sql
```

Or import via MySQL Workbench:
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. File → Run SQL Script
4. Select: `food-donation-backend/database/schema.sql`
5. Click Run

### Step 4: Verify Database
```sql
USE food_donation_db;
SHOW TABLES;
SELECT * FROM users;
```

## Database Schema Overview

### Tables Created:
1. **users** - Stores user accounts (donors, NGOs, volunteers, admins)
2. **donations** - Stores food donation listings
3. **reviews** - Stores user ratings and reviews

### Sample Data Included:
- 3 test users (password: `password123`)
  - donor@example.com (DONOR)
  - ngo@example.com (NGO)
  - volunteer@example.com (VOLUNTEER)
- 3 sample donations
- 3 sample reviews

## Connection Details
- **Host**: localhost
- **Port**: 3306
- **Database**: food_donation_db
- **Username**: root
- **Password**: root

## Troubleshooting

### MySQL Not Starting
```bash
# Check MySQL service status
sc query MySQL80

# Start MySQL service
net start MySQL80
```

### Connection Refused
- Verify MySQL is running on port 3306
- Check firewall settings
- Verify credentials in application.properties

### Database Already Exists
```sql
DROP DATABASE food_donation_db;
# Then run schema.sql again
```

## Next Steps
1. Start MySQL service
2. Run schema.sql (or let Spring Boot auto-create)
3. Start backend: `mvn spring-boot:run`
4. Start frontend: Open index.html or use Live Server
5. Test login with sample users
