class Boundary {
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
            p.y <= this.y + this.h) {
            return true;
        }
        return false;
    }
    intersects(r) {
        if (r.x > this.x + this.w ||
            r.y > this.y + this.h ||
            r.x + r.w < this.x ||
            r.y + r.h < this.y) {
            return false;
        }
        return true;
    }
}
class QuadTree {
    constructor(boundary, capacity) {
        this.points = [];
        this.capacity = 4;
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
            else {
                throw "Should never get here!";
            }
        }
        return false;
    }
    query(range) {
        let found = [];
        return this.innerQuery(range, found);
    }
    innerQuery(range, found) {
        if (found == null) {
            found = [];
        }
        if (!this.boundary.intersects(range))
            return found;
        this.points.forEach((p) => {
            if (range.contains(p)) {
                found.push(p);
            }
        });
        if (this.subdivided) {
            this.topLeft.innerQuery(range, found);
            this.topRight.innerQuery(range, found);
            this.bottomLeft.innerQuery(range, found);
            this.bottomRight.innerQuery(range, found);
        }
        return found;
    }
    subdivide() {
        if (!this.subdivided) {
            this.subdivided = true;
            let x = this.boundary.x;
            let y = this.boundary.y;
            let newWidth = this.boundary.w / 2.0;
            let newHeight = this.boundary.h / 2.0;
            this.topLeft = new QuadTree(new Boundary(x, y, newWidth, newHeight), this.capacity);
            this.topRight = new QuadTree(new Boundary(x + newWidth, y, newWidth, newHeight), this.capacity);
            this.bottomLeft = new QuadTree(new Boundary(x, y + newHeight, newWidth, newHeight), this.capacity);
            this.bottomRight = new QuadTree(new Boundary(x + newWidth, y + newHeight, newWidth, newHeight), this.capacity);
        }
    }
    forEach(callback) {
        this.visiteALlQuadTree(this, callback);
    }
    forEachPoints(callback) {
        this.visiteAllPoints(this, callback);
    }
    forEachBoundaries(callback) {
        this.visiteAllBoundaries(this, callback);
    }
    visiteALlQuadTree(qtree, callback) {
        if (qtree == null)
            return;
        callback(qtree);
        this.visiteALlQuadTree(qtree.topLeft, callback);
        this.visiteALlQuadTree(qtree.topRight, callback);
        this.visiteALlQuadTree(qtree.bottomLeft, callback);
        this.visiteALlQuadTree(qtree.bottomRight, callback);
    }
    visiteAllPoints(qtree, callback) {
        if (qtree == null)
            return;
        qtree.points.forEach(point => {
            callback(point);
        });
        this.visiteAllPoints(qtree.topLeft, callback);
        this.visiteAllPoints(qtree.topRight, callback);
        this.visiteAllPoints(qtree.bottomLeft, callback);
        this.visiteAllPoints(qtree.bottomRight, callback);
    }
    visiteAllBoundaries(qtree, callback) {
        if (qtree == null)
            return;
        callback(qtree.boundary);
        this.visiteAllBoundaries(qtree.topLeft, callback);
        this.visiteAllBoundaries(qtree.topRight, callback);
        this.visiteAllBoundaries(qtree.bottomLeft, callback);
        this.visiteAllBoundaries(qtree.bottomRight, callback);
    }
}
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
let qtree;
function setup() {
    createCanvas(windowWidth, windowHeight);
    background("#2D142C");
    qtree = new QuadTree(new Boundary(20, 20, windowWidth - 40, windowHeight - 40), 8);
}
function draw() {
    background("#2D142C");
    qtree.forEach((e) => {
        rectMode(CORNER);
        stroke("#801336");
        noFill();
        rect(e.boundary.x, e.boundary.y, e.boundary.w, e.boundary.h);
        e.points.forEach((e) => {
            stroke("#C92A42");
            fill("#C92A42");
            circle(e.x, e.y, 5);
        });
    });
    if (mouseIsPressed === true && mouseButton === RIGHT) {
        rectMode(CORNER);
        let range = new Boundary(mouseX - 40, mouseY - 20, 80, 40);
        stroke("#EE4540");
        noFill();
        rect(range.x, range.y, range.w, range.h);
        let found = qtree.query(range);
        found.forEach((p) => {
            stroke("#8FB9A8");
            fill("#8FB9A8");
            circle(p.x, p.y, 5);
        });
    }
    else if (mouseIsPressed === true && mouseButton === LEFT) {
        for (let i = 0; i < 5; i++) {
            qtree.insert(new Particle(mouseX + random(-5, 5), mouseY + random(-5, 5)));
        }
    }
}
//# sourceMappingURL=build.js.map