var username = null;
var password = null;
var date = null;
var movieID = null;
var type = null;
var seatNo = null;
var seatClass = null;
var movieTime = null;
var showID = null;
var startShowing = null;
var endShowing = null;
var showTime = null;
var showDate = null;
var priceID = null;
function login() {
	if (username === null) {
		username = $("[name='username']")[0].value;
		password = $("[name='password']")[0].value;
	}
	var form = {
		'username': username,
		'password': password
	};
	$.ajax({
		type: 'POST',
		url: '/login',
		data: form,
		success: function (response) {
			$('.module').html(response);
			$('.module').addClass('module-after-login');
			$('.login-header').addClass('after-login');
			$('#datepicker-cashier').pickadate({
				min: new Date(),
				formatSubmit: 'yyyy/mm/dd',
				hiddenName: true,
				onSet: function (event) {
					if (event.select) {
						$('#datepicker-cashier').prop('disabled', true);
						getMoviesShowingOnDate(this.get('select', 'yyyy/mm/dd'));
					}
				}
			});
		}
	});
}
// Functions for cashier
function getMoviesShowingOnDate(mdate) {
	date = mdate;
	$.ajax({
		type: 'POST',
		url: '/getMoviesShowingOnDate',
		data: { 'date': date },
		success: function (response) {
			$('#movies-on-date').html(response);
		}
	});
}
function selectMovie(movID, mtype) {
	movieID = movID;
	type = mtype;
	$.ajax({
		type: 'POST',
		url: '/getTimings',
		data: {
			'date': date,
			'movieID': movieID,
			'type': type
		},
		success: function (response) {
			$('#movies-on-date button').prop('disabled', true);
			$('#timings-for-movie').html(response);
		}
	});
}
function selectTiming(mtime) {
	movieTime = mtime;
	$.ajax({
		type: 'POST',
		url: '/getShowID',
		data: {
			'date': date,
			'movieID': movieID,
			'type': type,
			'time': movieTime
		},
		success: function (response) {
			$('#timings-for-movie button').prop('disabled', true);
			showID = response['showID'];
			getSeats();
		}
	});
}
function getSeats() {
	$.ajax({
		type: 'POST',
		url: '/getAvailableSeats',
		data: { 'showID': showID },
		success: function (response) {
			$('#available-seats').html(response);
		}
	});
}
function selectSeat(no, sclass) {
	seatNo = no;
	seatClass = sclass;
	$.ajax({
		type: 'POST',
		url: '/getPrice',
		data: {
			'showID': showID,
			'seatClass': seatClass
		},
		success: function (response) {
			$('#price-and-confirm').html(response);
		}
	});
}
function confirmBooking() {
	var staffID = document.getElementById('staff-id').getAttribute('data-value');
	$.ajax({
		type: 'POST',
		url: '/insertBooking',
		data: {
			'staffID':staffID,
			'showID': showID,
			'seatNo': seatNo,
			'seatClass': seatClass
		},
		success: function (response) {
			$('#available-seats button').prop('disabled', true);
			$('#price-and-confirm').html(response);
		}
	});
}
// Functions for manager
function viewBookedTickets() {
	$('#options button').prop('disabled', true);
	$('#manager-dynamic-1').html('<input id="datepicker-manager-1" placeholder="Pick a date">');
	$('#datepicker-manager-1').pickadate({
		formatSubmit: 'yyyy/mm/dd',
		hiddenName: true,
		onSet: function (event) {
			if (event.select) {
				$('#datepicker-manager-1').prop('disabled', true);
				getShowsShowingOnDate(this.get('select', 'yyyy/mm/dd'));
			}
		}
	});
}
function getShowsShowingOnDate(mdate) {
	date = mdate;
	$.ajax({
		type: 'POST',
		url: '/getShowsShowingOnDate',
		data: { 'date': date },
		success: function (response) {
			$('#manager-dynamic-2').html(response);
		}
	});
}
function selectShow(mshowID) {
	showID = mshowID;
	$.ajax({
		type: 'POST',
		url: '/getBookedWithShowID',
		data: { 'showID': showID },
		success: function (response) {
			$('#manager-dynamic-2 button').prop('disabled', true)
			$('#manager-dynamic-3').html(response);
		}
	});
}

