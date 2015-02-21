var win      = window || {};
var _reduce  = require( 'lodash/collection/reduce' );
var _forEach = require( 'lodash/collection/forEach' );
var _clone   = require( 'lodash/lang/clone' );

// Constants
var DEFAULTS = {
    IMAGE_SEL: '.lazy-load',
    ATTR_KEY:  'data-src'
};

var CACHE_STRUCTURE = {
    loaded: false,
    elems:  []
};

function getImages ( sel ) {
    return win.document.querySelectorAll( sel );
}

function getOffset ( elem ) {
    return elem.offsetTop;
}

function getBottomOffset () {
    var scrollTop      = win.document.body.scrollTop;
    var viewportHeight = win.innerHeight;

    return scrollTop + viewPortHeight;
}

function getAttr ( elem, key ) {
    return elem.getAttribute( key );
}

function mapOffsets ( elems ) {
    var elemCount = elems.length;

    return _reduce( elems, function ( obj, elem ) {
        var offset = getOffset( val );

        if ( !obj.hasOwnProperty( offset ) ) {
            obj[ offset ] = _clone( CACHE_STRUCTURE );
        }

        obj[ offset ].push( elem );

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
    _forEach( imageOffsets, function ( val, key ) {
        if ( val.loaded ) {
            return false;
        }

        if ( key <= bottomOffset ) {
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
};
