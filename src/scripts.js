import './sass/index.scss';
import domUpdates from './domUpdates';
import { getApiData, postApiData, deleteApiData } from './apiCalls';
import Hotel from './Hotel';
import Customer from './Customer';
import { credentials } from './data/credentials'
let customersData, roomsData, bookingsData, 
  hotel, currentCustomer, lookingForDate

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
let todayFormatted = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
let inAYearFormatted = (today.getFullYear() + 1) + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
const datePicker = document.querySelector('input[type="date"]');
datePicker.min = todayFormatted;
datePicker.max = inAYearFormatted;

const determineUser = (event) => {
  event.preventDefault()
  if (!hotel.validateUser(usrname.value, psw.value)) {
    domUpdates.showMsg(customerBookingsSection, currentCustomer, lookingForDate, 'password')
    domUpdates.resetLogin()
    return
  }
  if (usrname.value.startsWith('customer')) {
    let customerID = parseInt(usrname.value.slice(-2))
    let customerIndex = hotel.returnIndexOfUser(customerID)
    currentCustomer = hotel.customers[customerIndex]
    updateCustomerBookings()
  }
  if (usrname.value === 'manager') {
    // it4
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

const deleteBooking = () => {
  deleteApiData('5fwrgu4i7k55hl6sz')
    .then(response => checkForError(response, 'deleting'))
    .catch(error => {
      domUpdates.showMsg(customerBookingsSection, currentCustomer, lookingForDate, 'fail', error)
      timeout(updateCustomerBookings)
    })
}

const checkForError = (response, whatFor) => {
  if (!response.ok) {
    throw Error(response.statusText);
  } else {
    renderSuccessfulPost(whatFor)
  }
}

const renderSuccessfulPost = (type) => {
  domUpdates.showMsg(customerBookingsSection, currentCustomer, lookingForDate, type)
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
}

const updateCustomerBookings = () => {
  hotel.assignUsersBookings(currentCustomer.id)
  domUpdates.showTotalSpent(hotel.calculateUserSpending(currentCustomer.id))
  domUpdates.showCustomerBookings(currentCustomer, hotel, customerBookingsSection, previousBookingsSection)
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

window.addEventListener('load', fetchData);