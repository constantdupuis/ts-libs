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
        this.northWest = null;
        this.northEast = null;
        this.southWest = null;
        this.southEast = null;
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
            if (this.northWest.insert(p)) {
                return true;
            }
            else if (this.northEast.insert(p)) {
                return true;
            }
            else if (this.southWest.insert(p)) {
                return true;
            }
            else if (this.southEast.insert(p)) {
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
            this.northWest = new QuadTree(new Rectangle(x, y, newWidth, newHeight), this.capacity);
            this.northEast = new QuadTree(new Rectangle(x + newHeight, y, newWidth, newHeight), this.capacity);
            this.southWest = new QuadTree(new Rectangle(x, y + newHeight, newWidth, newHeight), this.capacity);
            this.southEast = new QuadTree(new Rectangle(x + newWidth, y + newHeight, newWidth, newHeight), this.capacity);
        }
    }
    forEach(callback) {
        this.visite(this, callback, null, null);
    }
    forEachPoints(callback) {
        this.visite(this, null, callback, null);
    }
    forEachBoundaries(callback) {
        this.visite(this, null, null, callback);
    }
    visite(qtree, cbQuadTrees, cbPoints, cbBoundaries) {
        if (qtree == null)
            return;
        if (cbQuadTrees != null) {
            cbQuadTrees(qtree);
        }
        if (cbPoints != null) {
            qtree.points.forEach(e => {
                cbPoints(e);
            });
        }
        if (cbBoundaries != null) {
            cbBoundaries(qtree.boundary);
        }
        this.visite(qtree.northWest, cbQuadTrees, cbPoints, cbBoundaries);
        this.visite(qtree.northEast, cbQuadTrees, cbPoints, cbBoundaries);
        this.visite(qtree.southWest, cbQuadTrees, cbPoints, cbBoundaries);
        this.visite(qtree.southEast, cbQuadTrees, cbPoints, cbBoundaries);
    }
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(45, 33, 46);
    let qtree = new QuadTree(new Rectangle(0, 0, windowWidth, windowHeight), 4);
    console.log(qtree);
    for (let i = 0; i < 5; i++) {
        let p = new Point(random(windowWidth), random(windowHeight));
        qtree.insert(p);
    }
    qtree.forEachBoundaries((e) => {
        console.log(e);
    });
}
function draw() {
    noStroke();
    circle(10, 10, 5);
}
//# sourceMappingURL=build.js.map