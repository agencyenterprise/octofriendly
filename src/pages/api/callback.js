export default async function handler(req, res) {
  console.log(req.query)
  const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${req.query.code}`,
    {
      headers: {
        accept: 'application/json',
      },
    }
  )
  const json = await response.json()
  console.log(json)
  if (json && json.access_token) {
    res.send({ token: json.access_token })
    return
  }
  res.send({ token: '' })
}