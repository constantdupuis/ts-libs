let qtree : QuadTree;


/**
 *
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(45, 33, 46);

  qtree = new QuadTree(new Rectangle(20, 20, windowWidth-40, windowHeight-40), 4);

  console.log(qtree);

  // for (let i = 0; i < 1000; i++) {
  //   let p = new Point(random(windowWidth), random(windowHeight));
  //   qtree.insert(p);
  // }


}

/**
 * 
 */
function draw() {

  background('#3B8183');

  if (mouseIsPressed) {
    if (mouseButton === LEFT) {
      // add point at mouse pos
      qtree.insert( new Point(mouseX, mouseY));
    }else if (mouseButton === RIGHT) {
      // query point in the mouse area
    }
  }

  qtree.forEach((e: QuadTree) => {
    stroke('#FF9C5B');
    noFill();
    rect(e.boundary.x, e.boundary.y, e.boundary.w, e.boundary.h);
    
    e.points.forEach((e:Point)=>{
      stroke('#ED303C');
      fill('#ED303C');
      circle(e.x, e.y, 5);
    });
  });

}
