setFunction({
  name: "rgpack",
  type: "combine",
  inputs: [
    { name: "texG", type: "sampler2D" }
  ],
  glsl: `
  vec4 rS = _c0;
  vec4 gS = texture2D(texG, _st);

  float r = dot(rS.rgb, vec3(0.299, 0.587, 0.114));
  float g = dot(gS.rgb, vec3(0.299, 0.587, 0.114));

  return vec4(r, g, 0.0, 1.0);
  `
})