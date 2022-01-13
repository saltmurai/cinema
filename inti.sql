DROP database db_theatre;
CREATE database db_theatre;
use db_theatre;

SET foreign_key_checks = 0;

CREATE TABLE halls ( 
    hall_id INT, 
    class VARCHAR(10), 
    no_of_seats INT, 
    PRIMARY key(hall_id, class) 
);

CREATE TABLE movies ( 
    movie_id INT, 
    movie_name VARCHAR(40), 
    length INT, 
    language VARCHAR(10), 
    show_start DATE, 
    show_end DATE,
    PRIMARY KEY (movie_id) 
);

CREATE TABLE price_listing ( 
    price_id INT, 
    type VARCHAR(5), 
    DAY VARCHAR(20), 
    price DOUBLE(16, 2),
    PRIMARY KEY(price_id) 
);

CREATE TABLE shows ( 
    show_id INT PRIMARY key, 
    movie_id INT, hall_id INT, 
    type VARCHAR(3), 
    TIME INT, 
    DATE DATE, 
    price_id INT, 
    FOREIGN key(movie_id) REFERENCES movies(movie_id), 
    FOREIGN key(hall_id) REFERENCES halls(hall_id), 
    FOREIGN key(price_id) REFERENCES price_listing(price_id) ON UPDATE CASCADE
);

CREATE TABLE booked_tickets ( 
    ticket_no INT, 
    show_id INT, 
    seat_no INT, 
    PRIMARY key(ticket_no, show_id), 
    FOREIGN key(show_id) REFERENCES shows(show_id) ON DELETE CASCADE 
);

CREATE TABLE types( 
    movie_id INT PRIMARY key, 
    type1 VARCHAR(3), 
    type2 VARCHAR(3), 
    type3 VARCHAR(3), 
    FOREIGN key(movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
);

CREATE TABLE staff_info( 
    staff_id INT AUTO_INCREMENT, 
    name VARCHAR(30) NOT NULL, 
    dob DATE NOT NULL, 
    id VARCHAR(15) NOT NULL, 
    phone VARCHAR(15) NOT NULL, 
    email VARCHAR(100) NOT NULL, 
    gender VARCHAR(10) NOT NULL, 
    address VARCHAR(100), 
    salary DOUBLE(16, 2) DEFAULT 0.00,
    PRIMARY KEY (staff_id)
    
);

CREATE TABLE member_info( 
    member_id INT, 
    name VARCHAR(30) NOT NULL, 
    dob DATE NOT NULL, 
    id VARCHAR(15) NOT NULL, 
    phone VARCHAR(15) NOT NULL, 
    email VARCHAR(100) NOT NULL, 
    gender VARCHAR(10) NOT NULL, 
    type VARCHAR(20),
    PRIMARY KEY(member_id)
    );

CREATE TABLE accounts ( 
    id INT AUTO_INCREMENT, 
    username VARCHAR(50) NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    role VARCHAR(20) NOT NULL, 
    email VARCHAR(100) NOT NULL, 
    PRIMARY KEY (id)

);

DESC halls;
DESC movies;
DESC price_listing;
DESC shows;
DESC booked_tickets;

SET foreign_key_checks = 1;

INSERT INTO
    halls 
VALUES
    (
        1, "VIP", 35
    )
, 
    (
        1, "Thuong", 75
    )
, 
    (
        2, "VIP", 27
    )
, 
    (
        2, "Thuong", 97
    )
, 
    (
        3, "VIP", 26
    )
, 
    (
        3, "THUONG", 98
    )
;

INSERT INTO
    price_listing 
VALUES
    (
        1, "2D", "T2 - T6", 45000
    )
, 
    (
        2, "3D", "T2 - T6", 60000
    )
, 
    (
        3, "IMAX", "T2 - T6", 120000
    )
, 
    (
        4, "2D", "Cuoi tuan, Ngay le", 60000
    )
, 
    (
        5, "3D", "Cuoi tuan, Ngay le", 90000
    )
, 
    (
        6, "IMAX", "Cuoi tuan, Ngay le", 150000
    )
;

INSERT INTO
    accounts (username, password, role, email) 
VALUES
    (
        'cashier_test', 'cashier_test', 'cashier', 'test@test.com' 
    )
, 
    (
        'manager_test', 'manager_test', 'manager', 'test@test.com' 
    )
;

INSERT INTO
    staff_info 
VALUES
    (
        1, 'Nguyen Huu Binh', '2001-01-01', '034112321313', '0972966421', 'bing@gmail.com', 'Nam', 'Hanoi', 350000.00 
    )
, 
    (
        2, 'Bui Tho Vinh', '2001-01-02', '034112321313', '0972966421', 'bing@gmail.com', 'Nam', 'Hanoi', 450000.00 
    )
, 
    (
        3, 'Luu Van Bac', '2001-01-03', '034112321313', '0972966421', 'bing@gmail.com', 'Nam', 'Hanoi', 350000.00 
    )
;

INSERT INTO
    member_info 
VALUES
    (
        1, 'Nguyen Huu Binh', '2001-01-01', '034112321313', '0972966421', 'bing@gmail.com', 'Nam', 'Normal' 
    )
, 
    (
        2, 'Bui Tho Vinh', '2001-01-02', '034112321313', '0972966421', 'bing@gmail.com', 'Nam', 'Student' 
    )
, 
    (
        3, 'Luu Van Bac', '2001-01-03', '034112321313', '0972966421', 'bing@gmail.com', 'Nam', 'Student' 
    )
;

delimiter //
create trigger get_price
after insert on halls
for each row
begin

UPDATE shows s, price_listing p 
SET s.price_id=p.price_id 
WHERE p.price_id IN 
(SELECT price_id 
FROM price_listing p 
WHERE dayname(s.Date)=p.day AND s.type=p.type);

end; //

delimiter ;


-- drop procedure delete_old;
delimiter //

create procedure delete_old()
begin

	declare curdate date;
set curdate=curdate();

DELETE FROM shows 
WHERE datediff(Date,curdate)<0;

DELETE FROM shows 
WHERE movie_id IN 
(SELECT movie_id 
FROM movies
WHERE datediff(show_end,curdate)<0);

DELETE FROM movies 
WHERE datediff(show_end,curdate)<0;

end; //

delimiter ;
show tables;