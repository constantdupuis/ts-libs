/**
 * Point class
 */
class Point {
  x: number;
  y: number;
  /**
   * Create a new point
   * @param x x coordinat of the point
   * @param y y coordinat of the point
   */
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
/**
 * Create new Rectangle
 * @param x topleft x coordinate of the rectangle
 * @param y topleft y coordinate of the rectangle
 * @param w width of the rectangle
 * @param h height of the rectangle
 */
  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  /**
   * Check if a point in inside the rectangle, borders included
   * @param p Point to check
   */
  contains(p: Point): boolean {
    if (
      p.x >= this.x &&
      p.x <= this.x + this.w &&
      p.y >= this.y &&
      p.y <= this.y + this.h
    ) {
      return true;
    }
    return false;
  }

  /**
   * Check if r intersects with this rectangle
   * @param r Rectangle to check intersection with
   */
  intersects( r:Rectangle) : boolean
  {
    if( r.x > this.x + this.w || 
      r.y > this.y + this.h || 
      r.x + r.w < this.x ||
      r.y + r.h < this.y) 
    {
      return false;
    }
    return true;
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
 * Implements QuadTree algorythm https://en.wikipedia.org/wiki/Quadtree
 * Here to quickly found point in a given area (range) 
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
      else{
        throw "Should never get here!";
      }
    }
    return false;
  }

  /**
   * Query for points in a given area
   * @param range Area to look for points 
   */
  query(range:Rectangle) : Point[]
  { 
    let found : Point [] = [];
    return this.innerQuery(range, found);
  }

  /**
   * Inner recursive query for points in a given area
   * @param range Area to look for points
   * @param found Array of points to fill with founded point, if null a array will be created
   */
  private innerQuery(range: Rectangle, found : Point[]) : Point[]
  {
    if( found == null)
    {
      found = [];
    }

    if( !this.boundary.intersects(range)) return found;

    this.points.forEach((p:Point) =>{
      if( range.contains(p))
      {
        found.push(p);
      }
    });

    if( this.subdivided)
    {
      this.topLeft.innerQuery( range, found);
      this.topRight.innerQuery( range, found);
      this.bottomLeft.innerQuery( range, found)
      this.bottomRight.innerQuery( range, found);
    }
   
    return found;
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
    this.visiteALlQuadTree(this, callback);
  }

  /**
   * Visite all points of the QuadTree.
   * This is done in no particulare order.
   * @param callback function call for each point, with the point as parameter
   */
  forEachPoints(callback: cbPoints) {
    this.visiteAllPoints(this, callback);
  }

  /**
   * 
   * @param callback function called for each QuadTree boundary
   */
  forEachBoundaries(callback: cbBoundaries) {
    this.visiteAllBoundaries(this, callback);
  }


  /**
   * Visite all QuadTree from the passed *qtree*
   * @param qtree QuadTree node to start visite from
   * @param callback Function to call with each QuadTree as parameter
   */
  private visiteALlQuadTree( qtree: QuadTree, callback: cbQuadTree)
  {
    if (qtree == null) return;

    callback(qtree);
    
    this.visiteALlQuadTree(qtree.topLeft, callback);
    this.visiteALlQuadTree(qtree.topRight, callback);
    this.visiteALlQuadTree(qtree.bottomLeft, callback);
    this.visiteALlQuadTree(qtree.bottomRight, callback);
  }

  /**
   * Visit all poin from this QuadTree and all it's childrens
   * @param qtree QuadTree node to start visite from 
   * @param callback Function to call with each Point as parameter
   */
  private visiteAllPoints( qtree : QuadTree, callback: cbPoints)
  {
    if (qtree == null) return;

    qtree.points.forEach(point => {
      callback(point);
    });
    
    this.visiteAllPoints(qtree.topLeft, callback);
    this.visiteAllPoints(qtree.topRight, callback);
    this.visiteAllPoints(qtree.bottomLeft, callback);
    this.visiteAllPoints(qtree.bottomRight, callback);
  }

  /**
   * 
   * @param qtree QuadTree node to start visite from
   * @param callback Funcion to call with each Boundary as parameter 
   */
  private visiteAllBoundaries( qtree: QuadTree, callback: cbBoundaries)
  {
    if (qtree == null) return;

    callback(qtree.boundary);
        
    this.visiteAllBoundaries(qtree.topLeft, callback);
    this.visiteAllBoundaries(qtree.topRight, callback);
    this.visiteAllBoundaries(qtree.bottomLeft, callback);
    this.visiteAllBoundaries(qtree.bottomRight, callback);
  }

}
