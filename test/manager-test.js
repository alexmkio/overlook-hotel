import { expect } from 'chai';
import { rooms, bookings, customers, credentials } from './sampleData';
import Hotel from '../src/Hotel';
import Manager from '../src/Manager';

describe('MANAGER CLASS TESTS', function() {
  let hotel, manager, emptyManager
  beforeEach(() => {
    hotel = new Hotel(rooms, bookings, customers, credentials)
    manager = new Manager(hotel)
    emptyManager = new Manager()
  });
  
  it('Should be a function', () => {
    expect(Manager).to.be.a('function');
  });

  it('Should store the manager\'s assigned hotel in an array', () => {
    expect(manager.myHotel).to.deep.equal(hotel);
  });

  it('That array should be empty by default', () => {
    expect(emptyManager.myHotel).to.deep.equal([]);
  });

  it('Given today\'s date, should return number of rooms still available', () => {
    expect(manager.showRoomsLeft("2020/04/22")).to.equal(2);
  });

  it('Given today\'s date, should not return incorrect number of rooms still available', () => {
    expect(manager.showRoomsLeft("2020/04/22")).to.not.equal(1);
  });

  it('Given today\'s date, should find booked rooms for that day', () => {
    expect(manager.findBookedRooms("2020/04/22")).to.deep.equal([rooms[0], rooms[3]]);
  });

  it('Given today\'s date, should see total revenue for that day', () => {
    expect(manager.getTotalRevenue("2020/04/22")).to.equal(
      Math.round((358.4 + 429.44) * 100) / 100
    );
  });

  it('Given today\'s date, should not see incorrect total revenue for that day', () => {
    expect(manager.getTotalRevenue("2020/04/22")).to.not.equal(666.66);
  });

  it('Given today\'s date, should see percentage of rooms occupied', () => {
    expect(manager.calculatePercentageOccupied("2020/04/22")).to.equal(50);
  });

  it('Given today\'s date, should not see incorrect percentage of rooms occupied', () => {
    expect(manager.calculatePercentageOccupied("2020/04/22")).to.not.equal(51);
  });

  it('Given user\'s name, should find their index in hotel.customers array', () => {
    expect(manager.getIndexOfCustomer("Rocio Schuster")).to.equal(1);
  });

  it('Given user\'s name, should not find their incorrect index in hotel.customers array', () => {
    expect(manager.getIndexOfCustomer("Rocio Schuster")).to.not.equal(0);
  });
});