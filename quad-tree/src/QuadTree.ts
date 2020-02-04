/**
 * Point class
 */
class Point
{
    x : number;
    y : number;
    
    constructor( x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }
}

/**
 * Rectangle class
 */
class Rectangle
{
    x : number;
    y : number;
    w : number;
    h : number;
    
    constructor(x: number, y : number, w : number, h : number)
    {
        this.x = x; 
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

class QuadTree {
    boundary: Rectangle;
    capacity: number = 4;
    points: Point[] = [];

    constructor( boundary : Rectangle, capacity : number)
    {
        this.boundary = boundary;
        this.capacity = capacity;
    }

    insert(p: Point) {
        if( this.points.length < this.capacity)
        {
            this.points.push(p);
        }
        else
        {

        }
    }
}