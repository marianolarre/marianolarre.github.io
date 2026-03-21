setFunction({
  name: "polar",
  type: "coord",
  inputs: [
    { name: "zoom", type: "float", default: 1.0 },
    { name: "twist", type: "float", default: 0.0 }
  ],
  glsl: `
  vec2 st = _st * 2.0 - 1.0;
  float angle = atan(st.y, st.x);
  float radius = length(st);
  float u = (angle + 3.14159265) / (2.0 * 3.14159265);
  float v = radius * zoom;
  u += twist * radius;
  return vec2(u, v);
  `
})