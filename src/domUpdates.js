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
    domUpdates.hide(managerSection)
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
        <button class="material-icons-outlined md-48 icon" id="${room.number}">
          add
        </button>
      </acrticle>`
    })
  },

  showManagerDashboard(manager, todayFormatted) {
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
  },

  updateCustomerInfo(currentCustomer, hotel, todayFormatted) {
    domUpdates.hide(messageSection)
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
      domUpdates.updateFutureBookingsSection(currentCustomer, hotel, todayFormatted)
      domUpdates.updatePreviouslyBookedSection(currentCustomer, hotel, todayFormatted)
    cstName.value = ''
  },

  updateFutureBookingsSection(currentCustomer, hotel, todayFormatted) {
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
  },

  updatePreviouslyBookedSection(currentCustomer, hotel, todayFormatted) {
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
  },



  showMsg(customerBookingsSection, currentCustomer, lookingForDate, type, responseStatus) {
    domUpdates.hide(filterSection)
    domUpdates.hide(loginSection)
    domUpdates.hide(customerBookingsSection)
    domUpdates.hide(availableRoomsSection)
    domUpdates.hide(managerSection)
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
        `<p>That room has been booked for ${currentCustomer.name}.</p>
        <p>Thank you!</p>`
    }
    if (type === 'deleting') {
      message.innerHTML =
        `<p>We have removed that booking!</p>
        <p>Is ${currentCustomer.name} looking for something else?</p>`
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