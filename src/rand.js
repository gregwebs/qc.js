function randWhole(top) {
    return Math.floor(Math.random() * top);
}

function randInt(top) {
    return randWhole(2 * top) - top;
}

function randRange(a, b) {
    return randWhole(b - a) + a;
}

function randFloatUnit() {
    return Math.random();
}
