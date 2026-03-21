function encode<T extends Record<string, string>>(data: T) {
  return Object.keys(data)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(data[key] as string)}`
    )
    .join("&")
}

async function postFormUrlEncoded<T extends Record<string, string>>(values: T) {
  const response = await fetch("https://gocanada-website.netlify.app/contact-form", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encode(values),
  })

  if (!response.ok) {
    throw new Error(`Netlify form submit failed: ${response.status}`)
  }
}

export default postFormUrlEncoded
