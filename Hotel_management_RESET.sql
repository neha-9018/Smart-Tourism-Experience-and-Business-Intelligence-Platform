-- ⚠️⚠️⚠️ WARNING: DESTRUCTIVE DATABASE RESET SCRIPT ⚠️⚠️⚠️
-- 
-- THIS SCRIPT WILL DELETE ALL DATA IN THE HOTEL MANAGEMENT DATABASE!
-- 
-- Use this ONLY for development/testing when you want to start fresh.
-- DO NOT run this on a database with production or important data.
-- 
-- To use this script:
-- 1. Make absolutely sure you want to delete all data
-- 2. Back up your database if needed: mysqldump -u root -p Hotel_Management > backup.sql
-- 3. Run: mysql -u root -p < Hotel_management_RESET.sql
-- 
-- ⚠️⚠️⚠️ THIS ACTION CANNOT BE UNDONE ⚠️⚠️⚠️

-- Drop database if it exists (removes everything)
DROP DATABASE IF EXISTS Hotel_Management;

-- Create fresh database
CREATE DATABASE Hotel_Management;
USE Hotel_Management;

-- Create all tables
CREATE TABLE Hotel (
    hotel_id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    rating DECIMAL(2,1)
);

CREATE TABLE Staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT,
    staff_name VARCHAR(100),
    role VARCHAR(50),
    phone VARCHAR(15),
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id)
        ON DELETE CASCADE
);

CREATE TABLE Room (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT,
    room_type VARCHAR(50),
    price_per_night DECIMAL(10,2),
    status ENUM('Available','Booked') DEFAULT 'Available',
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id)
        ON DELETE CASCADE
);

CREATE TABLE Guest (
    guest_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(100),
    address VARCHAR(200)
);

CREATE TABLE Booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT,
    room_id INT,
    check_in DATE,
    check_out DATE,
    FOREIGN KEY (guest_id) REFERENCES Guest(guest_id),
    FOREIGN KEY (room_id) REFERENCES Room(room_id)
);

CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    amount DECIMAL(10,2),
    payment_date DATE,
    method ENUM('Cash','Card','UPI'),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);

CREATE TABLE Service (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100),
    price DECIMAL(10,2)
);

CREATE TABLE Guest_Service (
    guest_id INT,
    service_id INT,
    PRIMARY KEY (guest_id, service_id),
    FOREIGN KEY (guest_id) REFERENCES Guest(guest_id),
    FOREIGN KEY (service_id) REFERENCES Service(service_id)
);

CREATE TABLE RestaurantOrder (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT,
    order_date DATE,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (guest_id) REFERENCES Guest(guest_id)
);

CREATE TABLE Feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);

CREATE TABLE Payment_Log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    log_message VARCHAR(255),
    log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data with updated dates (using CURDATE() for current dates)
INSERT INTO Hotel (hotel_name, location, rating) VALUES
('Taj Hotel', 'Mumbai', 4.8),
('Oberoi', 'Delhi', 4.6),
('Leela Palace', 'Bangalore', 4.7),
('Hyatt Regency', 'Chennai', 4.5),
('ITC Maratha', 'Pune', 4.4);

INSERT INTO Staff (hotel_id, staff_name, role, phone) VALUES
(1, 'Amit Verma', 'Manager', '9876543210'),
(1, 'Sita Rao', 'Receptionist', '9876501234'),
(2, 'Raj Mehta', 'Chef', '9876512345'),
(3, 'Anjali Nair', 'Housekeeping', '9876523456'),
(4, 'Rohit Sharma', 'Receptionist', '9876534567');

INSERT INTO Room (hotel_id, room_type, price_per_night, status) VALUES
(1, 'Deluxe', 5000, 'Available'),
(1, 'Suite', 8000, 'Available'),
(2, 'Standard', 3000, 'Available'),
(3, 'Luxury Suite', 10000, 'Available'),
(4, 'Executive', 6000, 'Available');

