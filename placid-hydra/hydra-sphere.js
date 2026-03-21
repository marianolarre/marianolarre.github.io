setFunction({
  name: "sphere",
  type: "src",
  inputs: [
    { name: "radius", type: "float", default: 1 }
  ],
  glsl: `
  vec2 st = _st * 2.0 - 1.0;
  float dist = length(st);
  float r = dist / radius;
  float h = sqrt(max(0.0, 1.0 - r * r));
  h *= step(r, 1.0);
  return vec4(vec3(h), 1.0);
  `
})