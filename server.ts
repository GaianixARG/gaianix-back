import { config } from './src/config/env'
import { appLocal } from './src/index.local.'
import { appTesting } from './src/index.testing'

let app = appLocal
if (config.nodeEnv !== 'production') {
  const port = config.port
  app.listen(port, () => {
    console.log(`🚀 Gaianix backend running on http://localhost:${port}`)
    console.log(`📑 Swagger docs: http://localhost:${config.port}/api/docs`)
  })
} else {
  app = appTesting
}

export default app
