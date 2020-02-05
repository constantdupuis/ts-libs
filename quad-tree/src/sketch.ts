/**
 *
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(45, 33, 46);

  let qtree = new QuadTree(new Rectangle(20, 20, windowWidth-40, windowHeight-40), 4);

  console.log(qtree);

  for (let i = 0; i < 100; i++) {
    let p = new Point(random(windowWidth), random(windowHeight));
    qtree.insert(p);
  }

  qtree.forEach((e: QuadTree) => {
    stroke('red');
    noFill();
    rect(e.boundary.x, e.boundary.y, e.boundary.w, e.boundary.h);
    e.points.forEach((e:Point)=>{
      stroke('white');
      fill('whitte');
      circle(e.x, e.y, 5);
    });
  });



  noLoop();
}

/**
 * 
 */
function draw() {
  noStroke();
  circle(10, 10, 5);
}
