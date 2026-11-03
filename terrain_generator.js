let cols, rows;
let scl = 18; // Scale of each grid cell
let w, h;     // Terrain size, derived from the canvas so it always fills the view

let terrain = [];
let flying = 0;

let intensitySlider, noiseSlider, speedSlider;

// The canvas fills #sketch-container, whatever size the window is.
function containerSize() {
  const el = document.getElementById('sketch-container');
  return { cw: Math.max(1, el.clientWidth), ch: Math.max(1, el.clientHeight) };
}

// Size the terrain mesh to the canvas: a bit wider than the view so the tilted
// far edge still spans it, and tall enough to reach the bottom of the screen.
function buildTerrain() {
  w = width * 1.25;
  h = height * 1.1;
  cols = Math.ceil(w / scl) + 1;
  rows = Math.ceil(h / scl) + 1;
  terrain = [];
  for (let x = 0; x < cols; x++) {
    terrain[x] = [];
    for (let y = 0; y < rows; y++) {
      terrain[x][y] = 0;
    }
  }
}

function setup() {
  const { cw, ch } = containerSize();
  let canvas = createCanvas(cw, ch, WEBGL);
  canvas.parent('sketch-container');
  buildTerrain();
  intensitySlider = select('#intensitySlider');
  noiseSlider = select('#noiseSlider');
  speedSlider = select('#speedSlider');
  smooth();
}

function windowResized() {
  const { cw, ch } = containerSize();
  resizeCanvas(cw, ch);
  buildTerrain();
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

  // tilt the mesh back and center it in the canvas
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
