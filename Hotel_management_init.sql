-- Hotel Management System - Safe Database Initialization Script
-- This script creates the database and tables only if they don't exist
-- Safe to run multiple times - will NOT destroy existing data

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS Hotel_Management;
USE Hotel_Management;

-- Create tables (safe - will skip if they exist)
CREATE TABLE IF NOT EXISTS Hotel (
    hotel_id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    rating DECIMAL(2,1)
);

CREATE TABLE IF NOT EXISTS Staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT,
    staff_name VARCHAR(100),
    role VARCHAR(50),
    phone VARCHAR(15),
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Room (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT,
    room_type VARCHAR(50),
    price_per_night DECIMAL(10,2),
    status ENUM('Available','Booked') DEFAULT 'Available',
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Guest (
    guest_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(100),
    address VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS Booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT,
    room_id INT,
    check_in DATE,
    check_out DATE,
    FOREIGN KEY (guest_id) REFERENCES Guest(guest_id),
    FOREIGN KEY (room_id) REFERENCES Room(room_id)
);

CREATE TABLE IF NOT EXISTS Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    amount DECIMAL(10,2),
    payment_date DATE,
    method ENUM('Cash','Card','UPI'),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);

CREATE TABLE IF NOT EXISTS Service (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100),
    price DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS Guest_Service (
    guest_id INT,
    service_id INT,
    PRIMARY KEY (guest_id, service_id),
    FOREIGN KEY (guest_id) REFERENCES Guest(guest_id),
    FOREIGN KEY (service_id) REFERENCES Service(service_id)
);

CREATE TABLE IF NOT EXISTS RestaurantOrder (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT,
    order_date DATE,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (guest_id) REFERENCES Guest(guest_id)
);

CREATE TABLE IF NOT EXISTS Feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);

CREATE TABLE IF NOT EXISTS Payment_Log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    log_message VARCHAR(255),
    log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data only if tables are empty
-- This prevents duplicate data on re-runs

INSERT INTO Hotel (hotel_name, location, rating)
SELECT * FROM (SELECT 'Taj Hotel' AS hotel_name, 'Mumbai' AS location, 4.8 AS rating) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Hotel WHERE hotel_name = 'Taj Hotel') LIMIT 1;

INSERT INTO Hotel (hotel_name, location, rating)
SELECT * FROM (SELECT 'Oberoi', 'Delhi', 4.6) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Hotel WHERE hotel_name = 'Oberoi') LIMIT 1;

INSERT INTO Hotel (hotel_name, location, rating)
SELECT * FROM (SELECT 'Leela Palace', 'Bangalore', 4.7) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Hotel WHERE hotel_name = 'Leela Palace') LIMIT 1;

INSERT INTO Hotel (hotel_name, location, rating)
SELECT * FROM (SELECT 'Hyatt Regency', 'Chennai', 4.5) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Hotel WHERE hotel_name = 'Hyatt Regency') LIMIT 1;

INSERT INTO Hotel (hotel_name, location, rating)
SELECT * FROM (SELECT 'ITC Maratha', 'Pune', 4.4) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Hotel WHERE hotel_name = 'ITC Maratha') LIMIT 1;

-- Insert sample staff
INSERT INTO Staff (hotel_id, staff_name, role, phone)
SELECT * FROM (SELECT 1 AS hotel_id, 'Amit Verma' AS staff_name, 'Manager' AS role, '9876543210' AS phone) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Staff WHERE staff_name = 'Amit Verma' AND hotel_id = 1) LIMIT 1;

INSERT INTO Staff (hotel_id, staff_name, role, phone)
SELECT * FROM (SELECT 1, 'Sita Rao', 'Receptionist', '9876501234') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Staff WHERE staff_name = 'Sita Rao') LIMIT 1;

INSERT INTO Staff (hotel_id, staff_name, role, phone)
SELECT * FROM (SELECT 2, 'Raj Mehta', 'Chef', '9876512345') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Staff WHERE staff_name = 'Raj Mehta') LIMIT 1;

INSERT INTO Staff (hotel_id, staff_name, role, phone)
SELECT * FROM (SELECT 3, 'Anjali Nair', 'Housekeeping', '9876523456') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Staff WHERE staff_name = 'Anjali Nair') LIMIT 1;

INSERT INTO Staff (hotel_id, staff_name, role, phone)
SELECT * FROM (SELECT 4, 'Rohit Sharma', 'Receptionist', '9876534567') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Staff WHERE staff_name = 'Rohit Sharma') LIMIT 1;

