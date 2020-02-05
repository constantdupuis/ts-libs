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
    contains(p) {
        if (p.x >= this.x &&
            p.x <= this.x + this.w &&
            p.y >= this.y &&
            p.y <= this.x + this.h) {
            return true;
        }
        return false;
    }
}
class QuadTree {
    constructor(boundary, capacity) {
        this.capacity = 4;
        this.points = [];
        this.subdivided = false;
        this.topLeft = null;
        this.topRight = null;
        this.bottomLeft = null;
        this.bottomRight = null;
        this.boundary = boundary;
        this.capacity = capacity;
    }
    insert(p) {
        if (!this.boundary.contains(p)) {
            return false;
        }
        if (this.points.length < this.capacity) {
            this.points.push(p);
            return true;
        }
        else {
            this.subdivide();
            if (this.topLeft.insert(p)) {
                return true;
            }
            else if (this.topRight.insert(p)) {
                return true;
            }
            else if (this.bottomLeft.insert(p)) {
                return true;
            }
            else if (this.bottomRight.insert(p)) {
                return true;
            }
        }
        return false;
    }
    subdivide() {
        if (!this.subdivided) {
            this.subdivided = true;
            let x = this.boundary.x;
            let y = this.boundary.y;
            let newWidth = this.boundary.w / 2.0;
            let newHeight = this.boundary.h / 2.0;
            this.topLeft = new QuadTree(new Rectangle(x, y, newWidth, newHeight), this.capacity);
            this.topRight = new QuadTree(new Rectangle(x + newWidth, y, newWidth, newHeight), this.capacity);
            this.bottomLeft = new QuadTree(new Rectangle(x, y + newHeight, newWidth, newHeight), this.capacity);
            this.bottomRight = new QuadTree(new Rectangle(x + newWidth, y + newHeight, newWidth, newHeight), this.capacity);
        }
    }
    forEach(callback) {
        this.visiteQuadTree(this, callback);
    }
    forEachPoints(callback) {
        this.visitePoints(this, callback);
    }
    forEachBoundaries(callback) {
        this.visiteBoundaries(this, callback);
    }
    visiteQuadTree(qtree, callback) {
        if (qtree == null)
            return;
        callback(qtree);
        this.visiteQuadTree(qtree.topLeft, callback);
        this.visiteQuadTree(qtree.topRight, callback);
        this.visiteQuadTree(qtree.bottomLeft, callback);
        this.visiteQuadTree(qtree.bottomRight, callback);
    }
    visitePoints(qtree, callback) {
        if (qtree == null)
            return;
        qtree.points.forEach(point => {
            callback(point);
        });
        this.visitePoints(qtree.topLeft, callback);
        this.visitePoints(qtree.topRight, callback);
        this.visitePoints(qtree.bottomLeft, callback);
        this.visitePoints(qtree.bottomRight, callback);
    }
    visiteBoundaries(qtree, callback) {
        if (qtree == null)
            return;
        callback(qtree.boundary);
        this.visiteBoundaries(qtree.topLeft, callback);
        this.visiteBoundaries(qtree.topRight, callback);
        this.visiteBoundaries(qtree.bottomLeft, callback);
        this.visiteBoundaries(qtree.bottomRight, callback);
    }
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(45, 33, 46);
    let qtree = new QuadTree(new Rectangle(20, 20, windowWidth - 40, windowHeight - 40), 4);
    console.log(qtree);
    for (let i = 0; i < 100; i++) {
        let p = new Point(random(windowWidth), random(windowHeight));
        qtree.insert(p);
    }
    qtree.forEach((e) => {
        stroke('red');
        noFill();
        rect(e.boundary.x, e.boundary.y, e.boundary.w, e.boundary.h);
        e.points.forEach((e) => {
            stroke('white');
            fill('whitte');
            circle(e.x, e.y, 5);
        });
    });
    noLoop();
}
function draw() {
    noStroke();
    circle(10, 10, 5);
}
//# sourceMappingURL=build.js.map