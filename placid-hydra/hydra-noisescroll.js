setFunction({
  name: "noisescroll",
  type: "coord",
  inputs: [
    {name:"x", type:"float", default:0},
    {name:"y", type:"float", default:0}
  ],
  glsl: `
  _st.x += time * x;
  _st.y += time * y;
  return fract(_st);
  `
})