import './sass/index.scss';
import domUpdates from './domUpdates';
import { fetchApiData } from './apiCalls';
// import { fetchApiData, postApiData } from './apiCalls';
// import Hotel from './Hotel';
// import Customer from './Customer';



window.addEventListener('load', fetchData);

function getData() {
  return Promise.all([fetchApiData('customers'), fetchApiData('rooms'), fetchApiData('bookings')]);
}

function fetchData() {
  getData()
  .then((promiseArray) => {
    // userData = promiseArray[0].userData;
    // sleepData = promiseArray[1].sleepData;
    // activityData = promiseArray[2].activityData;
    // hydrationData = promiseArray[3].hydrationData;
    // instantiateData()
    // populateDOM()
  });
};

// function instantiateData() {
//   let usersData = userData.map(user => {
//     return new User(user);
//   });
//   userRepository = new UserRepository(usersData, sleepData, activityData, hydrationData);

//   userRepository.updateUsersSleep();
//   userRepository.updateUsersActivity();
//   userRepository.updateUsersHydration();
//   user = userRepository.users[0];
//   user.findTrendingStepDays();
//   user.findTrendingStairsDays();
//   user.findFriendsNames(userRepository.users);
// }