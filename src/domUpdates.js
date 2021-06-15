let domUpdates = {

  resetLogin() {
    usrname.value = '';
    psw.value = '';
  },

  resetCalendar() {
    datePicker.value = ''
  },

  showTotalSpent(amount) {
    totalSpent.innerText = amount;
  },

  showCustomerBookings(customer, hotel, customerBookingsSection, previousBookingsSection) {
    domUpdates.show(filterSection)
    domUpdates.hide(loginSection)
    domUpdates.hide(availableRoomsSection)
    domUpdates.hide(messageSection)
    domUpdates.show(customerBookingsSection)
    previousBookingsSection.innerHTML = '';
    customer.bookings.forEach(booking => {
      let matchingRoom = hotel.rooms.find(room => {
        return room.number === booking.roomNumber
      })
      previousBookingsSection.innerHTML +=
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
  },

  showAvailableRooms(rooms, customerBookingsSection, lookingForDate) {
    domUpdates.hide(customerBookingsSection)
    domUpdates.show(availableRoomsSection)
    domUpdates.show(availableRoomsSection)
    roomsAvailableFor.innerHTML = `<h2>Available rooms for ${lookingForDate}</h2>`
    availableRoomsCards.innerHTML = '';
    rooms.forEach(room => {
      availableRoomsCards.innerHTML +=
      `<acrticle class="card">
        <dl>
          <dt>Room Type</dt>
          <dd>${room.roomType}</dd>
          <dt>Bed Size and Quantity</dt>
          <dd>${room.numBeds} ${room.bedSize}</dd>
        </dl>
        <section class="link">
          <dl>
            <dt>Room #</dt>
            <dd>${room.number}</dd>
          </dl>
        </section>
        <dl>
          <dt>Cost per night</dt>
          <dd>$${room.costPerNight}</dd>
          <dt>Bidet</dt>
          <dd>${room.bidet}</dd>
        </dl>
        <span class="material-icons-outlined md-48 icon" id="${room.number}">
          add
        </span>
      </acrticle>`
    })
  },

  showMsg(customerBookingsSection, currentCustomer, lookingForDate, type, responseStatus) {
    domUpdates.hide(filterSection)
    domUpdates.hide(loginSection)
    domUpdates.hide(customerBookingsSection)
    domUpdates.hide(availableRoomsSection)
    domUpdates.show(messageSection)
    if (type === 'password') {
      message.innerHTML =
        `<p>
          Sorry, your username and password do not match anything in our system
        </p>
        <p>Try again.</p>`
      setTimeout(() => {
        domUpdates.hide(messageSection)
        domUpdates.show(loginSection)
      }, 4000);
    }
    if (type === 'fail') {
      message.innerHTML =
        `<p>Sorry, we are experiencing this error: ${responseStatus.message}</p>
        <p>Try again by clicking <a href="./">here</a>.</p>`
    }
    if (type === 'date') {
      message.innerHTML =
        `<p>Sorry ${currentCustomer.name}, 
          there aren't any rooms available on ${lookingForDate}.</p>
        <p>Please adjust your search criteria!</p>`
    }
    if (type === 'filter') {
      message.innerHTML =
        `<p>Sorry ${currentCustomer.name},
          there aren't any rooms available on ${lookingForDate} in that type.</p>
        <p>Please adjust your search criteria!</p>`
    }
    if (type === 'booking') {
      message.innerHTML =
        `<p>Your room has been booked!</p>
        <p>Thank you ${currentCustomer.name}.</p>`
    }
    if (type === 'deleting') {
      message.innerHTML =
        `<p>We have removed that booking!</p>
        <p>Looking for something else ${currentCustomer.name}?</p>`
    }
  },

  hide(e) {
    e.classList.add('hide');
  },
  
  show(e) {
    e.classList.remove('hide');
  },

}

export default domUpdates;