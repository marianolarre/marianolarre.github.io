setFunction({
  name: "rgbpack",
  type: "combine",
  inputs: [
    { name: "texG", type: "sampler2D" },
    { name: "texB", type: "sampler2D" }
  ],
  glsl: `
  vec4 rS = _c0;
  vec4 gS = texture2D(texG, _st);
  vec4 bS = texture2D(texB, _st);

  float r = dot(rS.rgb, vec3(0.299, 0.587, 0.114));
  float g = dot(gS.rgb, vec3(0.299, 0.587, 0.114));
  float b = dot(bS.rgb, vec3(0.299, 0.587, 0.114));

  return vec4(r, g, b, 1.0);
  `
})