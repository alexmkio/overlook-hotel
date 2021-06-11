import './sass/index.scss';

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