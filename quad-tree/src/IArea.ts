interface IArea {
  x: number;
  y: number;
  w: number;
  h: number;

  contains(p: IPosisionable): boolean;
  intersects(r: IArea): boolean;
}
