export function extractCss(rawCss, filter) {
  let result = rawCss
  let re =
    /\s*\/\*\s*__play_start_(base|components|utilities)__\s*\*\/(.*?)\/\*\s*__play_end_\1__\s*\*\//gs
  if (filter.length === 0) {
    result = result.replace(re, (_match, _layerName, layerCss) => layerCss)
  } else {
    let chunks = []
    let match
    while ((match = re.exec(result)) !== null) {
      let [, layerName, layerCss] = match
      if (filter.includes(layerName)) {
        let trimmedCss = layerCss.trim()
        if (trimmedCss) {
          chunks.push(trimmedCss)
        }
      }
    }
    result = chunks.join('\n\n')
  }
  result = result.trim().replace(/\n{3,}/g, '\n\n')
  if (result.trim() !== '') {
    result = result + '\n'
  }
  return result
}
