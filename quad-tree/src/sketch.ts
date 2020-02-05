let qtree : QuadTree;


/**
 *
 */
function setup() {
  createCanvas(windowWidth, windowHeight);

  background('#2D142C');

  qtree = new QuadTree(new Rectangle(20, 20, windowWidth-40, windowHeight-40), 8);

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

  background('#2D142C');

  qtree.forEach((e: QuadTree) => {
    // draw boundaries
    rectMode(CORNER)
    stroke('#801336');
    noFill();
    rect(e.boundary.x, e.boundary.y, e.boundary.w, e.boundary.h);
    
    // draw points 
    e.points.forEach((e:Point)=>{
      stroke('#C92A42');
      fill('#C92A42');
      circle(e.x, e.y, 5);
    });
  });

  if( mouseIsPressed === true && mouseButton === RIGHT )
  {
    rectMode(CORNER);
    let range = new Rectangle( mouseX - 40, mouseY - 20, 80, 40);
    
    stroke('#EE4540');
    noFill();
    rect(range.x, range.y, range.w, range.h);

    let found : Point[] = qtree.query(range);

    found.forEach((p:Point)=>{
      stroke('#8FB9A8');
      fill('#8FB9A8');
      circle(p.x, p.y, 5);
    });

  }else if (mouseIsPressed === true && mouseButton === LEFT) {
    // add points at mouse pos
    for( let i = 0; i< 5; i++)
    {
      qtree.insert( new Point(mouseX + random(-5,5), mouseY + random(-5,5)));
    }
  }

}
