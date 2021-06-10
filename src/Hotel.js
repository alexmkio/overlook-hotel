class Hotel {
  constructor(rooms, bookings, customers) {
    this.rooms = rooms || [];
    this.bookings = bookings || [];
    this.customers = customers || [];
    this.roomsAvailable = [];
  }
  checkDateFormat(date) {

  }
  returnIndexOfUser(userID) {
    return this.customers.indexOf(this.customers.find(customer => customer.id === userID));
  }
  showAvailableRooms(date) {
    let unavailableRooms = this.bookings.reduce((newArray, currentBooking) => {
      if (currentBooking.date === date) {
        newArray.push(currentBooking.roomNumber)
      }
      return newArray
    },[])
    this.roomsAvailable = this.rooms.filter(room => !unavailableRooms.includes(room.number))
    return this.roomsAvailable
  }
  filterRoomsByType(type) {
    return this.roomsAvailable.filter(room => room.roomType === type)
  }
  assignUsersBookings(userID) {
    this.customers[this.returnIndexOfUser(userID)].bookings = this.bookings.filter(booking => {
      return booking.userID === userID
    })
  }
  calculateUserSpending(userID) {

  }
}

export default Hotel;