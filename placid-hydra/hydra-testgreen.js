{
  const getHydra = function () {
    const whereami = window.location?.href?.includes("hydra.ojack.xyz")
      ? "editor"
      : window.atom?.packages
      ? "atom"
      : "idk";

    if (whereami === "editor") return window.hydraSynth;

    if (whereami === "atom") {
      return global.atom.packages.loadedPackages["atom-hydra"]
        .mainModule.main.hydra;
    }

    return [
      window.hydraSynth,
      window._hydra,
      window.hydra,
      window.h,
      window.H,
      window.hy
    ].find(h => h?.regl);
  };

  window._hydra = getHydra();
  window._hydraScope = _hydra.sandbox?.makeGlobal ? window : _hydra.synth;
}

setFunction({
  name: "testgreen",
  type: "src",
  inputs: [],
  glsl: `
  return vec4(0.0,1.0,0.0,1.0);
`
});