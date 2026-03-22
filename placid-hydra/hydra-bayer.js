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

  // extract bits
  float x0 = mod(x, 2.0);
  float x1 = floor(x / 2.0);
  float y0 = mod(y, 2.0);
  float y1 = floor(y / 2.0);

  // Bayer index (bit interleave pattern)
  float index =
      x1 * 8.0 +
      y1 * 4.0 +
      x0 * 2.0 +
      y0 * 1.0;

  float v = index / 16.0;

  return vec4(vec3(v), 1.0);
  `
})