export const loader = () => {
  const robotText = `
        User-agent: Googlebot
        Disallow: /nogooglebot/
        
        User-agent: *
        Allow: /
        Disallow: /wp-admin/
        Disallow: /wp-login/
        Disallow: /login/
        Disallow: /register/
        Disallow: /password-reset/
        Disallow: /en-CA
        Disallow: /sftp-config.json
        Disallow: /.vscode
        Disallow: /ads.txt
        Disallow: /.well-known/
        Disallow: /wp-includes/
        Disallow: /xmlrpc.php`

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
