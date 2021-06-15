import './sass/index.scss';
import domUpdates from './domUpdates';
import { getApiData, postApiData, deleteApiData } from './apiCalls';
import Customer from './Customer';
import Hotel from './Hotel';
import Manager from './Manager';
import { credentials } from './data/credentials'
let customersData, roomsData, bookingsData, 
  hotel, manager, currentCustomer, lookingForDate, managerIn

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
const managerSection = document.querySelector('#managerSection');
const cstName = document.querySelector('#cstName');
const customerSearchButton = document.querySelector('#customerSearchButton');
const statsSection = document.querySelector('#statsSection');
const foundCustomerSection = document.querySelector('#foundCustomerSection');
const futureBookingsHeader = document.querySelector('#futureBookingsHeader');
const futureBookingsSection = document.querySelector('#futureBookingsSection');
const previouslyBookedHeader = document.querySelector('#previouslyBookedHeader');
const previouslyBookedSection = document.querySelector('#previouslyBookedSection');
const datePickerHeader = document.querySelector('#datePickerHeader');

let today = new Date();
let todayForPicker = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
let inAYearForPicker = (today.getFullYear() + 1) + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
const datePicker = document.querySelector('input[type="date"]');
datePicker.min = todayForPicker;
datePicker.max = inAYearForPicker;
let todayFormatted = todayForPicker.replaceAll('-', '/')

const determineUser = (event) => {
  event.preventDefault()
  if (!hotel.validateUser(usrname.value, psw.value)) {
    domUpdates.showMsg(customerBookingsSection, currentCustomer, lookingForDate, 'password')
    domUpdates.resetLogin()
    return
  }
  if (usrname.value.startsWith('customer')) {
    let customerID = parseInt(usrname.value.slice(-2))
    let customerIndex = hotel.returnIndexOfCustomer(customerID)
    currentCustomer = hotel.customers[customerIndex]
    updateCustomerBookings()
  }
  if (usrname.value === 'manager') {
    managerIn = true
    showManagerDashboard()
  }
  domUpdates.resetLogin()
}

const getData = () => {
  return Promise.all([
    getApiData('customers'), 
    getApiData('rooms'),
    getApiData('bookings')
  ]);
}

const fetchData = () => {
  getData()
    .then((promiseArray) => {
      customersData = promiseArray[0].customers;
      roomsData = promiseArray[1].rooms;
      bookingsData = promiseArray[2].bookings;
      instantiateData()
    })
    .catch(error => {
      domUpdates.showMsg(customerBookingsSection, currentCustomer, lookingForDate, 'fail', error)
    })
}

const createPostObject = (roomNum) => {
  let booking = {
    "userID": currentCustomer.id,
    "date": lookingForDate,
    "roomNumber": parseInt(roomNum),
  }
  postData(booking)
}

const postData = (postObject) => {
  postApiData(postObject)
    .then(response => checkForError(response, 'booking'))
    .catch(error => {
      domUpdates.showMsg(customerBookingsSection, currentCustomer, lookingForDate, 'fail', error)
      timeout(updateCustomerBookings)
    })
}

const deleteBooking = (bookingID) => {
  deleteApiData(bookingID)
    .then(response => checkForError(response, 'deleting'))
    .catch(error => {
      domUpdates.showMsg(customerBookingsSection, currentCustomer, lookingForDate, 'fail', error)
      timeout(domUpdates.show(managerSection))
    })
}

const checkForError = (response, whatFor) => {
  if (response.ok) {
    domUpdates.showMsg(customerBookingsSection, currentCustomer, lookingForDate, whatFor)
  }
  if (response.ok && whatFor === 'booking') {
    renderSuccessfulPost(whatFor)
  } else if (response.ok && whatFor === 'deleting') {
    fetchData()
    setTimeout(() => {
      updateCustomerInfo()
      showManagerDashboard()
    }, 4000);
  } else {
    throw Error(response.statusText);
  }
}

const renderSuccessfulPost = (type) => {
  getApiData('bookings')
    .then((data) => {
      bookingsData = data.bookings;
      instantiateData();
      timeout(updateCustomerBookings)
    })
}

const instantiateData = () => {
  let instantiationsOfCustomer = customersData.map(customer => {
    return new Customer(customer);
  });
  hotel = new Hotel(
    roomsData, 
    bookingsData, 
    instantiationsOfCustomer, 
    credentials
  );
  manager = new Manager(hotel);
}

const updateCustomerBookings = () => {
  hotel.assignUsersBookings(currentCustomer.id)
  if (!managerIn) {
    domUpdates.showTotalSpent(hotel.calculateUserSpending(currentCustomer.id))
    domUpdates.showCustomerBookings(currentCustomer, hotel, customerBookingsSection, previousBookingsSection)
  } else {
    showManagerDashboard()
    updateCustomerInfo()
  }
}

const setDateLookingForRoom = (event) => {
  lookingForDate = event.target.value.replaceAll('-', '/')
  domUpdates.resetCalendar()
  getAvailableRooms()
}

const getAvailableRooms = () => {
  domUpdates.hide(messageSection)
  domUpdates.show(filterSection)
  let availableRooms = hotel.showAvailableRooms(lookingForDate)
  checkIfNoRooms(availableRooms, 'date', updateCustomerBookings)
}

