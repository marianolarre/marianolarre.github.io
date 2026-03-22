setFunction({
  name: "colorgradient",
  type: "color",
  inputs: [
    { name: "rA", type: "float", default: 0.0 },
    { name: "gA", type: "float", default: 0.0 },
    { name: "bA", type: "float", default: 0.0 },
    { name: "rB", type: "float", default: 1.0 },
    { name: "gB", type: "float", default: 1.0 },
    { name: "bB", type: "float", default: 1.0 }
  ],
  glsl: `
  vec4 c = _c0;
  float t = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  vec3 colA = vec3(rA, gA, bA);
  vec3 colB = vec3(rB, gB, bB);
  vec3 result = mix(colA, colB, t);
  return vec4(result, c.a);
  `
})