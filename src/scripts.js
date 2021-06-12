import './sass/index.scss';
import domUpdates from './domUpdates';
import { fetchApiData, postApiData, deleteApiData } from './apiCalls';
import Hotel from './Hotel';
import Customer from './Customer';
let customersData, roomsData, bookingsData, hotel, currentCustomer, lookingForDate

// let postButton = document.querySelector('#postButton');
// postButton.addEventListener('click', createPostObject);

// let deleteButton = document.querySelector('#deleteButton');
// deleteButton.addEventListener('click', deleteBooking);

const loginSection = document.querySelector('#loginSection');
const loginButton = document.querySelector('#loginButton');
const usrname = document.querySelector('#usrname');
const psw = document.querySelector('#psw');
const customerBookingsSection = document.querySelector('#customerBookings');
const availableRoomsSection = document.querySelector('#availableRoomsSection');
const previousBookingsSection = document.querySelector('#bookedRooms');
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
      console.log(currentCustomer)
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
  });
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
      renderSuccessfulPost();
    }
  })
  .catch(error => {
    showPostMessage('fail', error)
  })
}

function deleteBooking() {
  deleteApiData('5fwrgu4i7k55hl6sz')
  .then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    } else {
      renderSuccessfulPost();
    }
  })
  .catch(error => {
    showPostMessage('fail', error)
  })
}

function renderSuccessfulPost() {
  showPostMessage('success')
  fetchApiData('bookings')
  .then((data) => {
    bookingsData = data.bookings;
    instantiateData();
    updateCustomerBookings()
  })
}

function showPostMessage(status, responseStatus) {
  if (status === 'fail') {
    console.log('RESPONSECODE', responseStatus)
  }
  console.log('STATUS', status)
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
  hide(availableRoomsSection)
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
}

function checkIfNoRooms(rooms, type) {
  if (rooms) {
    showAvailableRooms(rooms)
  } else {
    showErrorMsg(type)
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

function showErrorMsg(type) {
 console.log(type)
}

function hide(e) {
  e.classList.add('hide');
};

function show(e) {
  e.classList.remove('hide');
};