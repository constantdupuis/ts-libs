/**
 * Point class
 */
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

/**
 * Rectangle class
 */
class Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(p: Point): boolean {
    if (
      p.x >= this.x &&
      p.x <= this.x + this.w &&
      p.y >= this.y &&
      p.y <= this.x + this.h
    ) {
      return true;
    }
    return false;
  }
}

/**
 * Callbacks signature definition
 */
type cbQuadTree = (qtree: QuadTree) => void;
type cbPoints = (p: Point) => void;
type cbBoundaries = (r: Rectangle) => void;

/**
 * QuadTree object
 */
class QuadTree {
  boundary: Rectangle;
  capacity: number = 4;
  points: Point[] = [];
  subdivided: boolean = false;
  northWest: QuadTree = null;
  northEast: QuadTree = null;
  southWest: QuadTree = null;
  southEast: QuadTree = null;
  /**
   * A QuadTree node, the first you create is the root one. Will create sub QuadTree nodes
   * if needed when you insert points.
   * @param boundary Area covered by this QuadTree node
   * @param capacity How many points this QuadTree node can contain
   */
  constructor(boundary: Rectangle, capacity: number) {
    this.boundary = boundary;
    this.capacity = capacity;
  }

  /**
   * Insert a poin in this QuadTree node
   * @param p Point to insert in the QuadTree node
   */
  insert(p: Point): boolean {
    if (!this.boundary.contains(p)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(p);
      return true;
    } else {
      this.subdivide();
      if (this.northWest.insert(p)) {
        return true;
      } else if (this.northEast.insert(p)) {
        return true;
      } else if (this.southWest.insert(p)) {
        return true;
      } else if (this.southEast.insert(p)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Subdivide the current QuadTree node on 4 sub QuadTree.
   */
  private subdivide() {
    if (!this.subdivided) {
      // create sub quads
      this.subdivided = true;

      let x = this.boundary.x;
      let y = this.boundary.y;
      let newWidth = this.boundary.w / 2.0;
      let newHeight = this.boundary.h / 2.0;

      this.northWest = new QuadTree(
        new Rectangle(x, y, newWidth, newHeight),
        this.capacity
      );

      this.northEast = new QuadTree(
        new Rectangle(x + newHeight, y, newWidth, newHeight),
        this.capacity
      );

      this.southWest = new QuadTree(
        new Rectangle(x, y + newHeight, newWidth, newHeight),
        this.capacity
      );

      this.southEast = new QuadTree(
        new Rectangle(x + newWidth, y + newHeight, newWidth, newHeight),
        this.capacity
      );
    }
  }

  /**
   *
   * @param callback Function called for each QuadTree from this QuadTree node
   */
  forEach(callback: cbQuadTree) {
    this.visite(this, callback, null, null);
  }

  /**
   * Visite all points of the QuadTree.
   * This is done in no particulare order.
   * @param callback function call for each point, with the point as parameter
   */
  forEachPoints(callback: cbPoints) {
    this.visite(this, null, callback, null);
  }

  /**
   *
   * @param callback function called for each QuadTree boundary
   */
  forEachBoundaries(callback: cbBoundaries) {
    this.visite(this, null, null, callback);
  }

  /**
   * Internally used visite method, allow recursive visite of QuadTree node from the qtree passed in parameter.
   * @param qtree QuadTree to visite
   * @param cbQuadTrees callback for QuadTree info, if null not called
   * @param cbPoints callback for points info, if null not called
   * @param cbBoundaries callback for boundaries info, if null not called
   */
  private visite(
    qtree: QuadTree,
    cbQuadTrees: cbQuadTree,
    cbPoints: cbPoints,
    cbBoundaries: cbBoundaries
  ) {
    if (qtree == null) return;

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
