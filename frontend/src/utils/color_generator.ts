export function generateRandomColor(colorsToGenerate: number) {
  let arr = [];
  for (let i = 0; i < colorsToGenerate; i++) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    arr.push("rgb(" + r + "," + g + "," + b + ")");
  }
  return arr;
}
