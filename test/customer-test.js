import { expect } from 'chai';
import Customer from '../src/Customer';

describe('CUSTOMER CLASS TESTS', function() {
  let customer
  beforeEach(() => {
    customer = new Customer({
      "id": 1,
      "name": "Leatha Ullrich"
    })
  });
  
  it('Should be a function', () => {
    expect(Customer).to.be.a('function');
  });

  it('Should have an ID', () => {
    expect(customer.id).to.equal(1);
  });

  it('The ID should be an number', () => {
    expect(customer.id).to.be.finite;
  });

  it('The ID should be the correct number', () => {
    expect(customer.id).to.not.equal(2);
  });

  it('Should have a name', () => {
    expect(customer.name).to.equal("Leatha Ullrich");
  });

  it('Should have a booking parameter that is an empty array by default', () => {
    expect(customer.bookings).to.deep.equal([]);
  });
});
