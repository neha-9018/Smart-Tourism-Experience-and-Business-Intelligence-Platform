SELECT * FROM Hotel;
create database Hotel_Management;
use Hotel_Management;
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
show tables;

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
(1, 'Suite', 8000, 'Booked'),
(2, 'Standard', 3000, 'Available'),
(3, 'Luxury Suite', 10000, 'Available'),
(4, 'Executive', 6000, 'Booked');

INSERT INTO Guest (guest_name, phone, email, address) VALUES
('Rahul Sharma', '9876543210', 'rahul@gmail.com', 'Delhi'),
('Ananya Singh', '9876501234', 'ananya@gmail.com', 'Mumbai'),
('Arjun Mehta', '9876512345', 'arjun@gmail.com', 'Bangalore'),
('Sneha Kapoor', '9456789123', 'sneha@gmail.com', 'Hyderabad'),
('Vikram Jain', '9876540987', 'vikram@gmail.com', 'Chennai');

INSERT INTO Booking (guest_id, room_id, check_in, check_out) VALUES
(1, 1, '2025-09-20', '2025-09-22'),
(2, 2, '2025-09-25', '2025-09-28'),
(3, 3, '2025-10-01', '2025-10-03'),
(4, 4, '2025-10-05', '2025-10-07'),
(5, 5, '2025-10-10', '2025-10-12');

INSERT INTO Payment (booking_id, amount, payment_date, method) VALUES
(1, 10000, '2025-09-19', 'Card'),
(2, 15000, '2025-09-24', 'UPI'),
(3, 8000, '2025-09-30', 'Cash'),
(4, 12000, '2025-10-04', 'Card'),
(5, 6000, '2025-10-09', 'UPI');

INSERT INTO Service (service_name, price) VALUES
('Spa', 2000),
('Laundry', 500),
('Airport Pickup', 1500),
('Room Service', 1000),
('Gym Access', 800);

INSERT INTO Guest_Service (guest_id, service_id) VALUES
(1, 1),
(1, 4),
(2, 2),
(3, 3),
(4, 1),
(5, 5);

INSERT INTO RestaurantOrder (guest_id, order_date, total_amount) VALUES
(1, '2025-09-21', 1200),
(2, '2025-09-26', 800),
(3, '2025-10-02', 1500),
(4, '2025-10-06', 1000),
(5, '2025-10-11', 1300);

INSERT INTO Feedback (booking_id, rating, comments) VALUES
(1, 5, 'Excellent service and very comfortable stay.'),
(2, 4, 'Good experience, room was clean.'),
(3, 3, 'Average stay, food could be better.'),
(4, 5, 'Loved the stay, staff was very helpful.'),
(5, 4, 'Nice hotel, but a bit noisy.');

SELECT * FROM Hotel;
SELECT * FROM Staff;
SELECT * FROM Room;
SELECT * FROM Guest;
SELECT * FROM Booking;
SELECT * FROM Payment;
SELECT * FROM Service;
SELECT * FROM guest_service;
SELECT * FROM restaurantorder;
SELECT * FROM Feedback;


-- Add a Trigger

-- 1. After Booking → Update Room Status
DELIMITER $$
CREATE TRIGGER after_booking_insert
AFTER INSERT ON Booking
FOR EACH ROW
BEGIN
    UPDATE Room
    SET status = 'Booked'
    WHERE room_id = NEW.room_id;
END$$
DELIMITER ;

-- 2. After Payment → Log Payment Confirmation
CREATE TABLE Payment_Log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    log_message VARCHAR(255),
    log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$
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

    -- Sum of payments already made for this booking (excluding NEW, since BEFORE INSERT)
    SELECT IFNULL(SUM(amount), 0) INTO paid_so_far FROM Payment WHERE booking_id = NEW.booking_id;

    -- If paying more than remaining due, reject the insert
    IF (paid_so_far + NEW.amount) > total_bill THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Payment exceeds the total bill for this booking. Payment rejected.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
