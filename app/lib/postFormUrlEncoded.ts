function encode<T extends Record<string, string>>(data: T) {
  return Object.keys(data)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(data[key] as string)}`
    )
    .join("&")
}

async function postFormUrlEncoded<T extends Record<string, string>>(values: T) {
  fetch("https://gocanada-website.netlify.app/contact-form", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encode(values),
  })
}

export default postFormUrlEncoded
