setFunction({
  name: "aspect",
  type: "src",
  inputs: [
    {name:"asp", type:"float", default:1}
  ],
  glsl: `
  vec2 xy = _st - vec2(0.5, 0.5);
  xy *= (1.0 / vec2(asp, 1));
  xy += vec2(0.5, 0.5);
  return xy;
  `
})