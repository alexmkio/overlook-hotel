import './sass/index.scss';
import domUpdates from './domUpdates';
import { fetchApiData, postApiData, deleteApiData } from './apiCalls';
import Hotel from './Hotel';
import Customer from './Customer';
let customersData, roomsData, bookingsData, hotel, currentCustomer, lookingForDate

const filterSection = document.querySelector('#filterSection');
const loginSection = document.querySelector('#loginSection');
const loginButton = document.querySelector('#loginButton');
const usrname = document.querySelector('#usrname');
const psw = document.querySelector('#psw');
const customerBookingsSection = document.querySelector('#customerBookings');
const availableRoomsSection = document.querySelector('#availableRoomsSection');
const previousBookingsSection = document.querySelector('#bookedRooms');
const messageSection = document.querySelector('#messageSection');
const message = document.querySelector('#message');
const availableRoomsCards = document.querySelector('#availableRoomsCards');
const totalSpent = document.querySelector('#totalSpent');
const roomsAvailableFor = document.querySelector('#roomsAvailableFor');

let today = new Date();
let todayFormatted = today.getFullYear()+'-'+('0' + (today.getMonth()+1)).slice(-2)+'-'+('0' + today.getDate()).slice(-2);
let inAYearFormatted = (today.getFullYear()+1)+'-'+('0' + (today.getMonth()+1)).slice(-2)+'-'+('0' + today.getDate()).slice(-2);
const datePicker = document.querySelector('input[type="date"]');
datePicker.min = todayFormatted;
datePicker.max = inAYearFormatted;
datePicker.addEventListener('change', function(event) { setDateLookingForRoom(event) });

const roomTypeSelector = document.querySelector('#typeSelect');
roomTypeSelector.addEventListener('change', function(event) { filterAvailableRooms(event) });

availableRoomsCards.addEventListener('click', function(event) {
  if (event.target.id > 0 && event.target.id <= 25) {
    createPostObject(event.target.id)
  }
});

loginButton.addEventListener('click', function(event) { determineUser(event) });

window.addEventListener('load', fetchData);

function determineUser(event) {
  event.preventDefault()
  if (usrname.value.startsWith('customer')) {
    let customerID = parseInt(usrname.value.slice(-2))
    let customerIndex = hotel.returnIndexOfUser(customerID)
    if (validatePassword(psw.value)) {
      currentCustomer = hotel.customers[customerIndex]
      updateCustomerBookings()
    }
  }
  if (usrname.value === 'manager') {
    // it4
  }
  usrname.value = '';
  psw.value = '';
}

function validatePassword(password, userType, ID) {
  if (password === 'overlook2021') {
    return true
  } else {
    showMsg('password')
    return false
  }
}

function getData() {
  return Promise.all([fetchApiData('customers'), fetchApiData('rooms'), fetchApiData('bookings')]);
}

function fetchData() {
  getData()
  .then((promiseArray) => {
    customersData = promiseArray[0].customers;
    roomsData = promiseArray[1].rooms;
    bookingsData = promiseArray[2].bookings;
    instantiateData()
    })
  .catch(error => {
    showMsg('fail', error)
  })
};

function createPostObject(roomNum) {
  let booking = {
    "userID": currentCustomer.id,
    "date": lookingForDate,
    "roomNumber": parseInt(roomNum),
  }
  postData(booking)
}

function postData(postObject) {
  postApiData(postObject)
  .then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    } else {
      renderSuccessfulPost('booking');
    }
  })
  .catch(error => {
    showMsg('fail', error)
  })
}

function deleteBooking() {
  deleteApiData('5fwrgu4i7k55hl6sz')
  .then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    } else {
      renderSuccessfulPost('deleting');
    }
  })
  .catch(error => {
    showMsg('fail', error)
  })
}

function renderSuccessfulPost(type) {
  showMsg(type)
  fetchApiData('bookings')
  .then((data) => {
    bookingsData = data.bookings;
    instantiateData();
    setTimeout(() => { updateCustomerBookings() }, 4000);
  })
}

function instantiateData() {
  let instantiationsOfCustomer = customersData.map(customer => {
    return new Customer(customer);
  });
  hotel = new Hotel(roomsData, bookingsData, instantiationsOfCustomer);
}

function updateCustomerBookings() {
  hotel.assignUsersBookings(currentCustomer.id)
  showTotalSpent()
  showCustomerBookings()
}

function showTotalSpent() {
  totalSpent.innerText = hotel.calculateUserSpending(currentCustomer.id)
}

