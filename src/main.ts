import { createApp } from "vue";
import App from "./App.vue";
import Varlet from '@varlet/ui'
import '@varlet/ui/es/style'
import init from './modules/init'
import router from './modules/router'
import {createPinia} from "pinia";
import './css/global.css'
import './css/transition.css'
import 'virtual:uno.css'
import '@varlet/touch-emulator'

createApp(App)
    .use(createPinia)
    .use(Varlet)
    .use(router)
    .mount("#app")
    .$nextTick().then(_ => init())
