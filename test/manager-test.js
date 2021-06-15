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

});