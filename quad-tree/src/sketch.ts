class Particle implements IPosisionable {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

let qtree: QuadTree<Particle>;

/**
 *
 */
function setup() {
  createCanvas(windowWidth, windowHeight);

  background("#2D142C");

  qtree = new QuadTree<Particle>(
    new Boundary(20, 20, windowWidth - 40, windowHeight - 40),
    8
  );
}

/**
 *
 */
function draw() {
  background("#2D142C");

  qtree.forEach((e: QuadTree<Particle>) => {
    // draw boundaries
    rectMode(CORNER);
    stroke("#801336");
    noFill();
    rect(e.boundary.x, e.boundary.y, e.boundary.w, e.boundary.h);

    // draw points
    e.points.forEach((e: Particle) => {
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

    let found: Particle[] = qtree.query(range);

    found.forEach((p: Particle) => {
      stroke("#8FB9A8");
      fill("#8FB9A8");
      circle(p.x, p.y, 5);
    });
  } else if (mouseIsPressed === true && mouseButton === LEFT) {
    // add points at mouse pos
    for (let i = 0; i < 5; i++) {
      qtree.insert(
        new Particle(mouseX + random(-5, 5), mouseY + random(-5, 5))
      );
    }
  }
}
