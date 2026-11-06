import streamlit as st
import mysql.connector
import pandas as pd
from datetime import datetime, date, timedelta
import plotly.express as px
import plotly.graph_objects as go
from config import DB_CONFIG

# Page configuration
st.set_page_config(
    page_title="Hotel Management System",
    page_icon="🏨",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
def load_css():
    st.markdown("""
        <style>
        .main {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .stApp {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        .hotel-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin: 10px 0;
            color: #2c3e50;
        }
        .hotel-card h4 {
            color: #667eea;
            margin-bottom: 10px;
        }
        .hotel-card p {
            color: #2c3e50;
            margin: 5px 0;
        }
        .hotel-card small {
            color: #7f8c8d;
        }
        .metric-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 180px;
        }
        .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.4);
        }
        .metric-card h2 {
            font-size: 3em;
            margin: 0 0 15px 0;
            color: white;
        }
        .metric-card h3 {
            font-size: 2.2em;
            margin: 10px 0;
            font-weight: bold;
            color: white;
        }
        .metric-card p {
            font-size: 1.1em;
            margin: 10px 0 0 0;
            color: rgba(255, 255, 255, 0.95);
            font-weight: 500;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        }
        .stButton>button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            font-weight: bold;
            transition: all 0.3s;
        }
        .stButton>button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0,0,0,0.2);
        }
        .sidebar .sidebar-content {
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
        }
        </style>
    """, unsafe_allow_html=True)

# Database connection
def get_connection():
    """Create a new database connection.
    
    Returns a new MySQL connection on each call. Caller is responsible
    for closing the connection after use.
    
    Note: Use execute_query() or call_procedure() for automatic cleanup.
    
    Returns:
        mysql.connector.connection.MySQLConnection: Database connection, or None on error
    """
    conn = None
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        # Verify connection is alive. reconnect=False ensures we detect a dead
        # socket rather than silently replacing it with a new one.
        conn.ping(reconnect=False, attempts=1, delay=0)
        return conn
    except Exception as e:
        # If connect() succeeded but ping() failed, conn is not None and must
        # be closed here. A close failure must not hide the original error.
        if conn is not None:
            try:
                conn.close()
            except Exception:
                pass
        st.error(f"Database connection error: {e}")
        return None

# Database query function
def execute_query(query, params=None, fetch=True):
    """Execute a database query with automatic connection and transaction management.
    
    Creates a new connection for each query and ensures proper cleanup via finally block.
    Automatically commits successful writes and rolls back on errors.
    
    Args:
        query (str): SQL query with %s placeholders for parameters
        params (tuple, optional): Parameters for the query. Defaults to None.
        fetch (bool, optional): If True, return query results; if False, commit changes. Defaults to True.
        
    Returns:
        list: List of dict rows if fetch=True and successful
        bool: True if fetch=False and successful commit
        None: If fetch=True and error occurred
        bool: False if fetch=False and error occurred
        
    Example:
        # Read query
        hotels = execute_query("SELECT * FROM Hotel WHERE rating > %s", (4.5,))
        
        # Write query
        success = execute_query("INSERT INTO Hotel (name, rating) VALUES (%s, %s)", 
                               ("New Hotel", 4.8), fetch=False)
    """
    conn = None
    cursor = None
    try:
        conn = get_connection()
        if not conn:
            return None if fetch else False
            
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, params or ())
        
        if fetch:
            # Fetch all results before closing cursor
            result = cursor.fetchall()
            return result
        else:
            # Commit write operations
            conn.commit()
            return True
            
    except Exception as e:
        # Rollback failed transaction
        if conn:
            try:
                conn.rollback()
            except Exception:
                pass  # Connection might already be closed
        st.error(f"Query error: {e}")
        return None if fetch else False
        
    finally:
        # Always clean up resources
        if cursor:
            try:
                cursor.close()
            except Exception:
                pass
        if conn:
            try:
                conn.close()
            except Exception:
                pass

# Call stored procedure
def call_procedure(proc_name, params=None):
    """Call a stored procedure with automatic connection and transaction management.
    
    Creates a new connection for each procedure call and ensures proper cleanup.
    Automatically commits successful procedures and rolls back on errors.
    
    Args:
        proc_name (str): Name of the stored procedure to call
        params (list, optional): List of parameters for the procedure. Defaults to None.
        
    Returns:
        list: List of result rows from the procedure, or None on error
        
    Example:
        # Call procedure
        results = call_procedure('GetAvailableRoomsByHotel', [hotel_id])
        
        # Call procedure with no results
        call_procedure('CheckOutGuest', [booking_id])
    """
    conn = None
    cursor = None
    try:
        conn = get_connection()
        if not conn:
            return None
            
        cursor = conn.cursor(dictionary=True)
        cursor.callproc(proc_name, params or ())
        
        # Fetch results from all result sets
        results = []
        for result in cursor.stored_results():
            results.extend(result.fetchall())
        
        # Commit procedure changes
        conn.commit()
        return results
        
    except Exception as e:
        # Rollback failed transaction
        if conn:
            try:
                conn.rollback()
            except Exception:
                pass  # Connection might already be closed
        st.error(f"Procedure error: {e}")
        return None
        
    finally:
        # Always clean up resources
        if cursor:
            try:
                cursor.close()
            except Exception:
                pass
        if conn:
            try:
                conn.close()
            except Exception:
                pass

