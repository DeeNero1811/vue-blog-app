import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

/* GLOBAL ERROR HANDLER */
app.config.errorHandler = (err, instance, info) => {
  console.error("Global Error:", err)
  console.error("Info:", info)
}

app.mount('#app')