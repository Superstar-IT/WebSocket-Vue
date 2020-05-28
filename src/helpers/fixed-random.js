export default function fixedRandom (p) {
  const seed = 43758.5453123
  return (Math.abs(Math.sin(p)) * seed) % 1
}