function createShow() {
	$('#options button').prop('disabled', true);
	$('#manager-dynamic-1').html('<input id="datepicker-manager-3" placeholder="Pick a date"><input id="timepicker-manager-1" placeholder="Pick a time"><button onclick="getValidMovies()">Submit</button>');
	$('#datepicker-manager-3').pickadate({
		formatSubmit: 'yyyy/mm/dd',
		hiddenName: true,
		min: new Date(),
		onSet: function (event) {
			if (event.select) {
				showDate = this.get('select', 'yyyy/mm/dd');
			}
		}
	});
	$('#timepicker-manager-1').pickatime({
		formatSubmit: 'HHi',
		hiddenName: true,
		interval: 15,
		min: new Date(2000, 1, 1, 8),
		max: new Date(2000, 1, 1, 22),
		onSet: function (event) {
			if (event.select) {
				showTime = parseInt(this.get('select', 'HHi'), 10);
			}
		}
	});
}
function getValidMovies() {
	if ($('#timepicker-manager-1')[0].value == '' || $('#datepicker-manager-3')[0].value == '') {
		$('#manager-dynamic-2').html('<h5>Please Fill In All Fields</h5>');
		return;
	}
	$('#manager-dynamic-1 input,#manager-dynamic-1 button').prop('disabled', true)
	$.ajax({
		type: 'POST',
		url: '/getValidMovies',
		data: {
			'showDate': showDate
		},
		success: function (response) {
			$('#manager-dynamic-2').html(response);
		}
	});
}
function selectShowMovie(movID, types) {
	movieID = movID;
	$('#manager-dynamic-2 button').prop('disabled', true);
	$('#manager-dynamic-3').html('<h4>Select Movie Type For Show</h4>');
	types.split(' ').forEach(function (t) {
		$('#manager-dynamic-3').append('<button onclick="selectShowType(' + ("'" + t + "'") + ')">' + t + '</button>');
	});
}
function selectShowType(t) {
	type = t;
	$.ajax({
		type: 'POST',
		url: '/getHallsAvailable',
		data: {
			'showDate': showDate,
			'showTime': showTime,
			'movieID': movieID
		},
		success: function (response) {
			$('#manager-dynamic-3 button').prop('disabled', true);
			$('#manager-dynamic-4').html(response);
		}
	});
}
function selectShowHall(hall) {
	$.ajax({
		type: 'POST',
		url: '/insertShow',
		data: {
			'hallID': hall,
			'movieType': type,
			'showDate': showDate,
			'showTime': showTime,
			'movieID': movieID
		},
		success: function (response) {
			$('#manager-dynamic-4 button').prop('disabled', true);
			$('#manager-dynamic-5').html(response);
		}
	});
}
function alterPricing() {
	$('#options button').prop('disabled', true);
	$.ajax({
		type: 'GET',
		url: '/getPriceList',
		success: function (response) {
			$('#manager-dynamic-1').html(response);
		}
	});
}
function alterPrice(mpriceID) {
	priceID = mpriceID;
	$('#manager-dynamic-1 button').prop('disabled', true);
	$('#manager-dynamic-2').html('<input type="number" name="new_price" placeholder="New price for Standard ₹"><button onclick="changePrice()">Change</button>');
}
function changePrice() {
	newPrice = $('#manager-dynamic-2 input')[0].value;
	$.ajax({
		type: 'POST',
		url: '/setNewPrice',
		data: {
			'priceID': priceID,
			'newPrice': newPrice
		},
		success: function (response) {
			$('#manager-dynamic-3').html(response);
		}
	});
}





//demo bai tap lon
// function for staff
function StaffOption() {
	$('#options button ').prop('disabled', true);
	$.ajax({
		type: 'POST',
		url: '/getStaffOption',
		success: function (reponse) {
			$('#manager-dynamic-1').html(reponse);
		}
	});
}

