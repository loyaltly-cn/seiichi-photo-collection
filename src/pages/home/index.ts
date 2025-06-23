import {reactive} from "vue";
import {ComFile} from "./interface.ts";


export default reactive({
    state:{
        connect:false,
        flag:false
    },
    files:[] as ComFile[],
    data:[],
    serial:{
        reader:null as ReadableStreamDefaultReader|null,
        port:null as SerialPort|null,
        writer:null as WritableStreamDefaultWriter|null,
    }
})