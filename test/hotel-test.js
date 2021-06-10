import { expect } from 'chai';
import { rooms, bookings, customers } from './sampleData';
import Hotel from '../src/Hotel';

describe('HOTEL CLASS TESTS', function() {
  let hotel, emptyHotel
  beforeEach(() => {
    hotel = new Hotel(rooms, bookings, customers)
    emptyHotel = new Hotel()
  });
  
  it('Should be a function', () => {
    expect(Hotel).to.be.a('function');
  });

  it('Should store all of the rooms in an array', () => {
    expect(hotel.rooms).to.deep.equal([rooms[0],rooms[1],rooms[2],rooms[3]]);
  });

  it('That array should be empty by default', () => {
    expect(emptyHotel.rooms).to.deep.equal([]);
  });

  it('Should store all of the bookings in an array', () => {
    expect(hotel.bookings).to.deep.equal([bookings[0],bookings[1],bookings[2],bookings[3],bookings[4],bookings[5]]);
  });

  it('That array should be empty by default', () => {
    expect(emptyHotel.bookings).to.deep.equal([]);
  });

  it('Should store all of the customers in an array', () => {
    expect(hotel.customers).to.deep.equal([customers[0],customers[1],customers[2]]);
  });

  it('That array should be empty by default', () => {
    expect(emptyHotel.customers).to.deep.equal([]);
  });

  it('Should have an attribute to store the available rooms that is an empty array by default', () => {
    expect(hotel.roomsAvailable).to.deep.equal([]);
  });

  it('Given a date, should show what rooms are available', () => {
    expect(hotel.showAvailableRooms("2020/04/22")).to.deep.equal([rooms[1],rooms[2]]);
    expect(hotel.showAvailableRooms("2020/04/25")).to.deep.equal(rooms);
  });

  // it('Given a date not in our format it should return an error', () => {
  //   expect(hotel.showAvailableRooms("2020/04/22")).to.deep.equal([rooms[1],rooms[2]]);
  //   expect(hotel.showAvailableRooms("2020/04/25")).to.deep.equal(rooms);
  // });

  });