var staffID = null;
var staffName = null;
var staffDob = null;
var staffGender =null;
var staffIDcard = null;
var staffPosition = null;
var staffPhoneNumber = null;
var staffEmail = null;
var staffAddress = null;
var staffSalary = null;
//add staff function
function AddStaff() {
	$('#options button').prop('disabled', true);
	$.ajax({
		type: 'GET',
		url: '/fectchStaffInsertForm',
		success: function (response) {
			$('#manager-dynamic-2').html(response);
			$('#datepicker-manager-3').pickadate({
				changeYear: true,
				changeMonth: true,
				formatSubmit: 'yyyy/mm/dd',
				hiddenName: true,
				onSet: function (event) {
					if (event.select) {
						staffDob = this.get('select', 'yyyy/mm/dd');
					}
				}

			});
		}
	});
}
function filledStaffForm() {

	staffName = $('[name="staffName"]')[0].value;
	staffGender = $('[name="staffGender"]')[0].value;
	staffIDcard = $('[name="staffIDcard"]')[0].value;
	staffPhoneNumber = $('[name="staffPhoneNumber"]')[0].value;
	staffEmail = $('[name="staffEmail"]')[0].value;
	staffAddress = $('[name="staffAddress"]')[0].value;
	staffPosition = $('[name="staffPosition"]')[0].value;
	staffSalary = $('[name="staffSalary"]')[0].value;

	if (staffName == '' || staffIDcard == '' || staffGender == ''|| staffPhoneNumber == ''|| staffEmail == ''|| staffAddress == '' || staffPosition == '' || staffSalary == ''|| $('#datepicker-manager-3')[0].value == '') {
		$('#manager-dynamic-4').html('<h5>Please Fill In All Fields</h5>');
	}
	else if (!$.isNumeric(staffIDcard)) {
		$('#manager-dynamic-4').html('<h5>ID card Need To Be A Number</h5>');
	}
	else if (!$.isNumeric(staffPhoneNumber)) {
		$('#manager-dynamic-4').html('<h5>Phone Number Need To Be A Number</h5>');
	}
	else {
		staffIDcard = parseInt(staffIDcard, 10);
		staffPhoneNumber = parseInt(staffPhoneNumber, 10);
		$.ajax({
			type: 'POST',
			url: '/InsertStaff',
			data: {
				'staffName': staffName,
				'staffDob': staffDob,
				'staffIDcard': staffIDcard,
				'staffGender': staffGender,
				'staffPhoneNumber': staffPhoneNumber,
				'staffEmail': staffEmail,
				'staffAddress': staffAddress,
				'staffPosition': staffPosition,
				'staffSalary': staffSalary
			},
			success: function (response) {
				$('#manager-dynamic-4').html(response);
			}
		});
	}
}
//update staff function
function UpdateStaff() {
	$('#options button').prop('disabled', true);
	$.ajax({
		type: 'GET',
		url: '/getStaffInfo',
		success: function (response) {
			$('#manager-dynamic-2').html(response);
		}
	});
}

function updateStaffFunction(_staffID) {
	staffID = _staffID;
	$('#manager-dynamic-2 button').prop('disabled', true);
	$('#manager-dynamic-3').html('<input type="text" name="newStaffName" placeholder="New Name">');
	$('#manager-dynamic-4').html('<input id="datepicker-manager-4" name="newStaffDob" placeholder="New Date of Birth">');
	$('#datepicker-manager-4').pickadate({
		formatSubmit: 'yyyy/mm/dd',
		hiddenName: true,
		onSet: function (event) {
			if (event.select) {
				newStaffDob = this.get('select', 'yyyy/mm/dd');
			}
		}
	});
	$('#manager-dynamic-5').html('<input type="text" name="newStaffGender" placeholder="New Gender">');
	$('#manager-dynamic-6').html('<input type="text" name="newStaffIDcard" placeholder="New ID card">');
	$('#manager-dynamic-7').html('<input type="text" name="newStaffPhoneNumber" placeholder="New Phone Number">');
	$('#manager-dynamic-8').html('<input type="text" name="newStaffEmail" placeholder="New Email">');
	$('#manager-dynamic-9').html('<input type="text" name="newStaffAddress" placeholder="New Address">');
	$('#manager-dynamic-10').html('<input type="text" name="newStaffPosition" placeholder="New Position">')
	$('#manager-dynamic-11').html('<input type="text" name="newStaffSalary" placeholder="New Salary"><button onclick="changeStaffinfo()">Change</button>');
}
function changeStaffinfo() {
	newStaffName = $('#manager-dynamic-3 input')[0].value;
	newStaffGender = $('#manager-dynamic-5 input')[0].value;
	newStaffIDcard = $('#manager-dynamic-6 input')[0].value;
	newStaffPhoneNumber = $('#manager-dynamic-7 input')[0].value;
	newStaffEmail = $('#manager-dynamic-8 input')[0].value;
	newStaffAddress = $('#manager-dynamic-9 input')[0].value;
	newStaffPosition = $('#manager-dynamic-10 input')[0].value;
	newStaffSalary = $('#manager-dynamic-11 input')[0].value;
	$.ajax({
		type: 'POST',
		url: '/setNewStaffInfo',
		data: {
			'staffID' : staffID,
			'newStaffName': newStaffName,
			'newStaffDob': newStaffDob,
			'newStaffIDcard': newStaffIDcard,
			'newStaffGender': newStaffGender,
			'newStaffPhoneNumber': newStaffPhoneNumber,
			'newStaffEmail': newStaffEmail,
			'newStaffAddress': newStaffAddress,
			'newStaffPosition': newStaffPosition,
			'newStaffSalary': newStaffSalary
		},
		success: function (response) {
			$('#manager-dynamic-12').html(response);
		}
	});
}

