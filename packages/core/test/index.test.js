const chai = require('chai');
const sinon = require('sinon');
const dirtyChai = require('dirty-chai');
const sinonChai = require('sinon-chai');

const core = require('../');

chai.should();
chai.use(dirtyChai);
chai.use(sinonChai);

describe('@guardianjs/core', () => {
  it('should correctly guard routes', () => {
    const falseSpy = sinon.spy(() => false);
    const trueSpy = sinon.spy(() => true);

    // Register routes.
    core.register('/false', falseSpy);
    core.register('/true', trueSpy);

    // "fake" has not been registered
    core.check('/fake').should.equal(true);

    // register() shouldn't call and check() should only call on match.
    falseSpy.should.not.have.been.called();
    trueSpy.should.not.have.been.called();

    // Check access.
    core.check('/false').should.equal(false);
    core.check('/true').should.equal(true);

    // Make sure that the guards have only been called once, and in the right order.
    falseSpy.should.have.been.calledOnce();
    trueSpy.should.have.been.calledOnce();
    falseSpy.should.have.been.calledBefore(trueSpy);
  });
});
