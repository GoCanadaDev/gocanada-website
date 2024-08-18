const encode = (data: { [key: string]: unknown }) =>
  Object.keys(data)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(data[key] as string)}`
    )
    .join("&")

function postFormUrlEncoded<T>(formName: string, values: T) {
  // Netlify will accept form submissions to any valid URL
  // by submitting to a static file we skip Remix's POST catcher
  fetch("/favicon.ico", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encode({
      "form-name": formName,
      ...values,
    }),
  })
    .then(() => {
      // window.location.href = "/thanks/"
    })
    .catch((error) => alert(error))
}

export default postFormUrlEncoded
