const chai = require('chai');
const sinon = require('sinon');
const dirtyChai = require('dirty-chai');
const sinonChai = require('sinon-chai');

const core = require('@guardianjs/core');
const utils = require('../');

chai.should();
chai.use(dirtyChai);
chai.use(sinonChai);

describe('@guardianjs/utils', () => {
  it('should correctly wrap functions', () => {
    const RET = 'return';
    const ARG = 10;
    const FALSE_ROUTE = '/wrap:false';
    const TRUE_ROUTE = '/wrap:true';

    // Guards
    const falseSpy = sinon.spy(() => false);
    const trueSpy = sinon.spy(() => true);

    // The function that will be wrapped
    const wrappedSpy = sinon.spy(() => RET);

    core.register(FALSE_ROUTE, falseSpy);
    core.register(TRUE_ROUTE, trueSpy);

    const wrappedFalse = utils.wrap(FALSE_ROUTE, wrappedSpy);
    const wrappedTrue = utils.wrap(TRUE_ROUTE, wrappedSpy);

    falseSpy.should.not.have.been.called();
    trueSpy.should.not.have.been.called();

    wrappedFalse.should.throw(Error, 'Permission denied');
    wrappedSpy.should.not.have.been.called();
    falseSpy.should.have.been.calledOnce();

    wrappedTrue(ARG).should.equal(RET);
    wrappedSpy.should.have.been.calledOnceWithExactly(ARG);
    trueSpy.should.have.been.calledOnce();
  });

  it('should register multiple guards', () => {
    const FALSE_ROUTE = '/register:false';
    const TRUE_ROUTE = '/register:true';

    const falseSpy = sinon.spy(() => false);
    const trueSpy = sinon.spy(() => true);

    utils.registerRoutes([
      {
        route: FALSE_ROUTE,
        guard: falseSpy,
      },
      {
        route: TRUE_ROUTE,
        guard: trueSpy,
      },
    ]);

    falseSpy.should.not.have.been.called();
    trueSpy.should.not.have.been.called();

    core.check(FALSE_ROUTE).should.equal(false);
    falseSpy.should.have.been.calledOnce();
    trueSpy.should.not.have.been.called();

    core.check(FALSE_ROUTE).should.equal(false);
    core.check(TRUE_ROUTE).should.equal(true);
    falseSpy.should.have.been.calledTwice();
    trueSpy.should.have.been.calledOnce();
    trueSpy.should.have.been.calledImmediatelyAfter(falseSpy);
  });
});
