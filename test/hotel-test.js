import { expect } from 'chai';
import { rooms, bookings, customers, credentials } from './sampleData';
import Hotel from '../src/Hotel';

describe('HOTEL CLASS TESTS', function() {
  let hotel, emptyHotel
  beforeEach(() => {
    hotel = new Hotel(rooms, bookings, customers, credentials)
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

  it('Should store all login credentials in an array', () => {
    expect(hotel.credentials).to.deep.equal([credentials[0],credentials[1]]);
  });

  it('That array should be empty by default', () => {
    expect(emptyHotel.credentials).to.deep.equal([]);
  });

  it('Should have an attribute to store the available rooms that is an empty array by default', () => {
    expect(hotel.roomsAvailable).to.deep.equal([]);
  });

  it('Given a date, should show what rooms are available', () => {
    expect(hotel.showAvailableRooms("2020/04/22")).to.deep.equal([rooms[1],rooms[2]]);
    expect(hotel.showAvailableRooms("2020/04/25")).to.deep.equal(rooms);
  });

  it('Given a date not in our format it should return an error', () => {
    expect(hotel.showAvailableRooms("2020/04/22")).to.deep.equal([rooms[1],rooms[2]]);
    expect(hotel.showAvailableRooms("04/22/2020")).to.equal('Bad Date Format');
  });

  it('Given a type, should show the available rooms of the same type', () => {
    hotel.roomsAvailable = rooms;
    expect(hotel.filterRoomsByType("residential suite")).to.deep.equal([rooms[0]]);
    expect(hotel.filterRoomsByType("single room")).to.deep.equal([rooms[2],rooms[3]]);
  });

  it('Given a userID, should update the user\'s .bookings with the rooms they\'ve booked', () => {
    hotel.assignUsersBookings(1)
    hotel.assignUsersBookings(3)
    expect(hotel.customers[0].bookings).to.deep.equal([bookings[0],bookings[1]]);
    expect(hotel.customers[2].bookings).to.deep.equal([bookings[4],bookings[5]]);
  });

  it('Given a userID, should calculate their spending for all the rooms they\'ve booked past/present/future', () => {
    hotel.assignUsersBookings(1)
    hotel.assignUsersBookings(3)
    expect(hotel.calculateUserSpending(1)).to.equal(Math.round((358.4 + 429.44) * 100) / 100);
    expect(hotel.calculateUserSpending(3)).to.equal(Math.round((491.14 + 429.44) * 100) / 100);
  });

  it('Given a username and password that exists in this.credentials, should return true', () => {
    expect(hotel.validateUser('customer50', 'overlook2021')).to.equal(true);
  });

  it('Given a username and password that do no exist in this.credentials, should return false', () => {
    expect(hotel.validateUser('whatever', 'dude')).to.equal(false);
  });
});