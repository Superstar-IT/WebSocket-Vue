export default function extractCouchId (id) {
  const parts = id.split('|')
  return parts[2]
}