//delete staff function
function DeleteStaff() {
	$('#options button').prop('disabled', true);
	$.ajax({
		type: 'GET',
		url: '/getStaffInfoForDelete',
		success: function (response) {
			$('#manager-dynamic-2').html(response);
		}
	});
}

function deleteStaffFunction(_staffID) {
	staffID = _staffID;
	$('#manager-dynamic-2 button').prop('disabled', true);
	$('#manager-dynamic-3').html('<button onclick="deleteStaffInfo()">Delete</button>')

}
function deleteStaffInfo() {
	$.ajax({
		type: 'POST',
		url: '/deleteStaffInfo',
		data: { 'staffID': staffID },
		success: function (response) {
			$('#manager-dynamic-4').html(response);
		}
	});
}

//show staff function
function ShowAllStaff(){
	$('#options button').prop('disabled', true);
	$.ajax({
		type: 'GET',
		url: '/getStaffInfo1',
		success: function (response) {
			$('#manager-dynamic-3').html(response);
		}
	});
}

function showSelectedStaffFunction(_staffID){
	staffID = _staffID;
	$.ajax({
		type: 'POST',
		url: '/showSelectedStaffInfo',
		data: {
			'staffID': staffID
		},
		success: function (response) {
			$('#manager-dynamic-4').html(response);
		}
	});
}

//search staff function
function SearchStaff() {
	$('#options button').prop('disabled', true);
	$('#manager-dynamic-3').html('<input type="text" name="SearchStaffName" placeholder="Search by name"><button onclick="searchStaffinfo()">Search</button>');

}

function searchStaffinfo() {
	searchStaffName = $('#manager-dynamic-3 input')[0].value;
	$.ajax({
		type: 'POST',
		url: '/searchStaffInfo',
		data: {
			'searchStaffName': searchStaffName
		},
		success: function (response) {
			$('#manager-dynamic-4').html(response);
		}
	});

}

//function cho member

function MemberOption() {
	$('#options button ').prop('disabled', true);
	$.ajax({
		type: 'POST',
		url: '/getMemberOption',
		success: function (reponse) {
			$('#manager-dynamic-1').html(reponse);
		}
	});
}

var memberID = null;
var memberName = null;
var memberDob = null;
var memberGender =null;
var memberIDcard = null;
var memberPhoneNumber = null;
var memberEmail = null;
var memberType = null;
//add member function
function AddMember() {
	$('#options button').prop('disabled', true);
	$.ajax({
		type: 'GET',
		url: '/fectchMemberInsertForm',
		success: function (response) {
			$('#manager-dynamic-2').html(response);
			$('#datepicker-manager-3').pickadate({
				changeYear: true,
				changeMonth: true,
				formatSubmit: 'yyyy/mm/dd',
				hiddenName: true,
				onSet: function (event) {
					if (event.select) {
						memberDob = this.get('select', 'yyyy/mm/dd');
					}
				}

			});
		}
	});
}
function filledMemberForm() {

	memberName = $('[name="memberName"]')[0].value;
	memberGender = $('[name="memberGender"]')[0].value;
	memberIDcard = $('[name="memberIDcard"]')[0].value;
	memberPhoneNumber = $('[name="memberPhoneNumber"]')[0].value;
	memberEmail = $('[name="memberEmail"]')[0].value;
	memberType = $('[name="memberType"]')[0].value;

	if (memberName == '' || memberIDcard == '' || memberGender == ''|| memberPhoneNumber == ''|| memberEmail == ''|| memberType == ''|| $('#datepicker-manager-3')[0].value == '') {
		$('#manager-dynamic-4').html('<h5>Please Fill In All Fields</h5>');
	}
	else if (!$.isNumeric(memberIDcard)) {
		$('#manager-dynamic-4').html('<h5>ID card Need To Be A Number</h5>');
	}
	else if (!$.isNumeric(memberPhoneNumber)) {
		$('#manager-dynamic-4').html('<h5>Phone Number Need To Be A Number</h5>');
	}
	else {
		memberIDcard = parseInt(memberIDcard, 10);
		memberPhoneNumber = parseInt(memberPhoneNumber, 10);
		$.ajax({
			type: 'POST',
			url: '/InsertMember',
			data: {
				'memberName': memberName,
				'memberDob': memberDob,
				'memberIDcard': memberIDcard,
				'memberGender': memberGender,
				'memberPhoneNumber': memberPhoneNumber,
				'memberEmail': memberEmail,
				'memberType': memberType
			},
			success: function (response) {
				$('#manager-dynamic-4').html(response);
			}
		});
	}
}


