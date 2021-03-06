class Manager {
  constructor(hotel) {
    this.myHotel = hotel || [];
  }
  showRoomsLeft = (date) => {
    return this.myHotel.showAvailableRooms(date).length
  }
  calculatePercentageOccupied = (date) => {
    return Math.round(((this.myHotel.rooms.length - this.showRoomsLeft(date)) 
      / this.myHotel.rooms.length) * 100) * 100 / 100
  }
  findBookedRooms = (date) => {
    return this.myHotel.rooms.reduce((newArray, room) => {
      this.myHotel.bookings.forEach(booking => {
        if (booking.date === date && booking.roomNumber === room.number) {
          newArray.push(room)
        }
      })
      return newArray
    }, [])
  }
  getTotalRevenue = (date) => {
    return this.findBookedRooms(date).reduce((acc, currentRoom) => {
      return Math.round((acc += currentRoom.costPerNight) * 100) / 100
    }, 0)
  }
  getIndexOfCustomer = (customerName) => {
    return this.myHotel.customers.indexOf(this.myHotel.customers.find(customer => {
      return customer.name === customerName;
    }));
  }
}

export default Manager;