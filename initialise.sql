drop database db_theatre;
create database db_theatre;
use db_theatre;

set foreign_key_checks=0;

create table halls (hall_id int, class varchar(10), no_of_seats int, primary key(hall_id,class));

create table movies (movie_id int primary key, movie_name varchar(40), length int, language varchar(10), show_start date, show_end date);

create table price_listing (price_id int primary key auto_increment, type varchar(5), day varchar(20), price double(16,2));

create table shows (show_id int primary key, movie_id int, hall_id int, type varchar(3), time int, Date date, price_id int, 
	foreign key(movie_id) references movies(movie_id), foreign key(hall_id) references halls(hall_id), foreign key(price_id) references price_listing(price_id) on update cascade);

create table booked_tickets (ticket_no int, show_id int, seat_no int, primary key(ticket_no,show_id), 
	foreign key(show_id) references shows(show_id) on delete cascade);

create table types(movie_id int primary key,type1 varchar(3),type2 varchar(3),type3 varchar(3),
	foreign key(movie_id) references movies(movie_id) on delete cascade);  

create table staff_info(
    staff_id INT NOT NULL AUTO_INCREMENT primary key,
    name varchar(30) NOT NULL,
    dob date NOT NULL,
    id varchar(15) NOT NULL,
    phone varchar(15) NOT NULL,
    email varchar(100) NOT NULL,
    gender varchar(10) NOT NULL,
    address varchar(100),
    salary double(16,2) default 0.00
);
create table member_info(
    member_id INT NOT NULL AUTO_INCREMENT primary key,
    name varchar(30) NOT NULL,
    dob date NOT NULL,
    id varchar(15) NOT NULL,
    phone varchar(15) NOT NULL,
    email varchar(100) NOT NULL,
    gender varchar(10) NOT NULL,
    type varchar(20)
);

CREATE TABLE accounts (
	id INT NOT NULL AUTO_INCREMENT,
  	username varchar(50) NOT NULL,
  	password varchar(255) NOT NULL,
  	role varchar(20) NOT NULL,
  	email varchar(100) NOT NULL,
    PRIMARY KEY (`id`)
);

desc halls;
desc movies;
desc price_listing;
desc shows;
desc booked_tickets;

set foreign_key_checks=1;

insert into halls values
(1, "VIP", 35),
(1, "Thuong", 75),
(2, "VIP", 27),
(2, "Thuong", 97),
(3, "VIP", 26),
(3, "THUONG", 98);

insert into price_listing values
    (1, "2D", "T2-T6", 45000),
    (2, "3D", "T2-T6", 60000),
    (3, "IMAX", "T2-T6", 120000),
    (4, "2D", "Cuoi tuan, Ngay le", 60000),
    (5, "3D", "Cuoi tuan, Ngay le", 90000),
    (6, "IMAX", "Cuoi tuan, Ngay le", 150000);

INSERT INTO accounts (username, password, role, email) VALUES
    ('cashier_test', 'cashier_test', 'cashier', 'test@test.com'),
    ('manager_test', 'manager_test', 'manager', 'test@test.com');
-- drop trigger get_price;

INSERT INTO staff_info VALUES
    (1, 'Nguyen Huu Binh', '2001-01-01', '034112321313', '0972966421', 'bing@gmail.com', 'Nam', 'Hanoi', 350000.00),
    (2, 'Bui Tho Vinh', '2001-01-02', '034112321313', '0972966421', 'bing@gmail.com', 'Nam', 'Hanoi', 450000.00),
    (3, 'Luu Van Bac', '2001-01-03', '034112321313', '0972966421', 'bing@gmail.com', 'Nam', 'Hanoi', 350000.00);

INSERT INTO member_info VALUES
    (1, 'Nguyen Huu Binh', '2001-01-01', '034112321313', '0972966421', 'bing@gmail.com', 'Nam', 'Normal'),
    (2, 'Bui Tho Vinh', '2001-01-02', '034112321313', '0972966421', 'bing@gmail.com', 'Nam', 'Student'),
    (3, 'Luu Van Bac', '2001-01-03', '034112321313', '0972966421', 'bing@gmail.com', 'Nam', 'Student');

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