var win      = require( './util' ).win;
var _reduce  = require( 'lodash-node/compat/collection/reduce' );
var _forEach = require( 'lodash-node/compat/collection/forEach' );

// Constants
var DEFAULTS = {
    IMAGE_SEL: '.lazy-load',
    ATTR_KEY:  'data-src'
};

// Cache
var bottomOffset = 0;

function getImages ( sel ) {
    return win.document.querySelectorAll( sel );
}

function getOffset ( elem ) {
    return elem.offsetTop;
}

function getBottomOffset () {
    var scrollTop       = win.document.body.scrollTop;
    var viewPortHeight  = win.innerHeight;
    var newBottomOffset = scrollTop + viewPortHeight;

    // If the user is scrolling upward, return undefined. This will
    // result in a short circuit within the handleScroll method.
    if ( newBottomOffset < bottomOffset ) {
        return;
    }

    bottomOffset = newBottomOffset;

    return newBottomOffset;
}

function getAttr ( elem, key ) {
    return elem.getAttribute( key );
}

function getCacheStructure () {
    return {
        loaded: false,
        elems:  []
    };
}

function mapOffsets ( elems ) {
    return _reduce( elems, function ( obj, elem ) {
        var offset = getOffset( elem );

        if ( !obj.hasOwnProperty( offset ) ) {
            obj[ offset ] = getCacheStructure();
        }

        obj[ offset ].elems.push( elem );

        return obj;
    }, {} );
}

function loadImages ( elems, attrKey ) {
    _forEach( elems, function ( val ) {
        var src = getAttr( val, attrKey );

        if ( !src ) {
            return false;
        }

        val.setAttribute( 'src', src );
    });
}

function handleScroll ( imageOffsets, bottomOffset, attrKey ) {
    if ( !bottomOffset ) {
        return;
    }

    _forEach( imageOffsets, function ( val, key ) {
        if ( !val.loaded && key <= bottomOffset ) {
            loadImages( val.elems, attrKey );
            val.loaded = true;
        }
    });
}

function bindScrollHandler ( imageOffsets, attrKey ) {
    win.addEventListener( 'scroll', function () {
        handleScroll( imageOffsets, getBottomOffset(), attrKey );
    });
}

module.exports.init = function ( imageSel, attrKey ) {
    imageSel = imageSel || DEFAULTS.IMAGE_SEL;
    attrKey  = attrKey  || DEFAULTS.ATTR_KEY;

    var images = getImages( imageSel );

    if ( !images.length ) {
        return;
    }

    var imageOffsets = mapOffsets( images );

    bindScrollHandler( imageOffsets, attrKey );

    return imageOffsets;
};
