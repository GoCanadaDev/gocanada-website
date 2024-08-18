const encode = (data: { [key: string]: unknown }) =>
  Object.keys(data)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(data[key] as string)}`
    )
    .join("&")

async function postFormUrlEncoded<T>(baseUrl: string, values: T) {
  fetch("https://gocanada-website.netlify.app/contact-form", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encode({ values }),
  })
    .then(() => {
      // window.location.href = "/thanks/"
    })
    .catch((error) => alert(error))
}

export default postFormUrlEncoded
