// terrain_generator.js

let cols, rows;
let scl = 20;        // Scale of each grid cell
let w = 1200;        // Width of the terrain
let h = 800;         // Height of the terrain

let terrain = [];
let flying = 0;

// Interactive controls
let intensitySlider, noiseSlider, speedSlider;

// Variables for slider DOM elements
let intensityLabel, noiseLabel, speedLabel;

function setup() {
  // Create canvas and attach it to the sketch-container div
  let canvas = createCanvas(1000, 800, WEBGL);
  canvas.parent('sketch-container');

  // Calculate number of columns and rows based on scale
  cols = Math.floor(w / scl);
  rows = Math.floor(h / scl);

  // Initialize the terrain array with zero heights
  for (let x = 0; x < cols; x++) {
    terrain[x] = [];
    for (let y = 0; y < rows; y++) {
      terrain[x][y] = 0;
    }
  }

  // Access the sliders from the DOM
  intensitySlider = select('#intensitySlider');
  noiseSlider = select('#noiseSlider');
  speedSlider = select('#speedSlider');
}

function draw() {
  background(0);        // Set background to black
  stroke(255);          // Set stroke color to white
  noFill();             // Disable fill for shapes

  // Enable orbit control for mouse interaction
  orbitControl();

  // Update flying variable based on speed slider
  flying -= speedSlider.value();

  let yoff = flying;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      // Generate height using Perlin noise
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -intensitySlider.value(), intensitySlider.value());
      xoff += noiseSlider.value(); // Increment x offset based on noise slider
    }
    yoff += noiseSlider.value(); // Increment y offset based on noise slider
  }

  // Lighting
  ambientLight(50);
  directionalLight(255, 255, 255, 0, -1, -1);

  // Rotate the terrain for a better 3D view
  rotateX(PI / 3);

  // Center the terrain
  translate(-w / 2, -h / 2, 0);

  // Draw the terrain using TRIANGLE_STRIP for efficient rendering
  for (let y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }
}
