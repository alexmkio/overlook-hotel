import { expect } from 'chai';
import { rooms, bookings, customers, credentials } from './sampleData';
import Hotel from '../src/Hotel';
import Manager from '../src/Manager';

describe('MANAGER CLASS TESTS', function() {
  let hotel, manager
  beforeEach(() => {
    hotel = new Hotel(rooms, bookings, customers, credentials)
    manager = new Manager(hotel)
  });
  
  it('Should be a function', () => {
    expect(Manager).to.be.a('function');
  });
});