function showCustomerBookings() {
  show(filterSection)
  hide(loginSection)
  hide(availableRoomsSection)
  hide(messageSection)
  show(customerBookingsSection)
  previousBookingsSection.innerHTML = '';
  currentCustomer.bookings.forEach(booking => {
    let matchingRoom = hotel.rooms.find(room => room.number === booking.roomNumber)
    previousBookingsSection.innerHTML +=
    `<acrticle class="card">
      <section class="card-top">
        <figure class="img-gradient">
          <img src="./images/1.jpg">
        </figure>
        <section class="overlay">
          <dl class="room">
            <dt>Room #</dt>
            <dd>${booking.roomNumber}</dd>
          </dl>
        </section>
      </section>
      <section class="card-content">
        <dl>
          <dt>Room Type</dt>
          <dd>${matchingRoom.roomType}</dd>
          <dt>Bed Size and Quantity</dt>
          <dd>${matchingRoom.numBeds} ${matchingRoom.bedSize}</dd>
        </dl>
        <section class="link">
          <dl>
            <dt>Booked For: </dt>
            <dd>${booking.date}</dd>
          </dl>
        </section>
        <dl>
          <dt>Cost per night</dt>
          <dd>$${matchingRoom.costPerNight}</dd>
          <dt>Bidet</dt>
          <dd>${matchingRoom.bidet}</dd>
        </dl>
      </section>
    </acrticle>`
  });
};

function setDateLookingForRoom(event) {
  lookingForDate = event.target.value.replaceAll('-', '/')
  datePicker.value = ''
  getAvailableRooms()
}

function getAvailableRooms() {
  let availableRooms = hotel.showAvailableRooms(lookingForDate)
  checkIfNoRooms(availableRooms, 'date')
}

function filterAvailableRooms(event) {
  if (event.target.value === 'all') {
    getAvailableRooms()
  } else {
    let filteredRooms = hotel.filterRoomsByType(event.target.value)
    checkIfNoRooms(filteredRooms, 'filter')
  }
  roomTypeSelector.selectedIndex = 0;
}

function checkIfNoRooms(rooms, type) {
  if (rooms.length) {
    showAvailableRooms(rooms)
  } else {
    showMsg(type)
  }
}

function showAvailableRooms(rooms) {
  hide(customerBookingsSection)
  show(availableRoomsSection)
  roomsAvailableFor.innerText = `Available rooms for ${lookingForDate}`
  availableRoomsCards.innerHTML = '';
  rooms.forEach(room => {
    availableRoomsCards.innerHTML +=
    `<acrticle class="card">
      <section class="card-top">
        <figure class="img-gradient">
          <img src="./images/1.jpg">
        </figure>
        <section class="overlay">
          <div>
            <span class="material-icons-outlined md-48 icon" id="${room.number}">add</span>
          </div>
          <dl class="room">
            <dt>Room #</dt>
            <dd>${room.number}</dd>
          </dl>
        </section>
      </section>
      <section class="card-content">
        <dl>
          <dt>Room Type</dt>
          <dd>${room.roomType}</dd>
          <dt>Bed Size and Quantity</dt>
          <dd>${room.numBeds} ${room.bedSize}</dd>
        </dl>
        <dl>
          <dt>Cost per night</dt>
          <dd>$${room.costPerNight}</dd>
          <dt>Bidet</dt>
          <dd>${room.bidet}</dd>
        </dl>
      </section>
    </acrticle>`
  })
}

function showMsg(type, responseStatus) {
  hide(filterSection)
  hide(loginSection)
  hide(customerBookingsSection)
  hide(availableRoomsSection)
  show(messageSection)
  if (type === 'password') {
    message.innerHTML = `<p>Sorry, your username and password do not match anything in our system</p><p>Try again.</p>`
    setTimeout(() => {
      hide(messageSection)
      show(loginSection)
    }, 4000);
  }
  if (type === 'fail') {
    message.innerHTML = `<p>Sorry, we are experiencing this error: ${responseStatus.message}</p><p>Try again by clicking <a href="./">here</a>.</p>`
  }
  if (type === 'date') {
    message.innerHTML = `<p>Sorry ${currentCustomer.name}, there aren't any rooms available on ${lookingForDate}.</p><p>Please adjust your search criteria!</p>`
    setTimeout(() => { updateCustomerBookings() }, 4000);
  }
  if (type === 'filter') {
    message.innerHTML = `<p>Sorry ${currentCustomer.name}, there aren't any rooms available on ${lookingForDate} in that type.</p><p>Please adjust your search criteria!</p>`
    setTimeout(() => { getAvailableRooms() }, 4000);
  }
  if (type === 'booking') {
    message.innerHTML = `<p>Your room has been booked!</p><p>Thank you ${currentCustomer.name}.</p>`
    setTimeout(() => { updateCustomerBookings() }, 4000);
  }
  if (type === 'deleting') {
    message.innerHTML = `<p>We have removed that booking!</p><p>Looking for something else ${currentCustomer.name}?</p>`
    setTimeout(() => { updateCustomerBookings() }, 4000);
  }
}

function hide(e) {
  e.classList.add('hide');
};

function show(e) {
  e.classList.remove('hide');
};