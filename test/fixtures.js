module.exports.elems = [
    { offsetTop: 1 },
    { offsetTop: 1 },
    { offsetTop: 2 },
    { offsetTop: 3 }
];

module.exports.mappedElems = {
    1: {
        loaded: false,
        elems:  [ { offsetTop: 1 }, { offsetTop: 1 } ]
    },
    2: {
        loaded: false,
        elems:  [ { offsetTop: 2 } ]
    },
    3: {
        loaded: false,
        elems:  [ { offsetTop: 3 } ]
    }
};
