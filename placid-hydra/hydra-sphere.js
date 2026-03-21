setFunction({
  name: "sphere",
  type: "src",
  inputs: [
    { name: "radius", type: "float", default: 0.5 },
    { name: "strength", type: "float", default: 1.0 }
  ],
  glsl: `
  // center coords to [-1, 1]
  vec2 st = _st * 2.0 - 1.0;

  float dist = length(st);

  // normalize radius space
  float r = dist / radius;

  // sphere profile (hemisphere)
  float h = sqrt(max(0.0, 1.0 - r * r));

  // apply contrast shaping
  h = pow(h, strength);

  // outside the sphere → black
  h *= step(r, 1.0);

  return vec4(vec3(h), 1.0);
  `
})