//update member function
function UpdateMember() {
	$('#options button').prop('disabled', true);
	$.ajax({
		type: 'GET',
		url: '/getMemberInfo',
		success: function (response) {
			$('#manager-dynamic-2').html(response);
		}
	});
}

function updateMemberFunction(_memberID) {
	memberID = _memberID;
	$('#manager-dynamic-2 button').prop('disabled', true);
	$('#manager-dynamic-3').html('<input type="text" name="newMemberName" placeholder="New Name">');
	$('#manager-dynamic-4').html('<input id="datepicker-manager-4" name="newMemberDob" placeholder="New Date of Birth">');
	$('#datepicker-manager-4').pickadate({
		formatSubmit: 'yyyy/mm/dd',
		hiddenName: true,
		onSet: function (event) {
			if (event.select) {
				newMemberDob = this.get('select', 'yyyy/mm/dd');
			}
		}
	});
	$('#manager-dynamic-5').html('<input type="text" name="newMemberGender" placeholder="New Gender">');
	$('#manager-dynamic-6').html('<input type="text" name="newMemberIDcard" placeholder="New ID card">');
	$('#manager-dynamic-7').html('<input type="text" name="newMemberPhoneNumber" placeholder="New Phone Number">');
	$('#manager-dynamic-8').html('<input type="text" name="newMemberEmail" placeholder="New Email">');
	$('#manager-dynamic-9').html('<input type="text" name="newMemberType" placeholder="New Type"><button onclick="changeMemberInfo()">Change</button>');
}
function changeMemberInfo() {
	newMemberName = $('#manager-dynamic-3 input')[0].value;
	newMemberGender = $('#manager-dynamic-5 input')[0].value;
	newMemberIDcard = $('#manager-dynamic-6 input')[0].value;
	newMemberPhoneNumber = $('#manager-dynamic-7 input')[0].value;
	newMemberEmail = $('#manager-dynamic-8 input')[0].value;
	newMemberType = $('#manager-dynamic-9 input')[0].value;
	$.ajax({
		type: 'POST',
		url: '/setNewMemberInfo',
		data: {
			'memberID' : memberID,
			'newMemberName': newMemberName,
			'newMemberDob': newMemberDob,
			'newMemberIDcard': newMemberIDcard,
			'newMemberGender': newMemberGender,
			'newMemberPhoneNumber': newMemberPhoneNumber,
			'newMemberEmail': newMemberEmail,
			'newMemberType': newMemberType
		},
		success: function (response) {
			$('#manager-dynamic-10').html(response);
		}
	});
}
//delete member function
function DeleteMember() {
	$('#options button').prop('disabled', true);
	$.ajax({
		type: 'GET',
		url: '/getMemberInfoForDelete',
		success: function (response) {
			$('#manager-dynamic-2').html(response);
		}
	});
}

function deleteMemberFunction(_memberID) {
	memberID = _memberID;
	$('#manager-dynamic-2 button').prop('disabled', true);
	$('#manager-dynamic-3').html('<button onclick="deleteMemberInfo()">Delete</button>')

}
function deleteMemberInfo() {
	$.ajax({
		type: 'POST',
		url: '/deleteMemberInfo',
		data: { 'memberID': memberID },
		success: function (response) {
			$('#manager-dynamic-4').html(response);
		}
	});
}
//show member function
function ShowAllMember(){
	$('#options button').prop('disabled', true);
	$.ajax({
		type: 'GET',
		url: '/getMemberInfo1',
		success: function (response) {
			$('#manager-dynamic-3').html(response);
		}
	});
}

