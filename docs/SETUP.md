# Hotel Management System - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **MySQL 8.0+** ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git** (optional, for version control)

---

## Step 1: Clone or Download the Project

```bash
# If using Git
git clone <repository-url>
cd HOTEL-MANAGEMENT-SYSTEM-main

# Or extract the ZIP file and navigate to the project directory
```

---

## Step 2: Set Up Python Environment

### Create Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- streamlit
- mysql-connector-python
- pandas
- plotly
- python-dateutil
- python-dotenv

---

## Step 3: Configure Database Credentials

### Create Environment File

1. Copy the example environment file:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

2. Edit `.env` file with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=Hotel_Management
DB_PORT=3306
```

**Important Security Notes:**
- ✅ `.env` is already in `.gitignore` and will NOT be committed to Git
- ✅ Never share your `.env` file or commit it to version control
- ✅ Each developer should create their own `.env` file locally

---

## Step 4: Set Up MySQL Database

### Option A: Safe Initialization (Preserves Existing Data)

Use this if you're setting up for the first time OR want to keep existing data:

```bash
mysql -u your_username -p < Hotel_management_init.sql
```

When prompted, enter your MySQL password.

**What this does:**
- Creates database if it doesn't exist
- Creates tables if they don't exist
- Inserts sample data only if tables are empty
- Safe to run multiple times

### Option B: Complete Reset (Deletes All Data)

⚠️ **WARNING:** This deletes ALL data in the Hotel_Management database!

Use this ONLY for development/testing when you want a fresh start:

```bash
mysql -u your_username -p < Hotel_management_RESET.sql
```

**What this does:**
- Drops the entire database
- Creates fresh database and tables
- Inserts clean sample data
- **Cannot be undone!**

### Verify Database Setup

```bash
mysql -u your_username -p Hotel_Management
```

```sql
-- Check tables exist
SHOW TABLES;

-- Should show: Booking, Feedback, Guest, Guest_Service, Hotel, Payment, Payment_Log, 
--              RestaurantOrder, Room, Service, Staff

-- Check sample data
SELECT * FROM Hotel;

-- Exit MySQL
EXIT;
```

---

## Step 5: Run the Application

```bash
streamlit run app.py
```

The application will:
1. Read configuration from `.env` file
2. Connect to MySQL database
3. Open in your default browser at `http://localhost:8501`

If you see an error about missing `DB_USER` or `DB_PASSWORD`, ensure your `.env` file is properly configured.

---

## Troubleshooting

### Error: "DB_USER environment variable is required"

**Solution:** Your `.env` file is missing or not properly configured.

1. Verify `.env` file exists in the project root
2. Check that it contains `DB_USER=your_username`
3. Ensure there are no extra spaces: `DB_USER=root` (not `DB_USER = root`)

### Error: "Access denied for user"

**Solution:** MySQL credentials are incorrect.

1. Check your MySQL username and password
2. Update `.env` file with correct credentials
3. Test connection: `mysql -u your_username -p`

### Error: "Unknown database 'Hotel_Management'"

**Solution:** Database hasn't been created yet.

1. Run the initialization script: `mysql -u your_username -p < Hotel_management_init.sql`
2. Or create manually:
   ```sql
   CREATE DATABASE Hotel_Management;
   ```

### Error: "ModuleNotFoundError: No module named 'dotenv'"

**Solution:** Dependencies not installed.

```bash
pip install -r requirements.txt
```

### Error: "Can't connect to MySQL server on 'localhost'"

**Solution:** MySQL server is not running.

- **Windows:** Start MySQL service from Services panel
- **macOS:** `brew services start mysql`
- **Linux:** `sudo systemctl start mysql`

### Error: "Table 'Hotel' doesn't exist"

**Solution:** Database tables not created.

```bash
mysql -u your_username -p < Hotel_management_init.sql
```

---

## Development Database Reset

During development, if you want to start with fresh data:

1. **Back up first if needed:**
   ```bash
   mysqldump -u your_username -p Hotel_Management > backup_$(date +%Y%m%d).sql
   ```

2. **Run reset script:**
   ```bash
   mysql -u your_username -p < Hotel_management_RESET.sql
   ```

3. **Restart the application:**
   ```bash
   streamlit run app.py
   ```

---

## Project Structure

```
HOTEL-MANAGEMENT-SYSTEM-main/
│
├── app.py                          # Main Streamlit application
├── config.py                       # Configuration loader (reads from .env)
├── config.example.py               # Configuration template (reference only)
│
├── .env                           # Your credentials (DO NOT COMMIT)
├── .env.example                   # Template for .env file
├── .gitignore                     # Git ignore rules
│
├── Hotel_management2.sql          # Original SQL script (deprecated)
├── Hotel_management_init.sql      # Safe initialization script
├── Hotel_management_RESET.sql     # Destructive reset script (dev only)
│
├── requirements.txt               # Python dependencies
├── README.md                      # Project overview
└── docs/
    └── SETUP.md                   # This file
```

---

## Security Best Practices

### ✅ DO:
- Use `.env` file for credentials
- Keep `.env` file out of version control
- Use different credentials for development and production
- Regularly update your MySQL password
- Limit MySQL user permissions (don't use root in production)

### ❌ DON'T:
- Commit `.env` file to Git
- Share your `.env` file via email/chat
- Use default passwords like "root" or "password"
- Expose database credentials in screenshots or documentation
- Use the same credentials across multiple projects

---

## Next Steps

After successful setup:

1. **Explore the Application:**
   - Navigate through different modules in the sidebar
   - Add hotels, guests, bookings, etc.
   - View analytics and reports

2. **Customize:**
   - Modify `config.py` for additional settings
   - Update `app.py` for UI customizations
   - Extend database schema in `Hotel_management_init.sql`

3. **Development:**
   - Create a new branch for features: `git checkout -b feature/your-feature`
   - Test changes with `Hotel_management_RESET.sql` for fresh data
   - Commit changes (`.env` will be automatically ignored)

---

## Support

For issues:
1. Check the Troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure MySQL server is running
4. Check `.env` file configuration
5. Review error messages in the terminal

---

## Version History

- **v1.1** - Added environment variable configuration, safe initialization script
- **v1.0** - Initial release with hardcoded credentials (deprecated)
