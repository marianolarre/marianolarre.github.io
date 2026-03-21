setFunction({
  name: "lerp",
  type: "combine",
  inputs: [
    { name: "a", type: "vec4" },
    { name: "b", type: "vec4" }
  ],
  glsl: `
  return a * (1.0 - _c0) + b * _c0;
  `
})