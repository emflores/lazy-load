require( 'should' );
var proxyquire = require( 'proxyquire' ).noCallThru();
var sinon      = require( 'sinon' );
var _forEach   = require( 'lodash-node/compat/collection/forEach' );
var _clone     = require( 'lodash-node/compat/lang/clone' );
var _noop      = require( 'lodash-node/compat/utility/noop' );

// Fixtures
var elems             = require( './fixtures' ).elems;
var mappedElems       = require( './fixtures' ).mappedElems;
var singlePixelScroll = require( './fixtures' ).singlePixelScroll;

// Spies
var spies = {
    addEventListener: sinon.spy( function ( ev, cb ) {
        cb();
    })
};

function getLib ( overrides ) {
    overrides = overrides || {};

    return proxyquire( '../index', {
        './util': {
            win: {
                document: {
                    querySelectorAll: overrides.qsa || function () {
                        return _clone( elems );
                    },
                    body: {
                        scrollTop: overrides.scrollTop || 0
                    }
                },
                addEventListener: spies.addEventListener,
                innerHeight: overrides.innerHeight || 1
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
        it( 'Only loads images in the view port', function () {
            lib = getLib({
                scrollTop: 1
            });

            lib.init().should.eql( singlePixelScroll );
            lib.init()[ 2 ].elems[ 0 ].src.should.equal( '/foo.html' );
            lib.init()[ 2 ].elems[ 1 ].src.should.equal( '/foo.html' );
            ( typeof lib.init()[ 3 ].elems[ 0 ].src ).should.equal( 'undefined' );
            ( typeof lib.init()[ 4 ].elems[ 0 ].src ).should.equal( 'undefined' );
        });
    });
});
