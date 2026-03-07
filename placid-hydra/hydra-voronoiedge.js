{
    const getHydra = function () {
        const whereami = window.location?.href?.includes("hydra.ojack.xyz")
            ? "editor"
            : window.atom?.packages
            ? "atom"
            : "idk";
        if (whereami === "editor") {
            return window.hydraSynth;
        }
        if (whereami === "atom") {
            return global.atom.packages.loadedPackages["atom-hydra"]
                .mainModule.main.hydra;
        }
        let _h = [
            window.hydraSynth,
            window._hydra,
            window.hydra,
            window.h,
            window.H,
            window.hy
        ].find(h => h?.regl);
        return _h;
    };
    window._hydra = getHydra();
    window._hydraScope = _hydra.sandbox.makeGlobal ? window : _hydra.synth;
}

_hydra.setFunction({
  name: "voronoiedge",
  type: "src",
  inputs: [
    {name:"scale", type:"float", default:5},
    {name:"speed", type:"float", default:1},
    {name:"blending", type:"float", default:0.1}
  ],
  glsl: `

vec4 voronoiedge(vec2 _st, float scale, float speed, float blending){

  _st *= scale;

  vec2 i_st = floor(_st);
  vec2 f_st = fract(_st);

  float F1 = 1e9;
  float F2 = 1e9;

  for(int j=-1;j<=1;j++){
    for(int i=-1;i<=1;i++){

      vec2 neighbor = vec2(float(i),float(j));
      vec2 p = i_st + neighbor;

      vec2 point = fract(sin(vec2(
        dot(p,vec2(127.1,311.7)),
        dot(p,vec2(269.5,183.3))
      ))*43758.5453);

      point = 0.5 + 0.5*sin(time*speed + 6.2831*point);

      vec2 diff = neighbor + point - f_st;
      float dist = length(diff);

      if(dist < F1){
        F2 = F1;
        F1 = dist;
      } else if(dist < F2){
        F2 = dist;
      }

    }
  }

  float edge = F2 - F1;
  edge = 1.0 - smoothstep(0.0,blending,edge);

  return vec4(vec3(edge),1.0);
}
`
})