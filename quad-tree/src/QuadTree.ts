/**
 * Tpe definition for callback functions
 */
type cbQuadTreeGen<T extends IPosisionable> = (qtree: QuadTree<T>) => void;
type cbPosisionable = (p: IPosisionable) => void;
type cbBoundaries = (r: Boundary) => void;

/**
 * Generique QuadTree
 */
class QuadTree<T extends IPosisionable> {
  points: IPosisionable[] = [];
  boundary: Boundary;
  capacity: number = 4;

  subdivided: boolean = false;
  topLeft: QuadTree<T> = null;
  topRight: QuadTree<T> = null;
  bottomLeft: QuadTree<T> = null;
  bottomRight: QuadTree<T> = null;

  /**
   * A QuadTree node, the first you create is the root one. Will create sub QuadTree nodes
   * if needed when you insert points.
   * @param boundary Area covered by this QuadTree node
   * @param capacity How many points this QuadTree node can contain
   */
  constructor(boundary: Boundary, capacity: number) {
    this.boundary = boundary;
    this.capacity = capacity;
  }

  /**
   * Insert a poin in this QuadTree node
   * @param p Point to insert in the QuadTree node
   */
  insert(p: IPosisionable): boolean {
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
      } else {
        throw "Should never get here!";
      }
    }
    return false;
  }

  /**
   * Query for points in a given area
   * @param range Area to look for points
   */
  query(range: Boundary): IPosisionable[] {
    let found: IPosisionable[] = [];
    return this.innerQuery(range, found);
  }

  /**
   * Inner recursive query for points in a given area
   * @param range Area to look for points
   * @param found Array of points to fill with founded point, if null a array will be created
   */
  private innerQuery(range: Boundary, found: IPosisionable[]): IPosisionable[] {
    if (found == null) {
      found = [];
    }

    if (!this.boundary.intersects(range)) return found;

    this.points.forEach((p: IPosisionable) => {
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

      this.topLeft = new QuadTree<T>(
        new Boundary(x, y, newWidth, newHeight),
        this.capacity
      );

      this.topRight = new QuadTree<T>(
        new Boundary(x + newWidth, y, newWidth, newHeight),
        this.capacity
      );

      this.bottomLeft = new QuadTree<T>(
        new Boundary(x, y + newHeight, newWidth, newHeight),
        this.capacity
      );

      this.bottomRight = new QuadTree<T>(
        new Boundary(x + newWidth, y + newHeight, newWidth, newHeight),
        this.capacity
      );
    }
  }

  /**
   * Call callback for each QuadTree from this QuadTree and his childrens
   * @param callback Function called for each QuadTree from this QuadTree node
   */
  forEach(callback: cbQuadTreeGen<T>) {
    this.visiteALlQuadTree(this, callback);
  }

  /**
   * Visite all points of the QuadTree.
   * This is done in no particulare order.
   * @param callback function call for each point, with the point as parameter
   */
  forEachPoints(callback: cbPosisionable) {
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
  private visiteALlQuadTree(qtree: QuadTree<T>, callback: cbQuadTreeGen<T>) {
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
  private visiteAllPoints(qtree: QuadTree<T>, callback: cbPosisionable) {
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
  private visiteAllBoundaries(qtree: QuadTree<T>, callback: cbBoundaries) {
    if (qtree == null) return;

    callback(qtree.boundary);

    this.visiteAllBoundaries(qtree.topLeft, callback);
    this.visiteAllBoundaries(qtree.topRight, callback);
    this.visiteAllBoundaries(qtree.bottomLeft, callback);
    this.visiteAllBoundaries(qtree.bottomRight, callback);
  }
}
