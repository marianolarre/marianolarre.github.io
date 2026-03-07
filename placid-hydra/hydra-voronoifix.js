setFunction({
  name: "voronoifix",
  type: "src",
  inputs: [
    {name:"scale", type:"float", default:5},
    {name:"speed", type:"float", default:1},
    {name:"blending", type:"float", default:0.1}
  ],
  glsl: `
  vec3 color = vec3(.0);
  // Scale
  _st *= scale;
  // Tile the space
  vec2 i_st = floor(_st);
  vec2 f_st = fract(_st);
  float m_dist = 10.;  // minimun distance
  vec2 m_point;        // minimum point
  for(int j = -1; j <= 1; j++) {
    for(int i = -1; i <= 1; i++) {
      vec2 neighbor = vec2(float(i), float(j));
      vec2 p = i_st + neighbor;
      vec2 point = fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
      point = 0.5 + 0.5 * sin(time * speed + 6.2831 * point);
      vec2 diff = neighbor + point - f_st;
      float dist = length(diff);
      if(dist < m_dist) {
        m_dist = dist;
        m_point = point;
      }
    }
  }
  // Assign a color using the closest point position
  color += dot(m_point, vec2(.3, .6)) * (1.0-blending);
  color += blending * (1.0-m_dist);
  return vec4(color, 1.0);
  `
})