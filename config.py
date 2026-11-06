# Database Configuration
# Load credentials from environment variables for security
# Create a .env file based on .env.example and set your actual credentials there

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database Configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME', 'Hotel_Management'),
    'port': int(os.getenv('DB_PORT', 3306))
}

# Application Settings
APP_TITLE = os.getenv('APP_TITLE', 'Hotel Management System')
APP_ICON = os.getenv('APP_ICON', '🏨')

# Color Theme
PRIMARY_COLOR = os.getenv('PRIMARY_COLOR', '#667eea')
SECONDARY_COLOR = os.getenv('SECONDARY_COLOR', '#764ba2')

# Validation: Ensure required credentials are set
if not DB_CONFIG['user']:
    raise ValueError(
        "Database user not configured!\n"
        "Please create a .env file (copy from .env.example) and set DB_USER."
    )

if not DB_CONFIG['password']:
    raise ValueError(
        "Database password not configured!\n"
        "Please create a .env file (copy from .env.example) and set DB_PASSWORD."
    )
