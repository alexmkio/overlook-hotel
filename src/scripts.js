import './sass/index.scss';
// import domUpdates from './domUpdates';
// import { fetchApiData, postApiData } from './apiCalls';
import '../src/images/1.jpg';
// const image = document.querySelector('.img-gradient');
// image.innerHTML = <img src="../src/images/1.jpg"></img>

const hamburger = document.querySelector('#hamburger');
hamburger.addEventListener('click', animateBurger);

const nav = document.querySelector('nav');

const navLink = document.querySelectorAll(".active");
navLink.forEach(n => n.addEventListener("click", closeMenu));

function animateBurger() {
  hamburger.classList.toggle("change");
  nav.classList.toggle("active");
}

function closeMenu() {
  hamburger.classList.remove("change");
  nav.classList.remove("active");
}