setFunction({
  name: "lerp",
  type: "color",
  inputs: [
    { name: "low", type: "float", default: 0.0 },
    { name: "high", type: "float", default: 1.0 }
  ],
  glsl: `
  vec4 c = _c0;
  float t = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  float v = mix(low, high, t);
  return vec4(vec3(v), c.a);
  `
})