const filterAvailableRooms = (event) => {
  if (event.target.value === 'all') {
    getAvailableRooms()
  } else {
    let filteredRooms = hotel.filterRoomsByType(event.target.value)
    checkIfNoRooms(filteredRooms, 'filter', getAvailableRooms)
  }
  roomTypeSelector.selectedIndex = 0;
}

const checkIfNoRooms = (rooms, type, param) => {
  if (rooms.length) {
    domUpdates.showAvailableRooms(rooms, customerBookingsSection, lookingForDate)
  } else {
    domUpdates.showMsg(customerBookingsSection, currentCustomer, lookingForDate, type)
    timeout(param)
  }
}

const timeout = (param) => {
  setTimeout(() => {
      param()
    }, 4000);
}

function showManagerDashboard() {
  domUpdates.hide(loginSection)
  domUpdates.show(managerSection)
  statsSection.innerHTML = ''
  statsSection.innerHTML = `
    <dl>
      <dt>Total Rooms Available for today’s date</dt>
      <dd>${manager.showRoomsLeft(todayFormatted)}</dd>
      <dt>Total revenue for today’s date</dt>
      <dd>$${manager.getTotalRevenue(todayFormatted)}</dd>
      <dt>Percentage of rooms occupied for today’s date</dt>
      <dd>${manager.calculatePercentageOccupied(todayFormatted)}%</dd>
    </dl>`
}

function assignCurrentCustomer(event) {
  event.preventDefault()
  currentCustomer = hotel.customers[manager.getIndexOfCustomer(cstName.value)]
  updateCustomerInfo()
}

function updateCustomerInfo() {
  hotel.assignUsersBookings(currentCustomer.id)
  domUpdates.show(filterSection)
  datePickerHeader.innerHTML = ''
  datePickerHeader.innerHTML = `Find a room for ${currentCustomer.name}`
  foundCustomerSection.innerHTML = ''
  foundCustomerSection.innerHTML = `
    <dl>
      <dt>Customer's Name:</dt>
      <dd>${currentCustomer.name}</dd>
      <dt>Total amount they've spent:</dt>
      <dd>$${hotel.calculateUserSpending(currentCustomer.id)}</dd>
    </dl>`
  updateFutureBookingsSection()
  updatePreviouslyBookedSection()
  cstName.value = ''
}

function updateFutureBookingsSection() {
  if (hotel.findFutureBookings(currentCustomer.id, todayFormatted).length) {
    futureBookingsHeader.innerHTML = ''
    futureBookingsHeader.innerHTML = '<h2>Their upcoming bookings</h2>'
    futureBookingsSection.innerHTML = '';
    hotel.findFutureBookings(currentCustomer.id, todayFormatted).forEach(booking => {
      let matchingRoom = hotel.rooms.find(room => {
        return room.number === booking.roomNumber
      })
      futureBookingsSection.innerHTML +=
      `<acrticle class="card">
        <dl>
          <dt>Room Type</dt>
          <dd>${matchingRoom.roomType}</dd>
          <dt>Bed Size and Quantity</dt>
          <dd>${matchingRoom.numBeds} ${matchingRoom.bedSize}</dd>
        </dl>
        <section class="link">
          <dl>
            <dt>Room #</dt>
            <dd>${booking.roomNumber}</dd>
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
        <button class="material-icons-outlined md-48 icon" id="${booking.id}">
          delete
        </button>
      </acrticle>`
    });
  }
}

function updatePreviouslyBookedSection() {
  if (hotel.findPastBookings(currentCustomer.id, todayFormatted).length) {
    previouslyBookedHeader.innerHTML = '<h2>Their previous bookings</h2>'
    previouslyBookedSection.innerHTML = '';
    hotel.findPastBookings(currentCustomer.id, todayFormatted).forEach(booking => {
      let matchingRoom = hotel.rooms.find(room => {
        return room.number === booking.roomNumber
      })
      previouslyBookedSection.innerHTML +=
      `<acrticle class="card">
        <dl>
          <dt>Room Type</dt>
          <dd>${matchingRoom.roomType}</dd>
          <dt>Bed Size and Quantity</dt>
          <dd>${matchingRoom.numBeds} ${matchingRoom.bedSize}</dd>
        </dl>
        <section class="link">
          <dl>
            <dt>Room #</dt>
            <dd>${booking.roomNumber}</dd>
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
      </acrticle>`
    });
  }
}

datePicker.addEventListener('change', function(event) {
  setDateLookingForRoom(event)
});

const roomTypeSelector = document.querySelector('#typeSelect');
roomTypeSelector.addEventListener('change', function(event) {
  filterAvailableRooms(event)
});

availableRoomsCards.addEventListener('click', function(event) {
  if (event.target.id > 0 && event.target.id <= 25) {
    createPostObject(event.target.id)
  }
});

loginButton.addEventListener('click', function(event) {
  determineUser(event)
});

customerSearchButton.addEventListener('click', function(event) {
  assignCurrentCustomer(event)
});


futureBookingsSection.addEventListener('click', function(event) {
  deleteBooking(event.target.id)
});

window.addEventListener('load', fetchData);