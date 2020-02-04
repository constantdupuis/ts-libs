class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
class QuadTree {
    constructor(boundary, capacity) {
        this.capacity = 4;
        this.points = [];
        this.boundary = boundary;
        this.capacity = capacity;
    }
    insert(p) {
        if (this.points.length < this.capacity) {
            this.points.push(p);
        }
        else {
        }
    }
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(45, 33, 46);
    let qtree = new QuadTree(new Rectangle(0, 0, windowWidth, windowHeight), 4);
    console.log(qtree);
    for (let i = 0; i < 1; i++) {
        let p = new Point(random(windowWidth), random(windowHeight));
        qtree.insert(p);
    }
}
function draw() {
    noStroke();
    circle(10, 10, 5);
}
//# sourceMappingURL=build.js.map