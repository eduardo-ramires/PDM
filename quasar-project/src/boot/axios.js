import { boot } from 'quasar/wrappers'
import axios from 'axios'

// !! MUITO IMPORTANTE !!
// Substitua pelo endereço IP da máquina onde seu backend (API) está rodando.
// Não use 'localhost' se for testar no celular ou emulador.
const api = axios.create({ baseURL: 'http://172.20.10.2:3000/api' }) // <--- TROQUE O IP AQUI

export default boot(({ app }) => {
  app.config.globalProperties.$api = api
})

export { api }