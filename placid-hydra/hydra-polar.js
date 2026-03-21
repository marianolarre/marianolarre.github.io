setFunction({
  name: "polar",
  type: "coord",
  inputs: [
    { name: "zoom", type: "float", default: 1.0 },
    { name: "twist", type: "float", default: 0.0 }
  ],
  glsl: `
  // center to [-1, 1]
  vec2 st = _st * 2.0 - 1.0;

  // polar coordinates
  float angle = atan(st.y, st.x);
  float radius = length(st);

  // normalize
  float u = (angle + 3.14159265) / (2.0 * 3.14159265);
  float v = radius * zoom;

  // optional twist (adds rotation based on radius)
  u += twist * radius;

  return vec2(u, v);
  `
})