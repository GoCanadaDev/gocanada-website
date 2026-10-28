export const loader = () => {
  const robotText = `User-agent: *
Allow: /
Disallow: /arctic-passage-2026
Disallow: /wp-admin/
Disallow: /wp-login/
Disallow: /login/
Disallow: /register/
Disallow: /password-reset/
Disallow: /en-CA
Disallow: /sftp-config.json
Disallow: /.vscode
Disallow: /.well-known/
Disallow: /wp-includes/
Disallow: /xmlrpc.php

Sitemap: https://gocanada.com/sitemap.xml
`

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
