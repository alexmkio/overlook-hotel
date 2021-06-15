class Hotel {
  constructor(rooms, bookings, customers, credentials) {
    this.rooms = rooms || [];
    this.bookings = bookings || [];
    this.customers = customers || [];
    this.credentials = credentials || [];
    this.roomsAvailable = [];
  }
  checkDateFormat = (date) => {
    let split = date.split('/')
    if (split[0].length !== 4) {
      return 'Bad Date Format'
    }
  }
  returnIndexOfCustomer = (userID) => {
    return this.customers.indexOf(this.customers.find(customer => {
      return customer.id === userID;
    }));
  }
  showAvailableRooms = (date) => {
    if (this.checkDateFormat(date) === 'Bad Date Format') {
      return 'Bad Date Format'
    }
    let unavailableRooms = this.bookings.reduce((newArray, currentBooking) => {
      if (currentBooking.date === date) {
        newArray.push(currentBooking.roomNumber)
      }
      return newArray
    }, [])
    this.roomsAvailable = this.rooms.filter(room => {
      return !unavailableRooms.includes(room.number);
    })
    return this.roomsAvailable
  }
  filterRoomsByType = (type) => {
    return this.roomsAvailable.filter(room => room.roomType === type)
  }
  assignUsersBookings = (userID) => {
    this.customers[this.returnIndexOfCustomer(userID)].bookings = this.bookings.filter(booking => {
      return booking.userID === userID
    })
  }
  findFutureBookings = (userID, date) => {
    return this.customers[this.returnIndexOfCustomer(userID)].bookings.filter(booking => {
      return booking.date >= date
    })
  }
  calculateUserSpending = (userID) => {
    return this.rooms.reduce((acc, currentRoom) => {
      this.customers[this.returnIndexOfCustomer(userID)].bookings.forEach(booking => {
        if (currentRoom.number === booking.roomNumber) {
          acc += currentRoom.costPerNight
        }
      })
      return Math.round(acc * 100) / 100
    }, 0)
  }
  validateUser = (username, password) => {
    if (this.credentials.find(credential => {
      return credential.username === username 
        && credential.password === password
    })) {
      return true
    } else {
      return false
    }
  }
}

export default Hotel;