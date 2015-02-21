var _assign = require( 'lodash-node/compat/object/assign' );

var baseElem = {
    getAttribute: function ( key ) {
        return this[ key ];
    },
    setAttribute: function ( key, val ) {
        this[ key ] = val;
    },
    'data-src': '/foo.html'
};
var elemA = _assign( { offsetTop: 2 }, baseElem );
var elemB = _assign( { offsetTop: 2 }, baseElem );
var elemC = _assign( { offsetTop: 3 }, baseElem );
var elemD = _assign( { offsetTop: 4 }, baseElem );

module.exports.elems = [ elemA, elemB, elemC, elemD ];

module.exports.mappedElems = {
    2: {
        loaded: false,
        elems:  [ elemA, elemB ]
    },
    3: {
        loaded: false,
        elems:  [ elemC ]
    },
    4: {
        loaded: false,
        elems:  [ elemD ]
    }
};

module.exports.singlePixelScroll = {
    2: {
        loaded: true,
        elems:  [ elemA, elemB ]
    },
    3: {
        loaded: false,
        elems:  [ elemC ]
    },
    4: {
        loaded: false,
        elems:  [ elemD ]
    }
};
