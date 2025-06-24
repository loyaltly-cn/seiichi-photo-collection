import obj from "./index";
import {Dialog, Snackbar} from "@varlet/ui";

const init = () =>{

}

const connect = async () =>{
    try {
        if (!obj.state.connect){
            obj.serial.port = await navigator.serial.requestPort()
            await obj.serial.port.open({ baudRate: 115200 });
            obj.serial.writer = obj.serial.port.writable?.getWriter()
            obj.serial.reader = obj.serial.port.readable?.getReader()
            send('*IDN?\r\n')
            read_loop()
            obj.state.connect = !obj.state.connect
        }else disconnect()
    } catch (e) {
        Snackbar.error('设备连接失败')
    }
}

const disconnect = async () => {
    try {
        await obj.serial.reader?.cancel()
        obj.serial.reader?.releaseLock()
        obj.serial.writer?.releaseLock()
        await obj.serial.port?.close()

        obj.serial.port = obj.serial.reader = obj.serial.writer = null
    } catch (e) {
        console.error("断开失败", e)
    }
}

const start = () =>{
    if (!obj.files.length) return Snackbar.error('请上传图片')
    if (!obj.serial.writer) return Snackbar.warning('未连接设备')
    obj.state.flag?send('ACQ:STOP'):send('ACQ:CONT')
    obj.state.flag = !obj.state.flag

}

const del = async (index:number) => actions[await Dialog('删除此图片?')](index)

const actions = {
    confirm: (index:number) => obj.files.splice(index,1),
    cancel: () => {},
    close: () => {},
}

const read_loop = async () =>{
    if (!obj.serial.reader) return
    try {
        while (true){
            const {value,done} = await obj.serial.reader.read()
            if (done)break
            if (value){
                const text = new TextDecoder().decode(value)
                console.log(text)
            }
        }
    }catch (e){
        console.log(e)
    }
}

const send = async (text:string) =>{
    if (obj.serial.writer){
        const data = new TextEncoder().encode(text)
        await obj.serial.writer.write(data)
    }

}


export default {
    init,
    connect,
    start,
    del
}