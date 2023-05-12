import { getWebFlowAuthorizationUrl } from '@octokit/oauth-methods'

export default async function handler(req, res) {
  const { url } = getWebFlowAuthorizationUrl({
    clientType: 'oauth-app',
    clientId: process.env.GITHUB_CLIENT_ID,
    scopes: ['user:follow', 'read:org'],
  })
  res.redirect(url)
}
