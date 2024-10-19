let cols, rows;
let scl = 18; // Scale of each grid cell
let w = 1200;   // Width 
let h = 800;   // Height

let terrain = [];
let flying = 0;

let intensitySlider, noiseSlider, speedSlider;

function setup() {
  let canvas = createCanvas(1000, 800, WEBGL);
  canvas.parent('sketch-container');
  cols = Math.floor(w / scl);
  rows = Math.floor(h / scl);

  for (let x = 0; x < cols; x++) {
    terrain[x] = [];
    for (let y = 0; y < rows; y++) {
      terrain[x][y] = 0;
    }
  }
  intensitySlider = select('#intensitySlider');
  noiseSlider = select('#noiseSlider');
  speedSlider = select('#speedSlider');
  smooth();
}

function draw() {
  background(0);  
  stroke(255);   
  noFill(); 


  flying -= speedSlider.value();

  let yoff = flying;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -intensitySlider.value(), intensitySlider.value());
      xoff += noiseSlider.value(); 
    }
    yoff += noiseSlider.value(); 
  }

  ambientLight(50);
  directionalLight(255, 255, 255, 0, -1, -1);

  rotateX(PI / 3);
  translate(-w / 2, -h / 2, 0);

  for (let y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }
}