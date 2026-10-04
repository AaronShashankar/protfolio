/* Shared mutable state (objects so every module sees live values) */
export const pointer = {
  mx: 0, my: 0, mxs: 0, mys: 0,          // normalised -1..1 (raw + smoothed)
  cx: -100, cy: -100, cxs: -100, cys: -100, // cursor px (raw + smoothed)
  fine: matchMedia('(hover:hover) and (pointer:fine)').matches
};

export const layout = {
  vw: innerWidth,
  vh: innerHeight,
  tops: [],     // top offset of each [data-sec]
  hsDist: 0     // horizontal-scroll distance of the pinned work track
};
