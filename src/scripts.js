import './sass/index.scss';
import domUpdates from './domUpdates';
import { fetchApiData, postApiData, deleteApiData } from './apiCalls';
import Hotel from './Hotel';
import Customer from './Customer';
let customersData, roomsData, bookingsData, hotel, currentCustomer

// let postButton = document.querySelector('#postButton');
// postButton.addEventListener('click', createPostObject);

// let deleteButton = document.querySelector('#deleteButton');
// deleteButton.addEventListener('click', deleteBooking);

const previousBookingsSection = document.querySelector('#cards');

let today = new Date();
let todayFormatted = today.getFullYear()+'-'+('0' + (today.getMonth()+1)).slice(-2)+'-'+('0' + today.getDate()).slice(-2);
let inAYearFormatted = (today.getFullYear()+1)+'-'+('0' + (today.getMonth()+1)).slice(-2)+'-'+('0' + today.getDate()).slice(-2);
const datePicker = document.querySelector('input[type="date"]');
datePicker.min = todayFormatted;
datePicker.max = inAYearFormatted;
datePicker.addEventListener('change', (event) => {
  console.log(event.target.value);
});

const roomTypeSelector = document.querySelector('#typeSelect');
roomTypeSelector.addEventListener('change', (event) => {
  console.log(event.target.value);
});

window.addEventListener('load', fetchData);

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
    showTotalSpent()
    showCustomerBookings()
  });
};

function createPostObject() {
  let booking = {
    "userID": 9,
    "date": "2021/04/22",
    "roomNumber": 15,
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
    bookingsData = data;
    instantiateData();
    showTotalSpent()
    showCustomerBookings()
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
  currentCustomer = hotel.customers[0]
}

function showTotalSpent() {

}

function showCustomerBookings() {
  previousBookingsSection.innerHTML = '';
  hotel.assignUsersBookings(currentCustomer.id)
  currentCustomer.bookings.forEach(booking => {
    let matchingRoom = hotel.rooms.find(room => room.number === booking.roomNumber)
    previousBookingsSection.innerHTML +=
    `<acrticle class="card">
      <section class="card-top">
        <figure class="img-gradient">
          <img src="./images/1.jpg">
        </figure>
        <section class="overlay">
          <div>
            <span class="material-icons-outlined md-48 icon">add</span>
          </div>
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
          <dd>$ ${matchingRoom.costPerNight}</dd>
          <dt>Bidet</dt>
          <dd>${matchingRoom.bidet}</dd>
        </dl>
      </section>
    </acrticle>`
  });
};