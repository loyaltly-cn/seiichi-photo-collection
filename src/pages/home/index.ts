import {reactive} from "vue";
import {ComFile} from "./interface.ts";


export default reactive({
    state:{
        connect:false,
        flag:false,
        loading:false,
        popup:false
    },
    files:[] as ComFile[],
    data:[],
    serial:{
        reader:null as ReadableStreamDefaultReader|null,
        port:null as SerialPort|null,
        writer:null as WritableStreamDefaultWriter|null,
        ltz:true,
        pwr:0,
        rate:0,
        tf:0
    },
    count:1,
    delay:0,
    current:''
})