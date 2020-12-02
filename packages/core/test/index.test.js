const chai = require('chai');
const sinon = require('sinon');
const dirtyChai = require('dirty-chai');
const sinonChai = require('sinon-chai');

const core = require('../');

chai.should();
chai.use(dirtyChai);
chai.use(sinonChai);

describe('@guardianjs/core', () => {
  const VALUE = 'value';
  const KEY = 'key';
  const FALSE_ROUTE = '/false';
  const TRUE_ROUTE = '/true';
  const FAKE_ROUTE = '/fake';

  beforeEach(() => {
    core.context.clear();
  });

  it('should correctly guard routes', () => {
    const falseSpy = sinon.spy(() => false);
    const trueSpy = sinon.spy(() => true);

    // Register routes.
    core.register(FALSE_ROUTE, falseSpy);
    core.register(TRUE_ROUTE, trueSpy);

    // "fake" does not exist.
    core.check(FAKE_ROUTE).should.equal(true);

    // register() shouldn't call and check() should only call on match.
    falseSpy.should.not.have.been.called();
    trueSpy.should.not.have.been.called();

    // Check access.
    core.check(FALSE_ROUTE).should.equal(false);
    core.check(TRUE_ROUTE).should.equal(true);

    // Make sure that the guards have only been called once, and in the right order.
    falseSpy.should.have.been.calledOnce();
    trueSpy.should.have.been.calledOnce();
    falseSpy.should.have.been.calledBefore(trueSpy);
  });

  it('should allow you to exfiltrate data using the context', () => {
    const spy = sinon.spy(() => {
      core.context.set(KEY, VALUE);
      return true;
    });

    core.register('/ctx1', spy);

    spy.should.not.have.been.called();

    core.check('/ctx1');

    core.context.get(KEY).should.equal(VALUE);
  });

  it('should clear the context after calling check()', () => {
    const spy = sinon.spy(() => {
      core.context.set(KEY, VALUE);
      return true;
    });

    core.register('/ctx2', spy);

    spy.should.not.have.been.called();

    core.check('/ctx2');
    // Call check() again with a different route.
    // This should clear the context.
    core.check(FAKE_ROUTE);

    spy.should.have.been.calledOnce();
    core.context.has(KEY).should.be.false();
  });
});
