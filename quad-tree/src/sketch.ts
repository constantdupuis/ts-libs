/**
 * 
 */
function setup() {
  
  createCanvas(windowWidth, windowHeight);
  background(45, 33, 46);

  let qtree = new QuadTree( new Rectangle(0, 0, windowWidth, windowHeight), 4); 

  console.log(qtree);

  for( let i = 0; i < 1; i++)
  {
    let p = new Point(random(windowWidth), random(windowHeight));
    qtree.insert(p);
  }
}

/**
 * 
 */
function draw() {
  noStroke();
  circle(10,10,5);
}