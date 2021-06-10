import './sass/index.scss';
import domUpdates from './domUpdates';
import { fetchApiData, postApiData } from './apiCalls';
// import Hotel from './Hotel';
// import Customer from './Customer';
let customersData, roomsData, bookingsData, hotel

let submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', createPostObject);

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
    // instantiateData()
    // populateDOM()
  });
};

// function instantiateData() {
//   let instantiationsOfCustomer = customersData.map(customer => {
//     return new Customer(customer);
//   });
//   hotel = new Hotel(instantiationsOfCustomer, sleepData, activityData, hydrationData);
// }

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

function renderSuccessfulPost() {
  showPostMessage('success')
  fetchApiData('bookings')
  .then((data) => {
    bookingsData = data;
    // instantiateData();
    // populateDOM();
  })
}

function showPostMessage(status, responseStatus) {
  if (status === 'fail') {
    console.log('RESPONSECODE', responseStatus)
  }
  console.log('STATUS', status)
}