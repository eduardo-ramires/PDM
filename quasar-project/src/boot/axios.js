import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Vercel injeta esta variável de ambiente
// VITE_ é o prefixo padrão do Vite (que o Quasar usa)
const api = axios.create({ baseURL: process.env.VITE_API_URL })

// ... exportar 'api' e injetar no app

export default boot(({ app }) => {
  app.config.globalProperties.$api = api
})

export { api }