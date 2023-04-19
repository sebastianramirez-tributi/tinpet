import { H } from 'highlight.run'

export function initializeHighlight(workSpaceId, env) {
  H.init(workSpaceId, {
    enableStrictPrivacy: false,
    environment: env,
    networkRecording: {
      enabled: true,
      recordHeadersAndBody: true,
    },
    version: process.env.APP_VERSION,
  })
  return H
}
