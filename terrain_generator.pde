int cols, rows;
int scl = 20;
int w = 2200;
int h = 1000;

float[][] terrain;
float flying = 0;

void setup() {
    size(1000,800, P3D);
  
    cols = w / scl;
    rows = h / scl;
    
    terrain = new float[cols][rows];
         
}

void draw(){
  flying -= 0.01;
  
   float ioff = flying;
    for(int i = 0; i < rows; i++){
        float joff = 0;
        for(int j = 0; j < cols; j++){
          terrain[j][i] = map(noise(joff,ioff), 0, 1, -100, 100);
          joff += 0.1;
        } 
        ioff +=0.1;
        }  
    background(0);
    stroke(255);
    noFill();
    
    translate(width/2, height/2);
    rotateX(PI/3);
    
    translate(-w/2, -h/2);

    for(int i = 0; i < rows -1 ; i++){
        beginShape(TRIANGLE_STRIP);
        for(int j = 0; j < cols; j++){
          vertex(j * scl, i * scl, terrain[j][i]);
          vertex(j * scl, (i+1) * scl, terrain[j][i+1]);

            //rect(i * scl, j * scl, scl, scl);
        }
        endShape();
    }
}
