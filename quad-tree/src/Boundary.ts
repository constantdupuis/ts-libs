/**
 * Rectangle class
 */
class Boundary implements IArea {
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
  contains(p: IPosisionable): boolean {
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
  intersects(r: Boundary): boolean {
    if (
      r.x > this.x + this.w ||
      r.y > this.y + this.h ||
      r.x + r.w < this.x ||
      r.y + r.h < this.y
    ) {
      return false;
    }
    return true;
  }
}