DROP TRIGGER IF EXISTS after_payment_insert$$
CREATE TRIGGER after_payment_insert
AFTER INSERT ON Payment
FOR EACH ROW
BEGIN
    INSERT INTO Payment_Log (booking_id, log_message)
    VALUES (NEW.booking_id, CONCAT('Payment of Rs.', NEW.amount, ' received via ', NEW.method));
END$$
DELIMITER ;

-- 3. After Feedback → Auto-update Hotel Rating
DELIMITER $$
CREATE TRIGGER update_hotel_rating
AFTER INSERT ON Feedback
FOR EACH ROW
BEGIN
    UPDATE Hotel h
    JOIN Booking b ON h.hotel_id = (SELECT hotel_id FROM Room WHERE room_id = b.room_id)
    SET h.rating = (
        SELECT ROUND(AVG(f.rating), 1)
        FROM Feedback f
        JOIN Booking bk ON f.booking_id = bk.booking_id
        JOIN Room r ON bk.room_id = r.room_id
        WHERE r.hotel_id = h.hotel_id
    )
    WHERE h.hotel_id = (SELECT hotel_id FROM Room WHERE room_id = b.room_id);
END$$
DELIMITER ;


-- Add a Stored Procedure

-- 1. GetTotalPaymentByGuest
DELIMITER $$
CREATE PROCEDURE GetTotalPaymentByGuest(IN guestId INT)
BEGIN
    SELECT g.guest_name, SUM(p.amount) AS total_payment
    FROM Payment p
    JOIN Booking b ON p.booking_id = b.booking_id
    JOIN Guest g ON b.guest_id = g.guest_id
    WHERE g.guest_id = guestId
    GROUP BY g.guest_name;
END$$
DELIMITER ;

CALL GetTotalPaymentByGuest(1);

-- 2. GetAvailableRoomsByHotel
DELIMITER $$
CREATE PROCEDURE GetAvailableRoomsByHotel(IN hid INT)
BEGIN
    SELECT room_id, room_type, price_per_night
    FROM Room
    WHERE hotel_id = hid AND status = 'Available';
END$$
DELIMITER ;

CALL GetAvailableRoomsByHotel(1);

-- 3. AddBooking (Simplifies booking process)
DELIMITER $$
CREATE OR REPLACE PROCEDURE AddBooking(
    IN guestId INT,
    IN roomId INT,
    IN checkIn DATE,
    IN checkOut DATE
)
BEGIN
    DECLARE roomStatus VARCHAR(20);

    -- Check if room is already booked
    SELECT status INTO roomStatus FROM Room WHERE room_id = roomId;

    IF roomStatus = 'Booked' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Room is already booked!';
    ELSE
        -- Proceed with booking
        INSERT INTO Booking (guest_id, room_id, check_in, check_out)
        VALUES (guestId, roomId, checkIn, checkOut);

        UPDATE Room
        SET status = 'Booked'
        WHERE room_id = roomId;
    END IF;
END$$
DELIMITER ;


CALL AddBooking(1, 1, '2025-11-10', '2025-11-12');  -- Rahul Sharma


-- 4.Create a Stored Procedure for Check-Out

DELIMITER $$
CREATE PROCEDURE CheckOutGuest(IN bookingId INT)
BEGIN
    DECLARE rid INT;
    SELECT room_id INTO rid FROM Booking WHERE booking_id = bookingId;
    UPDATE Room SET status = 'Available' WHERE room_id = rid;
END$$
DELIMITER ;



-- Add a Function

-- 1. StayDuration
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
    RETURN duration;
END$$
DELIMITER ;

SELECT booking_id, StayDuration(booking_id) AS days_stayed FROM Booking;

-- 2. CalculateTotalServicesForGuest
DELIMITER $$
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
DELIMITER ;

SELECT guest_name, TotalServiceCost(guest_id) AS ServiceAmount FROM Guest;

-- 3. TotalBillForBooking
DELIMITER $$
CREATE FUNCTION TotalBill(bid INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE total DECIMAL(10,2);
    SELECT p.amount INTO total
    FROM Payment p
    WHERE p.booking_id = bid;
    RETURN total;
END$$
DELIMITER ;

SELECT booking_id, TotalBill(booking_id) AS FinalBill FROM Booking;



