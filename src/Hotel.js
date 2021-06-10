class Hotel {
  constructor(rooms, bookings, customers) {
    this.rooms = rooms || [];
    this.bookings = bookings || [];
    this.customers = customers || [];
    this.roomsAvailable = [];
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

  }
  assignUsersBookings(userID) {

  }
  calculateUserSpending(userID) {

  }
}

export default Hotel;