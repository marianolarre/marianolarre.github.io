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

  // split into bits
  float x0 = mod(x, 2.0);
  float y0 = mod(y, 2.0);
  float x1 = floor(x / 2.0);
  float y1 = floor(y / 2.0);

  // B2 function: 2*y + (x XOR y)
  float b2_low  = 2.0 * y0 + abs(x0 - y0);
  float b2_high = 2.0 * y1 + abs(x1 - y1);

  // recursive composition
  float index = 4.0 * b2_high + b2_low;

  float v = index / 16.0;

  return vec4(vec3(v), 1.0);
  `
})