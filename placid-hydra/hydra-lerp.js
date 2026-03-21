setFunction({
  name: "lerp",
  type: "combine",
  inputs: [
    { name: "a", type: "sampler2D" },
    { name: "b", type: "sampler2D" }
  ],
  glsl: `
  return a * (1.0 - _c0) + b * _c0;
  `
})