-- Insert sample rooms
INSERT INTO Room (hotel_id, room_type, price_per_night, status)
SELECT * FROM (SELECT 1 AS hotel_id, 'Deluxe' AS room_type, 5000.00 AS price_per_night, 'Available' AS status) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Room WHERE hotel_id = 1 AND room_type = 'Deluxe') LIMIT 1;

INSERT INTO Room (hotel_id, room_type, price_per_night, status)
SELECT * FROM (SELECT 1, 'Suite', 8000.00, 'Available') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Room WHERE hotel_id = 1 AND room_type = 'Suite') LIMIT 1;

INSERT INTO Room (hotel_id, room_type, price_per_night, status)
SELECT * FROM (SELECT 2, 'Standard', 3000.00, 'Available') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Room WHERE hotel_id = 2 AND room_type = 'Standard') LIMIT 1;

INSERT INTO Room (hotel_id, room_type, price_per_night, status)
SELECT * FROM (SELECT 3, 'Luxury Suite', 10000.00, 'Available') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Room WHERE hotel_id = 3 AND room_type = 'Luxury Suite') LIMIT 1;

INSERT INTO Room (hotel_id, room_type, price_per_night, status)
SELECT * FROM (SELECT 4, 'Executive', 6000.00, 'Available') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Room WHERE hotel_id = 4 AND room_type = 'Executive') LIMIT 1;

-- Insert sample guests
INSERT INTO Guest (guest_name, phone, email, address)
SELECT * FROM (SELECT 'Rahul Sharma' AS guest_name, '9876543210' AS phone, 'rahul@gmail.com' AS email, 'Delhi' AS address) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Guest WHERE email = 'rahul@gmail.com') LIMIT 1;

INSERT INTO Guest (guest_name, phone, email, address)
SELECT * FROM (SELECT 'Ananya Singh', '9876501234', 'ananya@gmail.com', 'Mumbai') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Guest WHERE email = 'ananya@gmail.com') LIMIT 1;

INSERT INTO Guest (guest_name, phone, email, address)
SELECT * FROM (SELECT 'Arjun Mehta', '9876512345', 'arjun@gmail.com', 'Bangalore') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Guest WHERE email = 'arjun@gmail.com') LIMIT 1;

INSERT INTO Guest (guest_name, phone, email, address)
SELECT * FROM (SELECT 'Sneha Kapoor', '9456789123', 'sneha@gmail.com', 'Hyderabad') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Guest WHERE email = 'sneha@gmail.com') LIMIT 1;

INSERT INTO Guest (guest_name, phone, email, address)
SELECT * FROM (SELECT 'Vikram Jain', '9876540987', 'vikram@gmail.com', 'Chennai') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Guest WHERE email = 'vikram@gmail.com') LIMIT 1;

-- Insert sample services
INSERT INTO Service (service_name, price)
SELECT * FROM (SELECT 'Spa' AS service_name, 2000.00 AS price) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Service WHERE service_name = 'Spa') LIMIT 1;

INSERT INTO Service (service_name, price)
SELECT * FROM (SELECT 'Laundry', 500.00) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Service WHERE service_name = 'Laundry') LIMIT 1;

INSERT INTO Service (service_name, price)
SELECT * FROM (SELECT 'Airport Pickup', 1500.00) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Service WHERE service_name = 'Airport Pickup') LIMIT 1;

INSERT INTO Service (service_name, price)
SELECT * FROM (SELECT 'Room Service', 1000.00) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Service WHERE service_name = 'Room Service') LIMIT 1;

INSERT INTO Service (service_name, price)
SELECT * FROM (SELECT 'Gym Access', 800.00) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Service WHERE service_name = 'Gym Access') LIMIT 1;

-- Create triggers (drop and recreate to handle re-runs)
DELIMITER $$

DROP TRIGGER IF EXISTS after_booking_insert$$
CREATE TRIGGER after_booking_insert
AFTER INSERT ON Booking
FOR EACH ROW
BEGIN
    UPDATE Room
    SET status = 'Booked'
    WHERE room_id = NEW.room_id;
END$$

DROP TRIGGER IF EXISTS before_payment_insert$$
CREATE TRIGGER before_payment_insert
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    DECLARE total_bill DECIMAL(10,2);
    DECLARE paid_so_far DECIMAL(10,2);

    -- Compute expected total for the booking (room nights * price)
    SELECT (DATEDIFF(b.check_out, b.check_in) * r.price_per_night)
    INTO total_bill
    FROM Booking b
    JOIN Room r ON b.room_id = r.room_id
    WHERE b.booking_id = NEW.booking_id;

    -- Sum of payments already made for this booking
    SELECT IFNULL(SUM(amount), 0) INTO paid_so_far 
    FROM Payment 
    WHERE booking_id = NEW.booking_id;

    -- If paying more than remaining due, reject the insert
    IF (paid_so_far + NEW.amount) > total_bill THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Payment exceeds the total bill for this booking. Payment rejected.';
    END IF;
