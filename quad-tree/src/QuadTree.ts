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
  topLeft: QuadTree = null;
  topRight: QuadTree = null;
  bottomLeft: QuadTree = null;
  bottomRight: QuadTree = null;
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
      if (this.topLeft.insert(p)) {
        return true;
      } else if (this.topRight.insert(p)) {
        return true;
      } else if (this.bottomLeft.insert(p)) {
        return true;
      } else if (this.bottomRight.insert(p)) {
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

      this.topLeft = new QuadTree(
        new Rectangle(x, y, newWidth, newHeight),
        this.capacity
      );

      this.topRight = new QuadTree(
        new Rectangle(x + newWidth, y, newWidth, newHeight),
        this.capacity
      );

      this.bottomLeft = new QuadTree(
        new Rectangle(x, y + newHeight, newWidth, newHeight),
        this.capacity
      );

      this.bottomRight = new QuadTree(
        new Rectangle(x + newWidth, y + newHeight, newWidth, newHeight),
        this.capacity
      );
    }
  }

  /**
   * Call callback for each QuadTree from this QuadTree and his childrens
   * @param callback Function called for each QuadTree from this QuadTree node
   */
  forEach(callback: cbQuadTree) {
    this.visiteQuadTree(this, callback);
  }

  /**
   * Visite all points of the QuadTree.
   * This is done in no particulare order.
   * @param callback function call for each point, with the point as parameter
   */
  forEachPoints(callback: cbPoints) {
    this.visitePoints(this, callback);
  }

  /**
   * 
   * @param callback function called for each QuadTree boundary
   */
  forEachBoundaries(callback: cbBoundaries) {
    this.visiteBoundaries(this, callback);
  }


  /**
   * Visite all QuadTree from the passed *qtree*
   * @param qtree QuadTree node to start visite from
   * @param callback Function to call with each QuadTree as parameter
   */
  private visiteQuadTree( qtree: QuadTree, callback: cbQuadTree)
  {
    if (qtree == null) return;

    callback(qtree);
    
    this.visiteQuadTree(qtree.topLeft, callback);
    this.visiteQuadTree(qtree.topRight, callback);
    this.visiteQuadTree(qtree.bottomLeft, callback);
    this.visiteQuadTree(qtree.bottomRight, callback);
  }

  /**
   * Visit all poin from this QuadTree and all it's childrens
   * @param qtree QuadTree node to start visite from 
   * @param callback Function to call with each Point as parameter
   */
  private visitePoints( qtree : QuadTree, callback: cbPoints)
  {
    if (qtree == null) return;

    qtree.points.forEach(point => {
      callback(point);
    });
    
    this.visitePoints(qtree.topLeft, callback);
    this.visitePoints(qtree.topRight, callback);
    this.visitePoints(qtree.bottomLeft, callback);
    this.visitePoints(qtree.bottomRight, callback);
  }

  /**
   * 
   * @param qtree QuadTree node to start visite from
   * @param callback Funcion to call with each Boundary as parameter 
   */
  private visiteBoundaries( qtree: QuadTree, callback: cbBoundaries)
  {
    if (qtree == null) return;

    callback(qtree.boundary);
        
    this.visiteBoundaries(qtree.topLeft, callback);
    this.visiteBoundaries(qtree.topRight, callback);
    this.visiteBoundaries(qtree.bottomLeft, callback);
    this.visiteBoundaries(qtree.bottomRight, callback);
  }

}