# Home Page
def home_page():
    st.title("🏨 Welcome to Hotel Management System")
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    col1, col2, col3, col4 = st.columns(4, gap="large")
    
    # Get statistics
    total_hotels = execute_query("SELECT COUNT(*) as count FROM Hotel")
    total_guests = execute_query("SELECT COUNT(*) as count FROM Guest")
    total_bookings = execute_query("SELECT COUNT(*) as count FROM Booking")
    total_revenue = execute_query("SELECT SUM(amount) as total FROM Payment")
    
    with col1:
        st.markdown(f"""
            <div class='metric-card'>
                <h2>🏨</h2>
                <h3>{total_hotels[0]['count'] if total_hotels else 0}</h3>
                <p>Total Hotels</p>
            </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
            <div class='metric-card'>
                <h2>👥</h2>
                <h3>{total_guests[0]['count'] if total_guests else 0}</h3>
                <p>Total Guests</p>
            </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
            <div class='metric-card'>
                <h2>📅</h2>
                <h3>{total_bookings[0]['count'] if total_bookings else 0}</h3>
                <p>Total Bookings</p>
            </div>
        """, unsafe_allow_html=True)
    
    with col4:
        revenue = total_revenue[0]['total'] if total_revenue and total_revenue[0]['total'] else 0
        st.markdown(f"""
            <div class='metric-card'>
                <h2>💰</h2>
                <h3>₹{revenue:,.2f}</h3>
                <p>Total Revenue</p>
            </div>
        """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Display hotels
    st.subheader("🏨 Our Hotels")
    hotels = execute_query("SELECT * FROM Hotel ORDER BY rating DESC")
    
    if hotels:
        for hotel in hotels:
            col1, col2, col3 = st.columns([3, 1, 1])
            with col1:
                st.markdown(f"### {hotel['hotel_name']}")
                st.write(f"📍 Location: {hotel['location']}")
            with col2:
                st.metric("Rating", f"⭐ {hotel['rating']}")
            with col3:
                if st.button(f"View Rooms", key=f"hotel_{hotel['hotel_id']}"):
                    st.session_state['selected_hotel'] = hotel['hotel_id']
                    st.rerun()
    
    # Revenue Chart
    st.subheader("📊 Revenue Analysis")
    revenue_data = execute_query("""
        SELECT DATE_FORMAT(payment_date, '%Y-%m') as month, SUM(amount) as total
        FROM Payment
        GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
        ORDER BY month
    """)
    
    if revenue_data:
        df = pd.DataFrame(revenue_data)
        fig = px.bar(df, x='month', y='total', 
                     labels={'month': 'Month', 'total': 'Revenue (₹)'},
                     title='Monthly Revenue',
                     color='total',
                     color_continuous_scale='Viridis')
        st.plotly_chart(fig, use_container_width=True)

# Hotel Management
def hotel_management():
    st.title("🏨 Hotel Management")
    
    tab1, tab2, tab3 = st.tabs(["View Hotels", "Add Hotel", "Manage Rooms"])
    
    with tab1:
        st.subheader("All Hotels")
        hotels = execute_query("SELECT * FROM Hotel")
        if hotels:
            df = pd.DataFrame(hotels)
            st.dataframe(df, use_container_width=True)
            
            # Update hotel rating
            st.subheader("Update Hotel")
            selected_hotel = st.selectbox("Select Hotel", df['hotel_name'].tolist())
            hotel_id = int(df[df['hotel_name'] == selected_hotel]['hotel_id'].values[0])
            
            col1, col2 = st.columns(2)
            with col1:
                new_location = st.text_input("New Location", str(df[df['hotel_id'] == hotel_id]['location'].values[0]))
            with col2:
                new_rating = st.number_input("New Rating", 0.0, 5.0, float(df[df['hotel_id'] == hotel_id]['rating'].values[0]), 0.1)
            
            if st.button("Update Hotel"):
                query = "UPDATE Hotel SET location = %s, rating = %s WHERE hotel_id = %s"
                if execute_query(query, (new_location, new_rating, int(hotel_id)), fetch=False):
                    st.success("Hotel updated successfully!")
                    st.rerun()
    
    with tab2:
        st.subheader("Add New Hotel")
        with st.form("add_hotel_form"):
            hotel_name = st.text_input("Hotel Name")
            location = st.text_input("Location")
            rating = st.number_input("Rating", 0.0, 5.0, 4.0, 0.1)
            
            if st.form_submit_button("Add Hotel"):
                query = "INSERT INTO Hotel (hotel_name, location, rating) VALUES (%s, %s, %s)"
                if execute_query(query, (hotel_name, location, rating), fetch=False):
                    st.success(f"Hotel '{hotel_name}' added successfully!")
                    st.rerun()
    
    with tab3:
        st.subheader("Room Management")
        hotels = execute_query("SELECT hotel_id, hotel_name FROM Hotel")
        if hotels:
            hotel_names = {h['hotel_name']: h['hotel_id'] for h in hotels}
            selected_hotel = st.selectbox("Select Hotel for Room Management", list(hotel_names.keys()))
            hotel_id = hotel_names[selected_hotel]
            
            # Display rooms
            rooms = execute_query("SELECT * FROM Room WHERE hotel_id = %s", (hotel_id,))
            if rooms:
                st.dataframe(pd.DataFrame(rooms), use_container_width=True)
            
            # Add new room
            st.subheader("Add New Room")
            with st.form("add_room_form"):
                col1, col2, col3 = st.columns(3)
                with col1:
                    room_type = st.selectbox("Room Type", ["Standard", "Deluxe", "Suite", "Executive", "Luxury Suite"])
                with col2:
                    price = st.number_input("Price per Night (₹)", min_value=1000, value=3000, step=500)
                with col3:
                    status = st.selectbox("Status", ["Available", "Booked"])
                
                if st.form_submit_button("Add Room"):
                    query = "INSERT INTO Room (hotel_id, room_type, price_per_night, status) VALUES (%s, %s, %s, %s)"
                    if execute_query(query, (int(hotel_id), room_type, float(price), status), fetch=False):
                        st.success("Room added successfully!")
                        st.rerun()

# Guest Management
def guest_management():
    st.title("👥 Guest Management")
    
    tab1, tab2, tab3 = st.tabs(["View Guests", "Add Guest", "Guest Services"])
    
    with tab1:
        st.subheader("All Guests")
        guests = execute_query("SELECT * FROM Guest")
        if guests:
            df = pd.DataFrame(guests)
            st.dataframe(df, use_container_width=True)
            
            # Guest details
            st.subheader("Guest Details")
            selected_guest = st.selectbox("Select Guest", df['guest_name'].tolist())
            guest_id = int(df[df['guest_name'] == selected_guest]['guest_id'].values[0])
            
            # Show bookings
            bookings = execute_query("""
                SELECT b.booking_id, h.hotel_name, r.room_type, b.check_in, b.check_out
                FROM Booking b
                JOIN Room r ON b.room_id = r.room_id
                JOIN Hotel h ON r.hotel_id = h.hotel_id
                WHERE b.guest_id = %s
            """, (guest_id,))
            
            if bookings:
                st.write("**Booking History:**")
                st.dataframe(pd.DataFrame(bookings), use_container_width=True)
            
            # Show total payments
            total_payment = call_procedure('GetTotalPaymentByGuest', [int(guest_id)])
            if total_payment:
                st.metric("Total Payments", f"₹{total_payment[0].get('total_payment', 0):,.2f}")
            
            # Show service costs
            service_cost = execute_query("SELECT TotalServiceCost(%s) as cost", (int(guest_id),))
            if service_cost:
                st.metric("Total Service Cost", f"₹{service_cost[0]['cost']:,.2f}")
    
    with tab2:
        st.subheader("Add New Guest")
        with st.form("add_guest_form"):
            guest_name = st.text_input("Guest Name")
            col1, col2 = st.columns(2)
            with col1:
                phone = st.text_input("Phone")
                email = st.text_input("Email")
            with col2:
                address = st.text_area("Address")
            
            if st.form_submit_button("Add Guest"):
                query = "INSERT INTO Guest (guest_name, phone, email, address) VALUES (%s, %s, %s, %s)"
                if execute_query(query, (guest_name, phone, email, address), fetch=False):
                    st.success(f"Guest '{guest_name}' added successfully!")
                    st.rerun()
    
    with tab3:
        st.subheader("Guest Services")
        
        # Show all services
        services = execute_query("SELECT * FROM Service")
        if services:
            st.write("**Available Services:**")
            st.dataframe(pd.DataFrame(services), use_container_width=True)
        
        # Assign service to guest
        st.subheader("Assign Service to Guest")
        guests = execute_query("SELECT guest_id, guest_name FROM Guest")
        
        if guests and services:
            with st.form("assign_service_form"):
                guest_names = {g['guest_name']: g['guest_id'] for g in guests}
                service_names = {s['service_name']: s['service_id'] for s in services}
                
                selected_guest = st.selectbox("Select Guest", list(guest_names.keys()))
                selected_service = st.selectbox("Select Service", list(service_names.keys()))
                
                if st.form_submit_button("Assign Service"):
                    query = "INSERT INTO Guest_Service (guest_id, service_id) VALUES (%s, %s)"
                    if execute_query(query, (int(guest_names[selected_guest]), int(service_names[selected_service])), fetch=False):
                        st.success("Service assigned successfully!")
                        st.rerun()
        
        # View guest services
        st.subheader("Guest Service History")
        guest_services = execute_query("""
            SELECT g.guest_name, s.service_name, s.price
            FROM Guest_Service gs
            JOIN Guest g ON gs.guest_id = g.guest_id
            JOIN Service s ON gs.service_id = s.service_id
            ORDER BY g.guest_name
        """)
        
        if guest_services:
            st.dataframe(pd.DataFrame(guest_services), use_container_width=True)

# Booking Management
def booking_management():
    st.title("📅 Booking Management")
    
    tab1, tab2, tab3 = st.tabs(["View Bookings", "New Booking", "Check-Out"])
    
    with tab1:
        st.subheader("All Bookings")
        bookings = execute_query("""
            SELECT b.booking_id, g.guest_name, h.hotel_name, r.room_type, 
                   r.price_per_night, b.check_in, b.check_out,
                   DATEDIFF(b.check_out, b.check_in) as days,
                   (DATEDIFF(b.check_out, b.check_in) * r.price_per_night) as total_cost
            FROM Booking b
            JOIN Guest g ON b.guest_id = g.guest_id
            JOIN Room r ON b.room_id = r.room_id
            JOIN Hotel h ON r.hotel_id = h.hotel_id
            ORDER BY b.booking_id DESC
        """)
        
        if bookings:
            df = pd.DataFrame(bookings)
            st.dataframe(df, use_container_width=True)
            
            # Booking statistics
            col1, col2, col3 = st.columns(3)
            with col1:
                st.metric("Total Bookings", len(df))
            with col2:
                avg_stay = df['days'].mean()
                st.metric("Avg Stay Duration", f"{avg_stay:.1f} days")
            with col3:
                total_revenue = df['total_cost'].sum()
                st.metric("Total Revenue", f"₹{total_revenue:,.2f}")
    
    with tab2:
        st.subheader("Create New Booking")
        
        # Get guests and hotels
        guests = execute_query("SELECT guest_id, guest_name FROM Guest")
        hotels = execute_query("SELECT hotel_id, hotel_name FROM Hotel")
        
        if guests and hotels:
            guest_names = {g['guest_name']: g['guest_id'] for g in guests}
            hotel_names = {h['hotel_name']: h['hotel_id'] for h in hotels}
            
            # Select guest and hotel outside form first
            selected_guest = st.selectbox("Select Guest", list(guest_names.keys()), key="guest_select")
            selected_hotel = st.selectbox("Select Hotel", list(hotel_names.keys()), key="hotel_select")
            
            # Get available rooms for selected hotel
            available_rooms = call_procedure('GetAvailableRoomsByHotel', [int(hotel_names[selected_hotel])])
            
            if available_rooms:
                with st.form("booking_form"):
                    room_options = {f"{r['room_type']} - ₹{r['price_per_night']}/night": r['room_id'] 
                                   for r in available_rooms}
                    selected_room = st.selectbox("Select Room", list(room_options.keys()))
                    
                    col1, col2 = st.columns(2)
                    with col1:
                        check_in = st.date_input("Check-in Date", min_value=date.today())
                    with col2:
                        check_out = st.date_input("Check-out Date", 
                                                  value=check_in + timedelta(days=1),
                                                  min_value=check_in + timedelta(days=1))
                    
                    # Calculate cost
                    days = (check_out - check_in).days
                    room_price = float(selected_room.split('₹')[1].split('/')[0])
                    total_cost = days * room_price
                    
                    st.info(f"Total Cost: ₹{total_cost:,.2f} ({days} nights × ₹{room_price}/night)")
                    
                    if st.form_submit_button("Create Booking"):
                        try:
                            # Use stored procedure for booking
                            result = call_procedure('AddBooking', 
                                [int(guest_names[selected_guest]), int(room_options[selected_room]), 
                                 check_in.strftime('%Y-%m-%d'), check_out.strftime('%Y-%m-%d')])
                            # call_procedure returns None on any DB failure; only
                            # show success when the procedure actually succeeded.
                            if result is not None:
                                st.success("Booking created successfully!")
                                st.balloons()
                                st.rerun()
                            else:
                                st.error("Booking failed. Please check the error above and try again.")
                        except Exception as e:
                            st.error(f"Booking failed: {e}")
            else:
                st.warning(f"No available rooms in {selected_hotel}. Please check out some guests or select a different hotel.")
    
    with tab3:
        st.subheader("Check-Out Guest")
        
        # Get active bookings (where room is still booked)
        active_bookings = execute_query("""
            SELECT b.booking_id, g.guest_name, h.hotel_name, r.room_type, 
                   b.check_in, b.check_out, r.room_id
            FROM Booking b
            JOIN Guest g ON b.guest_id = g.guest_id
            JOIN Room r ON b.room_id = r.room_id
            JOIN Hotel h ON r.hotel_id = h.hotel_id
            WHERE r.status = 'Booked'
        """)
        
        if active_bookings:
            df = pd.DataFrame(active_bookings)
            st.dataframe(df[['booking_id', 'guest_name', 'hotel_name', 'room_type', 'check_in', 'check_out']], 
                        use_container_width=True)
            
            booking_id = st.number_input("Enter Booking ID to Check-Out", min_value=1, step=1)
            
            if st.button("Process Check-Out"):
                try:
                    checkout_result = call_procedure('CheckOutGuest', [int(booking_id)])
                    # call_procedure returns None on any DB failure; only
                    # show success when the procedure actually succeeded.
                    if checkout_result is not None:
                        st.success(f"Guest checked out successfully! Room is now available.")
                        st.rerun()
                    else:
                        st.error("Check-out failed. Please check the error above and try again.")
                except Exception as e:
                    st.error(f"Check-out failed: {e}")
        else:
            st.info("No active bookings to check out")

# Payment Management
def payment_management():
    st.title("💰 Payment Management")
    
    tab1, tab2 = st.tabs(["View Payments", "Add Payment"])
    
    with tab1:
        st.subheader("Payment History")
        payments = execute_query("""
            SELECT p.payment_id, g.guest_name, p.amount, p.payment_date, 
                   p.method, b.booking_id
            FROM Payment p
            JOIN Booking b ON p.booking_id = b.booking_id
            JOIN Guest g ON b.guest_id = g.guest_id
            ORDER BY p.payment_date DESC
        """)
        
        if payments:
            df = pd.DataFrame(payments)
            st.dataframe(df, use_container_width=True)
            
            # Payment statistics
            col1, col2, col3, col4 = st.columns(4)
            with col1:
                st.metric("Total Payments", len(df))
            with col2:
                total = df['amount'].sum()
                st.metric("Total Revenue", f"₹{total:,.2f}")
            with col3:
                avg_payment = df['amount'].mean()
                st.metric("Avg Payment", f"₹{avg_payment:,.2f}")
            with col4:
                most_used = df['method'].mode()[0] if not df['method'].mode().empty else "N/A"
                st.metric("Popular Method", most_used)
            
            # Payment method distribution
            st.subheader("Payment Method Distribution")
            method_counts = df['method'].value_counts()
            fig = px.pie(values=method_counts.values, names=method_counts.index, 
                        title="Payment Methods", hole=0.4)
            st.plotly_chart(fig, use_container_width=True)
            
            # Payment log
            st.subheader("Payment Logs")
            logs = execute_query("SELECT * FROM Payment_Log ORDER BY log_date DESC LIMIT 10")
            if logs:
                st.dataframe(pd.DataFrame(logs), use_container_width=True)
    
    with tab2:
        st.subheader("Add New Payment")
        
        # Get bookings without payments
        unpaid_bookings = execute_query("""
            SELECT b.booking_id, g.guest_name, h.hotel_name, r.room_type,
                   (DATEDIFF(b.check_out, b.check_in) * r.price_per_night) as amount
            FROM Booking b
            JOIN Guest g ON b.guest_id = g.guest_id
            JOIN Room r ON b.room_id = r.room_id
            JOIN Hotel h ON r.hotel_id = h.hotel_id
            LEFT JOIN Payment p ON b.booking_id = p.booking_id
            WHERE p.payment_id IS NULL
        """)
        
        if unpaid_bookings:
            df = pd.DataFrame(unpaid_bookings)
            st.dataframe(df, use_container_width=True)
            
            with st.form("payment_form"):
                booking_id = st.number_input("Booking ID", min_value=1, step=1)
                
                # Show booking amount if valid
                booking_info = df[df['booking_id'] == booking_id]
                if not booking_info.empty:
                    suggested_amount = float(booking_info['amount'].values[0])
                    st.info(f"Suggested amount for this booking: ₹{suggested_amount:,.2f}")
                else:
                    suggested_amount = 0.0
                
                col1, col2 = st.columns(2)
                with col1:
                    amount = st.number_input("Amount (₹)", min_value=0.0, value=float(suggested_amount), step=100.0)
                    method = st.selectbox("Payment Method", ["Cash", "Card", "UPI"])
                with col2:
                    payment_date = st.date_input("Payment Date", value=date.today())
                
                if st.form_submit_button("Process Payment"):
                    # Basic validation: booking must exist in the unpaid list and amount must not exceed suggested amount
                    if suggested_amount <= 0:
                        st.error("Invalid booking ID or booking has no due amount.")
                    elif float(amount) > float(suggested_amount):
                        st.error("Payment amount exceeds the total bill for this booking. Please enter a valid amount.")
                    else:
                        query = "INSERT INTO Payment (booking_id, amount, payment_date, method) VALUES (%s, %s, %s, %s)"
                        try:
                            if execute_query(query, (int(booking_id), float(amount), payment_date, method), fetch=False):
                                st.success(f"Payment of ₹{amount:,.2f} processed successfully!")
                                st.balloons()
                                st.rerun()
                        except Exception as e:
                            st.error(f"Payment failed: {e}")
        else:
            st.info("All bookings have been paid")

# Staff Management
def staff_management():
    st.title("👨‍💼 Staff Management")
    
    tab1, tab2 = st.tabs(["View Staff", "Add Staff"])
    
    with tab1:
        st.subheader("All Staff Members")
        staff = execute_query("""
            SELECT s.staff_id, s.staff_name, s.role, s.phone, h.hotel_name
            FROM Staff s
            JOIN Hotel h ON s.hotel_id = h.hotel_id
            ORDER BY h.hotel_name, s.role
        """)
        
        if staff:
            df = pd.DataFrame(staff)
            st.dataframe(df, use_container_width=True)
            
            # Staff statistics
            col1, col2 = st.columns(2)
            with col1:
                st.metric("Total Staff", len(df))
            with col2:
                roles = df['role'].nunique()
                st.metric("Different Roles", roles)
            
            # Staff by role
            st.subheader("Staff Distribution by Role")
            role_counts = df['role'].value_counts()
            fig = px.bar(x=role_counts.index, y=role_counts.values,
                        labels={'x': 'Role', 'y': 'Count'},
                        title="Staff by Role")
            st.plotly_chart(fig, use_container_width=True)
    
    with tab2:
        st.subheader("Add New Staff Member")
        
        hotels = execute_query("SELECT hotel_id, hotel_name FROM Hotel")
        
        if hotels:
            with st.form("staff_form"):
                hotel_names = {h['hotel_name']: h['hotel_id'] for h in hotels}
                selected_hotel = st.selectbox("Select Hotel", list(hotel_names.keys()))
                
                staff_name = st.text_input("Staff Name")
                role = st.selectbox("Role", ["Manager", "Receptionist", "Chef", "Housekeeping", 
                                            "Waiter", "Security", "Maintenance"])
                phone = st.text_input("Phone Number")
                
                if st.form_submit_button("Add Staff"):
                    query = "INSERT INTO Staff (hotel_id, staff_name, role, phone) VALUES (%s, %s, %s, %s)"
                    if execute_query(query, (int(hotel_names[selected_hotel]), staff_name, role, phone), fetch=False):
                        st.success(f"Staff member '{staff_name}' added successfully!")
                        st.rerun()

# Restaurant Orders
def restaurant_orders():
    st.title("🍽️ Restaurant Orders")
    
    tab1, tab2 = st.tabs(["View Orders", "Add Order"])
    
    with tab1:
        st.subheader("All Restaurant Orders")
        orders = execute_query("""
            SELECT r.order_id, g.guest_name, r.order_date, r.total_amount
            FROM RestaurantOrder r
            JOIN Guest g ON r.guest_id = g.guest_id
            ORDER BY r.order_date DESC
        """)
        
        if orders:
            df = pd.DataFrame(orders)
            st.dataframe(df, use_container_width=True)
            
            # Order statistics
            col1, col2, col3 = st.columns(3)
            with col1:
                st.metric("Total Orders", len(df))
            with col2:
                total = df['total_amount'].sum()
                st.metric("Total Revenue", f"₹{total:,.2f}")
            with col3:
                avg = df['total_amount'].mean()
                st.metric("Avg Order Value", f"₹{avg:,.2f}")
    
    with tab2:
        st.subheader("Add New Restaurant Order")
        
        guests = execute_query("SELECT guest_id, guest_name FROM Guest")
        
        if guests:
            with st.form("order_form"):
                guest_names = {g['guest_name']: g['guest_id'] for g in guests}
                selected_guest = st.selectbox("Select Guest", list(guest_names.keys()))
                
                order_date = st.date_input("Order Date", value=date.today())
                total_amount = st.number_input("Total Amount (₹)", min_value=0.0, value=500.0, step=50.0)
                
                if st.form_submit_button("Add Order"):
                    query = "INSERT INTO RestaurantOrder (guest_id, order_date, total_amount) VALUES (%s, %s, %s)"
                    if execute_query(query, (int(guest_names[selected_guest]), order_date, float(total_amount)), fetch=False):
                        st.success("Order added successfully!")
                        st.rerun()

# Feedback Management
def feedback_management():
    st.title("⭐ Feedback Management")
    
    tab1, tab2 = st.tabs(["View Feedback", "Add Feedback"])
    
    with tab1:
        st.subheader("All Feedback")
        feedback = execute_query("""
            SELECT f.feedback_id, g.guest_name, h.hotel_name, f.rating, 
                   f.comments, b.check_in, b.check_out
            FROM Feedback f
            JOIN Booking b ON f.booking_id = b.booking_id
            JOIN Guest g ON b.guest_id = g.guest_id
            JOIN Room r ON b.room_id = r.room_id
            JOIN Hotel h ON r.hotel_id = h.hotel_id
            ORDER BY f.feedback_id DESC
        """)
        
        if feedback:
            df = pd.DataFrame(feedback)
            
            # Display feedback cards
            for _, row in df.iterrows():
                with st.container():
                    st.markdown(f"""
                        <div class='hotel-card'>
                            <h4>{row['guest_name']} - {row['hotel_name']}</h4>
                            <p>⭐ Rating: {row['rating']}/5</p>
                            <p>💬 {row['comments']}</p>
                            <small>Stay: {row['check_in']} to {row['check_out']}</small>
                        </div>
                    """, unsafe_allow_html=True)
            
            # Feedback statistics
            st.markdown("---")
            st.subheader("Feedback Statistics")
            
            # Average Rating - Centered
            avg_rating = df['rating'].mean()
            col_spacer1, col_metric, col_spacer2 = st.columns([1, 2, 1])
            with col_metric:
                st.markdown(f"""
                    <div style='text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                         border-radius: 10px; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.2);'>
                        <h3 style='color: white; margin: 0;'>Average Rating</h3>
                        <h1 style='color: white; margin: 10px 0; font-size: 3em;'>{avg_rating:.2f} ⭐</h1>
                    </div>
                """, unsafe_allow_html=True)
            
            st.markdown("<br>", unsafe_allow_html=True)
            
            # Charts in columns
            col1, col2 = st.columns(2)
            
            with col1:
                rating_dist = df['rating'].value_counts().sort_index()
                
                # Create gradient colors for each rating
                colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#10ac84']
                bar_colors = [colors[int(rating)-1] if int(rating) <= 5 else '#667eea' 
                             for rating in rating_dist.index]
                
                fig = go.Figure(data=[go.Bar(
                    x=rating_dist.index,
                    y=rating_dist.values,
                    marker=dict(
                        color=bar_colors,
                        line=dict(color='#2c3e50', width=2)
                    ),
                    text=rating_dist.values,
                    textposition='outside',
                    textfont=dict(size=16, color='#2c3e50', family='Arial Black')
                )])
                
                fig.update_layout(
                    title={
                        'text': "Rating Distribution",
                        'font': {'size': 20, 'color': '#2c3e50', 'family': 'Arial Black'}
                    },
                    xaxis_title="Rating",
                    yaxis_title="Count",
                    plot_bgcolor='white',
                    paper_bgcolor='white',
                    font=dict(size=14, color='#2c3e50', family='Arial'),
                    xaxis=dict(gridcolor='#e0e0e0', showgrid=True, tickfont=dict(size=14, color='#2c3e50')),
                    yaxis=dict(gridcolor='#e0e0e0', showgrid=True, tickfont=dict(size=14, color='#2c3e50')),
                    showlegend=False
                )
                st.plotly_chart(fig, use_container_width=True)
            
            with col2:
                # Rating by hotel
                hotel_ratings = execute_query("""
                    SELECT h.hotel_name, AVG(f.rating) as avg_rating
                    FROM Feedback f
                    JOIN Booking b ON f.booking_id = b.booking_id
                    JOIN Room r ON b.room_id = r.room_id
                    JOIN Hotel h ON r.hotel_id = h.hotel_id
                    GROUP BY h.hotel_name
                    ORDER BY avg_rating DESC
                """)
                
                if hotel_ratings:
                    df_hr = pd.DataFrame(hotel_ratings)
                    
                    # Create gradient colors based on rating (higher rating = better color)
                    gradient_colors = ['#10ac84', '#1dd1a1', '#48dbfb', '#feca57', '#ff6b6b']
                    bar_colors = []
                    for rating in df_hr['avg_rating']:
                        if rating >= 4.5:
                            bar_colors.append('#10ac84')  # Excellent - Green
                        elif rating >= 4.0:
                            bar_colors.append('#1dd1a1')  # Very Good - Light Green
                        elif rating >= 3.5:
                            bar_colors.append('#48dbfb')  # Good - Blue
                        elif rating >= 3.0:
                            bar_colors.append('#feca57')  # Fair - Yellow
                        else:
                            bar_colors.append('#ff6b6b')  # Poor - Red
                    
                    fig = go.Figure(data=[go.Bar(
                        x=df_hr['hotel_name'],
                        y=df_hr['avg_rating'],
                        marker=dict(
                            color=bar_colors,
                            line=dict(color='#2c3e50', width=2)
                        ),
                        text=[f"{rating:.2f} ⭐" for rating in df_hr['avg_rating']],
                        textposition='outside',
                        textfont=dict(size=16, color='#2c3e50', family='Arial Black')
                    )])
                    
                    fig.update_layout(
                        title={
                            'text': "Average Rating by Hotel",
                            'font': {'size': 20, 'color': '#2c3e50', 'family': 'Arial Black'}
                        },
                        xaxis_title="Hotel",
                        yaxis_title="Avg Rating",
                        plot_bgcolor='white',
                        paper_bgcolor='white',
                        font=dict(size=14, color='#2c3e50', family='Arial'),
                        xaxis=dict(gridcolor='#e0e0e0', showgrid=True, tickfont=dict(size=14, color='#2c3e50')),
                        yaxis=dict(gridcolor='#e0e0e0', showgrid=True, range=[0, 5.5], tickfont=dict(size=14, color='#2c3e50')),
                        showlegend=False
                    )
                    st.plotly_chart(fig, use_container_width=True)
    
    with tab2:
        st.subheader("Add New Feedback")
        
        # Get completed bookings
        bookings = execute_query("""
            SELECT b.booking_id, g.guest_name, h.hotel_name, r.room_type
            FROM Booking b
            JOIN Guest g ON b.guest_id = g.guest_id
            JOIN Room r ON b.room_id = r.room_id
            JOIN Hotel h ON r.hotel_id = h.hotel_id
            LEFT JOIN Feedback f ON b.booking_id = f.booking_id
            WHERE f.feedback_id IS NULL
        """)
        
        if bookings:
            df = pd.DataFrame(bookings)
            st.dataframe(df, use_container_width=True)
            
            with st.form("feedback_form"):
                booking_id = st.number_input("Booking ID", min_value=1, step=1)
                rating = st.slider("Rating", 1, 5, 5)
                comments = st.text_area("Comments")
                
                if st.form_submit_button("Submit Feedback"):
                    query = "INSERT INTO Feedback (booking_id, rating, comments) VALUES (%s, %s, %s)"
                    if execute_query(query, (int(booking_id), int(rating), comments), fetch=False):
                        st.success("Feedback submitted successfully! Hotel rating will be updated automatically.")
                        st.rerun()
        else:
            st.info("All bookings have feedback")

# Analytics Dashboard
def analytics_dashboard():
    st.title("📊 Analytics Dashboard")
    
    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    
    metrics = {
        'hotels': execute_query("SELECT COUNT(*) as count FROM Hotel"),
        'guests': execute_query("SELECT COUNT(*) as count FROM Guest"),
        'bookings': execute_query("SELECT COUNT(*) as count FROM Booking"),
        'revenue': execute_query("SELECT SUM(amount) as total FROM Payment")
    }
    
    with col1:
        st.metric("Hotels", metrics['hotels'][0]['count'] if metrics['hotels'] else 0)
    with col2:
        st.metric("Guests", metrics['guests'][0]['count'] if metrics['guests'] else 0)
    with col3:
        st.metric("Bookings", metrics['bookings'][0]['count'] if metrics['bookings'] else 0)
    with col4:
        revenue = metrics['revenue'][0]['total'] if metrics['revenue'] and metrics['revenue'][0]['total'] else 0
        st.metric("Revenue", f"₹{revenue:,.2f}")
    
    # Revenue trends
    st.subheader("Revenue Trends")
    revenue_data = execute_query("""
        SELECT payment_date, SUM(amount) as daily_revenue
        FROM Payment
        GROUP BY payment_date
        ORDER BY payment_date
    """)
    
    if revenue_data:
        df = pd.DataFrame(revenue_data)
        fig = px.line(df, x='payment_date', y='daily_revenue',
                     labels={'payment_date': 'Date', 'daily_revenue': 'Revenue (₹)'},
                     title='Daily Revenue Trend')
        st.plotly_chart(fig, use_container_width=True)
    
    # Room occupancy
    st.subheader("Room Status Distribution")
    room_status = execute_query("""
        SELECT status, COUNT(*) as count
        FROM Room
        GROUP BY status
    """)
    
    if room_status:
        df = pd.DataFrame(room_status)
        fig = px.pie(df, values='count', names='status', 
                    title='Room Occupancy Status',
                    color_discrete_sequence=['#667eea', '#764ba2'])
        st.plotly_chart(fig, use_container_width=True)
    
    # Top performing hotels
    st.subheader("Top Performing Hotels")
    top_hotels = execute_query("""
        SELECT h.hotel_name, COUNT(b.booking_id) as bookings, 
               SUM(p.amount) as revenue, AVG(f.rating) as avg_rating
        FROM Hotel h
        LEFT JOIN Room r ON h.hotel_id = r.hotel_id
        LEFT JOIN Booking b ON r.room_id = b.room_id
        LEFT JOIN Payment p ON b.booking_id = p.booking_id
        LEFT JOIN Feedback f ON b.booking_id = f.booking_id
        GROUP BY h.hotel_id, h.hotel_name
        ORDER BY revenue DESC
    """)
    
    if top_hotels:
        df = pd.DataFrame(top_hotels)
        st.dataframe(df, use_container_width=True)
    
    # Service popularity
    st.subheader("Popular Services")
    service_data = execute_query("""
        SELECT s.service_name, COUNT(gs.guest_id) as usage_count, s.price
        FROM Service s
        LEFT JOIN Guest_Service gs ON s.service_id = gs.service_id
        GROUP BY s.service_id, s.service_name, s.price
        ORDER BY usage_count DESC
    """)
    
    if service_data:
        df = pd.DataFrame(service_data)
        fig = px.bar(df, x='service_name', y='usage_count',
                    labels={'service_name': 'Service', 'usage_count': 'Usage Count'},
                    title='Service Usage Statistics',
                    color='usage_count',
                    color_continuous_scale='Viridis')
        st.plotly_chart(fig, use_container_width=True)

# Service Management
def service_management():
    st.title("🛎️ Service Management")
    
    tab1, tab2 = st.tabs(["View Services", "Add Service"])
    
    with tab1:
        st.subheader("All Services")
        services = execute_query("SELECT * FROM Service")
        
        if services:
            df = pd.DataFrame(services)
            st.dataframe(df, use_container_width=True)
            
            # Service usage
            st.subheader("Service Usage Statistics")
            usage = execute_query("""
                SELECT s.service_name, COUNT(gs.guest_id) as usage_count, 
                       s.price, (COUNT(gs.guest_id) * s.price) as revenue
                FROM Service s
                LEFT JOIN Guest_Service gs ON s.service_id = gs.service_id
                GROUP BY s.service_id, s.service_name, s.price
                ORDER BY usage_count DESC
            """)
            
            if usage:
                df_usage = pd.DataFrame(usage)
                st.dataframe(df_usage, use_container_width=True)
    
    with tab2:
        st.subheader("Add New Service")
        
        with st.form("service_form"):
            service_name = st.text_input("Service Name")
            price = st.number_input("Price (₹)", min_value=0.0, value=500.0, step=100.0)
            
            if st.form_submit_button("Add Service"):
                query = "INSERT INTO Service (service_name, price) VALUES (%s, %s)"
                if execute_query(query, (service_name, float(price)), fetch=False):
                    st.success(f"Service '{service_name}' added successfully!")
                    st.rerun()

# Main app
def main():
    load_css()
    
    # Sidebar navigation
    st.sidebar.title("🏨 Hotel Management")
    st.sidebar.markdown("---")
    
    menu_options = {
        "🏠 Home": home_page,
        "🏨 Hotels": hotel_management,
        "👥 Guests": guest_management,
        "📅 Bookings": booking_management,
        "💰 Payments": payment_management,
        "👨‍💼 Staff": staff_management,
        "🍽️ Restaurant": restaurant_orders,
        "🛎️ Services": service_management,
        "⭐ Feedback": feedback_management,
        "📊 Analytics": analytics_dashboard
    }
    
    choice = st.sidebar.radio("Navigation", list(menu_options.keys()))
    
    st.sidebar.markdown("---")
    st.sidebar.info("""
        **Hotel Management System**
        
        Complete solution for managing:
        - Hotels & Rooms
        - Guest Information
        - Bookings & Check-ins
        - Payments & Billing
        - Staff Management
        - Services & Restaurant
        - Feedback & Reviews
        - Analytics & Reports
    """)
    
    # Run selected page
    menu_options[choice]()

if __name__ == "__main__":
    main()
