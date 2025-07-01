import obj from "./index";
import {Dialog, Snackbar} from "@varlet/ui";
import {type Img , type CollectionItems} from "./interface";
import day from '../../modules/day';
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
        }else disconnect()

        obj.state.connect = !obj.state.connect
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

const start = async() =>{
    if (!obj.files.length) return Snackbar.error('请上传图片')
    if (!obj.serial.writer) return Snackbar.warning('未连接设备')
    await send(`CFG:RATE ${obj.serial.rate}\r\n`)
    await send(`SRC:LTZ ${obj.serial.ltz?1:0}\r\n`)
    await send(`SRC:PWR ${obj.serial.pwr}\r\n`)
    await send(`SRC:TF ${obj.serial.tf}\r\n`)
    obj.state.flag?send('ACQ:STOP\r\n'):send('ACQ:CONT\r\n')
    obj.state.flag = !obj.state.flag
    handler()
}

const handler = () =>{
    const imgs:Array<Img> = []
    obj.files.forEach(file =>{
        if(!file.select && file.url)imgs.push({
            url:file.url,
            duration:file.duration
        })
    })

    const collectionItems:Array<CollectionItems> = []
    for (let i = 0; i < obj.count; i++) {
        imgs.forEach(img => {
            collectionItems.push({
                ...img,
                count: i 
            });
        });
    }
    
    let currentIndex = 0;
    
    obj.state.popup = true
    const timer = setInterval(() => {
        const currentItem = collectionItems[currentIndex];

        // 设置当前播放的 URL
        obj.current = currentItem.url;

        // 减少当前项的 duration
        currentItem.duration--;

        if (currentItem.duration <= 0) {
            currentIndex++;

            if (currentIndex >= collectionItems.length) {
                    clearInterval(timer); // 播放完毕，停止定时器
                    console.log("播放完成");
                    send('ACQ:STOP\r\n')
                    obj.state.flag = false
                    obj.state.popup = false; // 关闭弹窗
                    
                }
            }
        }, 1000); // 每秒执行一次

    }

const del = async (index:number) => actions[await Dialog('删除此图片?')](index)

const actions = {
    confirm: (index:number) => obj.files.splice(index,1),
    cancel: () => {},
    close: () => {},
}

const decoder = new TextDecoder();
let buffer = '';


const read_loop = async () =>{
    if (!obj.serial.reader) return
    try {
        while (true){
            const {value,done} = await obj.serial.reader.read()
            if (done)break
             if (value && obj.state.flag) {
                buffer += decoder.decode(value, { stream: true });  // 不强制结束流
                let lineEndIndex;

                while ((lineEndIndex = buffer.indexOf('\r\n')) !== -1) {
                    const line = buffer.slice(0, lineEndIndex);  // 提取完整一行
                    buffer = buffer.slice(lineEndIndex + 2);     // 去除处理过的部分
                    // console.log('Received line:', line);         // 你可以在这里做进一步处理
                    const arr: Array<number> = line.split(',').map(Number);
                    console.log({
                        arr,
                        time: day().format('YYYY-MM-DD HH:mm:ss'),
                    });
                    
                    
                }
            }
        }
    }catch (e){
        console.log(e)
    }
}

const send = async (text:string) =>{
    console.log('发送指令:', text)
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