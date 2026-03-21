setFunction({
  name: "lerp",
  type: "combine",
  inputs: [
    { name: "lowTex", type: "sampler2D" },
    { name: "highTex", type: "sampler2D" }
  ],
  glsl: `
  float t = dot(_c0.rgb, vec3(0.299, 0.587, 0.114));

  vec4 low = texture2D(lowTex, _st);
  vec4 high = texture2D(highTex, _st);

  return mix(low, high, t);
  `
})