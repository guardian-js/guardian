const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const core = require('../');

chai.should();
chai.use(sinonChai);

describe('@guardianjs/core', () => {
    it('should correctly check routes', () => {
        const falseSpy = sinon.spy(() => false);
        const trueSpy = sinon.spy(() => true);

        // Register routes
        core.register("/false", falseSpy);
        core.register("/true", trueSpy);

        // "fake" has not been registered
        core.check("/fake").should.equal(true);

        core.check("/false").should.equal(false);
        core.check("/true").should.equal(true);

        falseSpy.should.have.callCount(1);
        trueSpy.should.have.callCount(1);

        falseSpy.should.have.been.calledBefore(trueSpy);
    });
});
