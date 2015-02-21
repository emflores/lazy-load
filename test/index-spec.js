require( 'should' );
var proxyquire = require( 'proxyquire' ).noCallThru();
var sinon      = require( 'sinon' );
var _forEach   = require( 'lodash-node/compat/collection/forEach' );
var _noop      = require( 'lodash-node/compat/utility/noop' );

// Fixtures
var elems       = require( './fixtures' ).elems;
var mappedElems = require( './fixtures' ).mappedElems;

// Spies
var spies = {
    addEventListener: sinon.spy()
};

function getLib ( overrides ) {
    overrides = overrides || {};

    return proxyquire( '../index', {
        './util': {
            win: {
                document: {
                    querySelectorAll: overrides.qsa || function () {
                        return elems;
                    }
                },
                addEventListener: spies.addEventListener
            }
        }
    });
}

describe( 'Lazy Load', function () {
    var lib = null;

    beforeEach( function () {
        lib = getLib();

        _forEach( spies, function ( val ) {
            val.reset();
        });
    });

    describe( 'Initialization', function () {
        it( 'Short circuits if the given selector returns no DOM elements', function () {
            lib = getLib({
                qsa: function () {
                    return [];
                }
            });

            ( typeof lib.init() ).should.equal( 'undefined' );
        });

        it( 'Maps images based on their page offset', function () {
            lib.init().should.eql( mappedElems );
        });

        it( 'Binds a scroll handler', function () {
            lib.init();
            spies.addEventListener.calledWith( 'scroll' ).should.be.true;
        });
    });

    describe( 'Scroll Handler', function () {

    });
});