INSERT INTO Guest (guest_name, phone, email, address) VALUES
('Rahul Sharma', '9876543210', 'rahul@gmail.com', 'Delhi'),
('Ananya Singh', '9876501234', 'ananya@gmail.com', 'Mumbai'),
('Arjun Mehta', '9876512345', 'arjun@gmail.com', 'Bangalore'),
('Sneha Kapoor', '9456789123', 'sneha@gmail.com', 'Hyderabad'),
('Vikram Jain', '9876540987', 'vikram@gmail.com', 'Chennai');

-- Note: No initial bookings, payments, or feedback to avoid date conflicts
-- Users can create these through the application

INSERT INTO Service (service_name, price) VALUES
('Spa', 2000),
('Laundry', 500),
('Airport Pickup', 1500),
('Room Service', 1000),
('Gym Access', 800);

-- Create triggers
DELIMITER $$

CREATE TRIGGER after_booking_insert
AFTER INSERT ON Booking
FOR EACH ROW
BEGIN
    UPDATE Room
    SET status = 'Booked'
    WHERE room_id = NEW.room_id;
END$$

CREATE TRIGGER before_payment_insert
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    DECLARE total_bill DECIMAL(10,2);
    DECLARE paid_so_far DECIMAL(10,2);

    SELECT (DATEDIFF(b.check_out, b.check_in) * r.price_per_night)
    INTO total_bill
    FROM Booking b
    JOIN Room r ON b.room_id = r.room_id
    WHERE b.booking_id = NEW.booking_id;

    SELECT IFNULL(SUM(amount), 0) INTO paid_so_far 
    FROM Payment 
    WHERE booking_id = NEW.booking_id;

    IF (paid_so_far + NEW.amount) > total_bill THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Payment exceeds the total bill for this booking. Payment rejected.';
    END IF;
END$$

CREATE TRIGGER after_payment_insert
AFTER INSERT ON Payment
FOR EACH ROW
BEGIN
    INSERT INTO Payment_Log (booking_id, log_message)
    VALUES (NEW.booking_id, CONCAT('Payment of Rs.', NEW.amount, ' received via ', NEW.method));
END$$

CREATE TRIGGER update_hotel_rating
AFTER INSERT ON Feedback
FOR EACH ROW
BEGIN
    DECLARE hotel_id_var INT;
    
    SELECT r.hotel_id INTO hotel_id_var
    FROM Booking b
    JOIN Room r ON b.room_id = r.room_id
    WHERE b.booking_id = NEW.booking_id;
    
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

CREATE PROCEDURE GetTotalPaymentByGuest(IN guestId INT)
BEGIN
    SELECT g.guest_name, IFNULL(SUM(p.amount), 0) AS total_payment
    FROM Guest g
    LEFT JOIN Booking b ON g.guest_id = b.guest_id
    LEFT JOIN Payment p ON b.booking_id = p.booking_id
    WHERE g.guest_id = guestId
    GROUP BY g.guest_name;
END$$

CREATE PROCEDURE GetAvailableRoomsByHotel(IN hid INT)
BEGIN
    SELECT room_id, room_type, price_per_night
    FROM Room
    WHERE hotel_id = hid AND status = 'Available';
END$$

CREATE PROCEDURE AddBooking(
    IN guestId INT,
    IN roomId INT,
    IN checkIn DATE,
    IN checkOut DATE
)
BEGIN
    DECLARE roomStatus VARCHAR(20);

    SELECT status INTO roomStatus FROM Room WHERE room_id = roomId;

    IF roomStatus = 'Booked' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Room is already booked!';
    ELSE
        INSERT INTO Booking (guest_id, room_id, check_in, check_out)
        VALUES (guestId, roomId, checkIn, checkOut);
    END IF;
END$$

CREATE PROCEDURE CheckOutGuest(IN bookingId INT)
BEGIN
    DECLARE rid INT;
    SELECT room_id INTO rid FROM Booking WHERE booking_id = bookingId;
    UPDATE Room SET status = 'Available' WHERE room_id = rid;
END$$

DELIMITER ;

-- Create functions
DELIMITER $$

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

SELECT 'Database has been RESET successfully!' AS Status;
SELECT 'All old data has been deleted and fresh schema created.' AS Message;
