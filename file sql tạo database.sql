-- import database
use db_theatre1;

set foreign_key_checks=0;

create table manager_info (manager_id int primary key, manager_name varchar(40), age int);

create table halls (hall_id int, class varchar(10), no_of_seats int, primary key(hall_id,class));

create table movies (movie_id int primary key, movie_name varchar(40), length int, language varchar(10), show_start date, show_end date);

create table price_listing (price_id int primary key, type varchar(3), day varchar(10), price int);

create table shows (show_id int primary key, movie_id int, hall_id int, type varchar(3), time int, Date date, price_id int, 
	foreign key(movie_id) references movies(movie_id), foreign key(hall_id) references halls(hall_id), foreign key(price_id) references price_listing(price_id) on update cascade);

create table booked_tickets (ticket_no int, show_id int, seat_no int, primary key(ticket_no,show_id), 
	foreign key(show_id) references shows(show_id) on delete cascade);

create table types(movie_id int primary key,type1 varchar(3),type2 varchar(3),type3 varchar(3),
	foreign key(movie_id) references movies(movie_id) on delete cascade);  

desc halls;
desc movies;
desc price_listing;
desc shows;
desc booked_tickets;

set foreign_key_checks=1;

insert into halls values
(1, "gold", 35), 
(1, "standard", 75), 
(2, "gold", 27), 
(2, "standard", 97), 
(3, "gold", 26), 
(3, "standard", 98);

insert into price_listing values
(1, "2D", "Monday", 210),
(2, "3D", "Monday", 295),
(3, "4DX", "Monday", 380),
(4, "2D", "Tuesday", 210),
(5, "3D", "Tuesday", 295),
(6, "4DX", "Tuesday", 380),
(7, "2D", "Wednesday", 210),
(8, "3D", "Wednesday", 295),
(9, "4DX", "Wednesday", 380),
(10, "2D", "Thursday", 210),
(11, "3D", "Thursday", 295),
(12, "4DX", "Thursday", 380),
(13, "2D", "Friday", 320),
(14, "3D", "Friday", 335),
(15, "4DX", "Friday", 495),
(16, "2D", "Saturday", 320),
(17, "3D", "Saturday", 335),
(18, "4DX", "Saturday", 495),
(19, "2D", "Sunday", 320),
(20, "3D", "Sunday", 335),
(21, "4DX", "Sunday", 495);

select * from halls;
select * from price_listing;

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



-- thêm vào để chạy staff (xóa sau)
create table staff_info( staff_id int primary key, staff_name varchar(40), date_of_birth date, ID_card int, address varchar(60), position varchar(30));
-- chỉ cần viết thêm như sau là có file sql mới(ví dụ tạo bảng nhân viên và khách hàng )
create table nhan_vien (ma_nhan_vien int primary key, ten_nhan_vien varchar(40), ngay_sinh date, gioi_tinh varchar(10), can_cuoc_cong_dan int, chuc_vu varchar(20), so_dien_thoai int, email varchar(40), dia_chi varchar(50), luong varchar(20));
create table khach_hang (ma_khach_hang int primary key, ten_khach_hang varchar(40), ngay_sinh date, gioi_tinh varchar(10), can_cuoc_cong_dan int,  so_dien_thoai int, email varchar(40), loai_khach_hang varchar(20));