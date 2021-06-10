import './sass/index.scss';
import domUpdates from './domUpdates';
import { fetchApiData } from './apiCalls';
// import { fetchApiData, postApiData } from './apiCalls';
// import Hotel from './Hotel';
// import Customer from './Customer';
let customersData, roomsData, bookingsData, hotel



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