END$$

DROP TRIGGER IF EXISTS after_payment_insert$$
CREATE TRIGGER after_payment_insert
AFTER INSERT ON Payment
FOR EACH ROW
BEGIN
    INSERT INTO Payment_Log (booking_id, log_message)
    VALUES (NEW.booking_id, CONCAT('Payment of Rs.', NEW.amount, ' received via ', NEW.method));
END$$

DROP TRIGGER IF EXISTS update_hotel_rating$$
CREATE TRIGGER update_hotel_rating
AFTER INSERT ON Feedback
FOR EACH ROW
BEGIN
    DECLARE hotel_id_var INT;
    
    -- Get hotel_id for the booking
    SELECT r.hotel_id INTO hotel_id_var
    FROM Booking b
    JOIN Room r ON b.room_id = r.room_id
    WHERE b.booking_id = NEW.booking_id;
    
    -- Update hotel rating with average of all feedback
    UPDATE Hotel h
    SET h.rating = (
        SELECT ROUND(AVG(f.rating), 1)
        FROM Feedback f
        JOIN Booking b ON f.booking_id = b.booking_id
        JOIN Room r ON b.room_id = r.room_id
        WHERE r.hotel_id = hotel_id_var
    )
    WHERE h.hotel_id = hotel_id_var;
END$$

DELIMITER ;

-- Create stored procedures
DELIMITER $$

DROP PROCEDURE IF EXISTS GetTotalPaymentByGuest$$
CREATE PROCEDURE GetTotalPaymentByGuest(IN guestId INT)
BEGIN
    SELECT g.guest_name, IFNULL(SUM(p.amount), 0) AS total_payment
    FROM Guest g
    LEFT JOIN Booking b ON g.guest_id = b.guest_id
    LEFT JOIN Payment p ON b.booking_id = p.booking_id
    WHERE g.guest_id = guestId
    GROUP BY g.guest_name;
END$$

DROP PROCEDURE IF EXISTS GetAvailableRoomsByHotel$$
CREATE PROCEDURE GetAvailableRoomsByHotel(IN hid INT)
BEGIN
    SELECT room_id, room_type, price_per_night
    FROM Room
    WHERE hotel_id = hid AND status = 'Available';
END$$

DROP PROCEDURE IF EXISTS AddBooking$$
CREATE PROCEDURE AddBooking(
    IN guestId INT,
    IN roomId INT,
    IN checkIn DATE,
    IN checkOut DATE
)
BEGIN
    DECLARE roomStatus VARCHAR(20);

    -- Check if room is available
    SELECT status INTO roomStatus FROM Room WHERE room_id = roomId;

    IF roomStatus = 'Booked' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Room is already booked!';
    ELSE
        -- Insert booking
        INSERT INTO Booking (guest_id, room_id, check_in, check_out)
        VALUES (guestId, roomId, checkIn, checkOut);

        -- Status will be updated by trigger
    END IF;
END$$

DROP PROCEDURE IF EXISTS CheckOutGuest$$
CREATE PROCEDURE CheckOutGuest(IN bookingId INT)
BEGIN
    DECLARE rid INT;
    SELECT room_id INTO rid FROM Booking WHERE booking_id = bookingId;
    UPDATE Room SET status = 'Available' WHERE room_id = rid;
END$$

DELIMITER ;

-- Create functions
DELIMITER $$

DROP FUNCTION IF EXISTS StayDuration$$
CREATE FUNCTION StayDuration(bid INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE duration INT;
    SELECT DATEDIFF(check_out, check_in)
    INTO duration
    FROM Booking
    WHERE booking_id = bid;
    RETURN IFNULL(duration, 0);
END$$

DROP FUNCTION IF EXISTS TotalServiceCost$$
CREATE FUNCTION TotalServiceCost(gid INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE total DECIMAL(10,2);
    SELECT SUM(s.price)
    INTO total
    FROM Guest_Service gs
    JOIN Service s ON gs.service_id = s.service_id
    WHERE gs.guest_id = gid;
    RETURN IFNULL(total, 0);
END$$

DROP FUNCTION IF EXISTS TotalBill$$
CREATE FUNCTION TotalBill(bid INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE total DECIMAL(10,2);
    SELECT p.amount INTO total
    FROM Payment p
    WHERE p.booking_id = bid;
    RETURN IFNULL(total, 0);
END$$

DELIMITER ;

-- Display success message
SELECT 'Database initialization completed successfully!' AS Status;
SELECT 'All tables, triggers, procedures, and functions are ready.' AS Message;
