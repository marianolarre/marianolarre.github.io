setFunction({
  name: "bayer",
  type: "src",
  inputs: [
    { name: "size", type: "float", default: 8.0 }
  ],
  glsl: `
  vec2 st = floor(_st * size);
  vec2 p = mod(st, 4.0);

  float x = p.x;
  float y = p.y;

  // helper masks (0 or 1)
  float x0 = 1.0 - step(1.0, x);                // x == 0
  float x1 = step(1.0, x) - step(2.0, x);       // x == 1
  float x2 = step(2.0, x) - step(3.0, x);       // x == 2
  float x3 = step(3.0, x);                      // x == 3

  float y0 = 1.0 - step(1.0, y);
  float y1 = step(1.0, y) - step(2.0, y);
  float y2 = step(2.0, y) - step(3.0, y);
  float y3 = step(3.0, y);

  // exact matrix reconstruction
  float index =
      y0*(x0*0.0  + x1*8.0  + x2*2.0  + x3*10.0) +
      y1*(x0*12.0 + x1*4.0  + x2*14.0 + x3*6.0 ) +
      y2*(x0*3.0  + x1*11.0 + x2*1.0  + x3*9.0 ) +
      y3*(x0*15.0 + x1*7.0  + x2*13.0 + x3*5.0 );

  float v = index / 16.0;

  return vec4(vec3(v), 1.0);
  `
})