function showSelectedMemberFunction(_memberID){
	memberID = _memberID;
	$.ajax({
		type: 'POST',
		url: '/showSelectedMemberInfo',
		data: {
			'memberID': memberID
		},
		success: function (response) {
			$('#manager-dynamic-4').html(response);
		}
	});
}
//search member function
function SearchMember() {
	$('#options button').prop('disabled', true);
	$('#manager-dynamic-3').html('<input type="text" name="SearchMemberName" placeholder="Search by name"><button onclick="searchMemberInfo()">Search</button>');

}

function searchMemberInfo() {
	searchMemberName = $('#manager-dynamic-3 input')[0].value;
	$.ajax({
		type: 'POST',
		url: '/searchMemberInfo',
		data: {
			'searchMemberName': searchMemberName
		},
		success: function (response) {
			$('#manager-dynamic-4').html(response);
		}
	});

}


//function for movies
function MovieOption() {
	$('#options button ').prop('disabled', true);
	$.ajax({
		type: 'POST',
		url: '/getMovieOption',
		success: function (reponse) {
			$('#manager-dynamic-2').html(reponse);
		}
	});
}

//add movie
function insertMovie() {
	$('#options button').prop('disabled', true);
	$.ajax({
		type: 'GET',
		url: '/fetchMovieInsertForm',
		success: function (response) {
			$('#manager-dynamic-2').html(response);
			$('#datepicker-manager-3').pickadate({
				formatSubmit: 'yyyy/mm/dd',
				hiddenName: true,
				onSet: function (event) {
					if (event.select) {
						startShowing = this.get('select', 'yyyy/mm/dd');
					}
				}
			});
			$('#datepicker-manager-4').pickadate({
				formatSubmit: 'yyyy/mm/dd',
				hiddenName: true,
				onSet: function (event) {
					if (event.select) {
						endShowing = this.get('select', 'yyyy/mm/dd');
					}
				}
			});
		}
	});
}
function filledMovieForm() {
	availTypes = $('[name="movieTypes"]')[0].value.toUpperCase().trim();
	movieName = $('[name="movieName"]')[0].value;
	movieLang = $('[name="movieLang"]')[0].value;
	movieLen = $('[name="movieLen"]')[0].value;
	types = ($('[name="movieTypes"]')[0].value.toUpperCase().trim()).split(' ');
	atleastTypes = ['2D', '3D', '4DX'];
	allTypes = [undefined].concat(atleastTypes);
	if ($('#datepicker-manager-3')[0].value == '' || $('#datepicker-manager-4')[0].value == '' ||
		movieName == '' || movieLang == '' || movieLen == '' || $('[name="movieTypes"]')[0].value == '')
		$('#manager-dynamic-3').html('<h5>Please Fill In All Fields</h5>');
	else if (!(atleastTypes.includes(types[0]) && allTypes.includes(types[1]) && allTypes.includes(types[2])))
		$('#manager-dynamic-3').html('<h5>Invalid Format For Movie Types</h5>');
	else if (!$.isNumeric(movieLen))
		$('#manager-dynamic-3').html('<h5>Movie Length Needs To Be A Number</h5>');
	else if (Date.parse(startShowing) > Date.parse(endShowing))
		$('#manager-dynamic-3').html("<h5>Premiere Date Must Be Before/On Last Date In Theatres</h5>");
	else {
		movieLen = parseInt(movieLen, 10);
		$.ajax({
			type: 'POST',
			url: '/insertMovie',
			data: {
				'movieName': movieName,
				'movieLen': movieLen,
				'movieLang': movieLang,
				'types': availTypes,
				'startShowing': startShowing,
				'endShowing': endShowing
			},
			success: function (response) {
				$('#manager-dynamic-3').html(response);
			}
		});
	}
}

