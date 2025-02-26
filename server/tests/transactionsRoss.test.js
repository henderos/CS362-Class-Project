const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
describe('Transactions API Tests', () => {
  it('should retrieve all transactions', (done) => {
    chai.request(app)
      .get('/api/transactions')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });
});
