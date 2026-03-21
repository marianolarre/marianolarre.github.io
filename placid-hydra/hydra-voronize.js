setFunction({
  name: "voronize",
  type: "coord",
  inputs: [
    {name:"scale", type:"float", default:10},
    {name:"speed", type:"float", default:0}
  ],
  glsl: `
  // Scale space
  vec2 st = _st * scale;

  vec2 i_st = floor(st);
  vec2 f_st = fract(st);

  float m_dist = 10.0;
  vec2 m_point;
  vec2 m_cell;

  for(int j = -1; j <= 1; j++) {
    for(int i = -1; i <= 1; i++) {
      vec2 neighbor = vec2(float(i), float(j));

      vec2 cell = i_st + neighbor;

      // random point in cell
      vec2 point = fract(sin(vec2(
        dot(cell, vec2(127.1, 311.7)),
        dot(cell, vec2(269.5, 183.3))
      )) * 43758.5453);

      // optional animation
      point = 0.5 + 0.5 * sin(time * speed + 6.2831 * point);

      vec2 diff = neighbor + point - f_st;
      float dist = dot(diff, diff);

      if(dist < m_dist) {
        m_dist = dist;
        m_point = point;
        m_cell = cell;
      }
    }
  }

  // THIS is the key:
  // reconstruct the world-space position of the winning Voronoi site
  vec2 finalPoint = (m_cell + m_point) / scale;

  return finalPoint;
  `
})