//update movie
function UpdateMovie() {
	$('#options button').prop('disabled', true);
	$.ajax({
		type: 'GET',
		url: '/getMovieInfo',
		success: function (response) {
			$('#manager-dynamic-2').html(response);
		}
	});
}
function updateMovieFunction(_movieID) {
	movieID = _movieID;
	$('#manager-dynamic-2 button').prop('disabled', true);
	$('#manager-dynamic-3').html('<input type="text" name="newMovieName" placeholder="New Movie Name">');
	$('#manager-dynamic-4').html('<input type="text" name="newMovieLen" placeholder="New Movie Lenght">');
	$('#manager-dynamic-5').html('<input type="text" name="newMovieLanguage" placeholder="New Movie Language">');
	$('#manager-dynamic-6').html('<input type="text" name="newMovieTypes" placeholder="New Movie Types">');
	$('#manager-dynamic-7').html('<input id="datepicker-manager-7" placeholder="New Premiere Date">');
	$('#datepicker-manager-7').pickadate({
		formatSubmit: 'yyyy/mm/dd',
		hiddenName: true,
		onSet: function (event) {
			if (event.select) {
				startShowing = this.get('select', 'yyyy/mm/dd');
			}
		}
	});
	$('#manager-dynamic-8').html('<input id="datepicker-manager-8" placeholder="Last Date In Theatres">');
	$('#datepicker-manager-8').pickadate({
		formatSubmit: 'yyyy/mm/dd',
		hiddenName: true,
		onSet: function (event) {
			if (event.select) {
				endShowing = this.get('select', 'yyyy/mm/dd');
			}
		}
	});
	$('#manager-dynamic-9').html('<button onclick="changeMovieInfo()">Change</button>')
}

function changeMovieInfo() {
	newMovieName = $('#manager-dynamic-3 input')[0].value;
	newMovieLen = $('#manager-dynamic-4 input')[0].value;
	newMovieLanguage = $('#manager-dynamic-5 input')[0].value;
	availTypes = $('[name="newMovieTypes"]')[0].value.toUpperCase().trim();
	types = ($('[name="newMovieTypes"]')[0].value.toUpperCase().trim()).split(' ');
	atleastTypes = ['2D', '3D', '4DX'];
	allTypes = [undefined].concat(atleastTypes);
	if ($('#datepicker-manager-7')[0].value == '' || $('#datepicker-manager-8')[0].value == '' ||
		newMovieName == '' || newMovieLanguage == '' || newMovieLen == '' || $('[name="newMovieTypes"]')[0].value == '')
		$('#manager-dynamic-10').html('<h5>Please Fill In All Fields</h5>');
	else if (!(atleastTypes.includes(types[0]) && allTypes.includes(types[1]) && allTypes.includes(types[2])))
		$('#manager-dynamic-10').html('<h5>Invalid Format For Movie Types</h5>');
	else if (!$.isNumeric(newMovieLen))
		$('#manager-dynamic-10').html('<h5>Movie Length Needs To Be A Number</h5>');
	else if (Date.parse(startShowing) > Date.parse(endShowing))
		$('#manager-dynamic-10').html("<h5>Premiere Date Must Be Before/On Last Date In Theatres</h5>");
	else {
		newMovieLen = parseInt(newMovieLen, 10);
		$.ajax({
				type: 'POST',
				url: '/setNewMovieInfo',
				data: {
					'movieID' : movieID,
					'newMovieName': newMovieName,
					'newMovieLen': newMovieLen,
					'newMovieLanguage': newMovieLanguage,
					'types': availTypes,
					'startShowing': startShowing,
					'endShowing': endShowing
				},
				success: function (response) {
					$('#manager-dynamic-10').html(response);
				}
			});
	}
	
	
	
}
//delete movie function
function DeleteMovie() {
	$('#options button').prop('disabled', true);
	$.ajax({
		type: 'GET',
		url: '/getMovieInfoForDelete',
		success: function (response) {
			$('#manager-dynamic-2').html(response);
		}
	});
}
function deleteMovieFunction(_movieID) {
	movieID = _movieID;
	$('#manager-dynamic-2 button').prop('disabled', true);
	$('#manager-dynamic-3').html('<button onclick="deleteMovieInfo()">Delete</button>')

}
function deleteMovieInfo() {
	$.ajax({
		type: 'POST',
		url: '/deleteMovieInfo',
		data: { 'movieID': movieID },
		success: function (response) {
			$('#manager-dynamic-4').html(response);
		}
	});
}
//search movie function
function SearchMovie() {
	$('#options button').prop('disabled', true);
	$('#manager-dynamic-3').html('<input type="text" name="SearchMovieName" placeholder="Search by name"><button onclick="searchMovieInfo()">Search</button>');

}

function searchMovieInfo() {
	searchMovieName = $('#manager-dynamic-3 input')[0].value;
	$.ajax({
		type: 'POST',
		url: '/searchMovieInfo',
		data: {
			'searchMovieName': searchMovieName
		},
		success: function (response) {
			$('#manager-dynamic-4').html(response);
		}
	});

}