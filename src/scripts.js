import './sass/index.scss';
// import domUpdates from './domUpdates';
// import { fetchApiData, postApiData } from './apiCalls';
// const dayjs = require('dayjs')

var today = new Date();
var todayFormatted = today.getFullYear()+'-'+('0' + (today.getMonth()+1)).slice(-2)+'-'+('0' + today.getDate()).slice(-2);
var inAYearFormatted = (today.getFullYear()+1)+'-'+('0' + (today.getMonth()+1)).slice(-2)+'-'+('0' + today.getDate()).slice(-2);
var dateControl = document.querySelector('input[type="date"]');
dateControl.min = todayFormatted;
dateControl.max = inAYearFormatted;