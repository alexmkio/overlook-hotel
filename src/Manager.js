class Manager {
  constructor(hotel) {
    this.myHotel = hotel || [];
  }
  showRoomsLeft = (date) => {
    return this.myHotel.showAvailableRooms(date).length
  }
}

export default Manager;