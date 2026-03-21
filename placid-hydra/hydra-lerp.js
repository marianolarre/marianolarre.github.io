setFunction({
  name: "lerp",
  type: "combine",
  inputs: [
    { name: "lowTex", type: "sampler2D" },
    { name: "highTex", type: "sampler2D" }
  ],
  glsl: `
  return a * (1.0 - _c0) + b * _c0;
  `
})