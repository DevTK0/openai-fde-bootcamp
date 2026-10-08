// Perspective FOV is vertical: a narrow, tall dashboard panel needs a longer
// camera distance to keep the entire bus inside its horizontal field of view.
export function cameraDistanceScale(aspect: number) {
  return aspect > 0 ? Math.max(1, 1.7 / aspect) : 1
}
