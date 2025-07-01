import {VarFile} from "@varlet/ui";

export interface ComFile extends VarFile{
    duration:number
    select:boolean
}

export interface Img{
    url:string
    duration:number
}

export interface CollectionItems extends Img{
    count:number
}