import {reactive} from "vue";
import {defineStore} from "pinia";

export default defineStore('pinia',() => reactive({
    files:[]
}))