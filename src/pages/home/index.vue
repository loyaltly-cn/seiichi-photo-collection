<script setup lang="ts">
import {ImagePreview} from "@varlet/ui";
import obj from './index'
import even from './even'
import render from'./render'
import {onBeforeMount} from "vue";
onBeforeMount(() => even.init())
</script>


<template>
  <div class="flex gap-5 m5">
    <div class="flex flex-col gap-5 p5 bg-surfaceContainerLow rounded-5 var-elevation--2 min-w-50">
      <var-uploader v-model="obj.files" multiple hide-list>
        <var-button size="small">上传图片</var-button>
      </var-uploader>
      <var-button size="small" @click="even.connect()">{{obj.state.connect?'断开':'连接'}}设备</var-button>
      <var-divider/>
      <div class="flex gap-5 items-center">
        <small>激光探针</small>
        <var-switch v-model="obj.serial.ltz"/>
      </div>
      <div class="flex flex-col gap-2 items-center">
        <var-divider />
        <small class="w-50%">激光功率{{obj.serial.pwr }}%</small>
        <var-slider  v-model="obj.serial.pwr"/>
        <var-divider />
      </div>
      <div class="flex flex-col gap-2">
        <small>采样率(sps)</small>
         <var-radio-group v-model="obj.serial.rate" >
          <var-radio v-for="(item,index) in render.rate" :key="index" :checked-value="item.value">{{ item.label }}</var-radio>
        </var-radio-group>
      </div>
       <div class="flex flex-col gap-2">
        <small>发生器输出</small>
         <var-radio-group v-model="obj.serial.tf" >
          <var-radio v-for="(item,index) in render.tf" :key="index" :checked-value="item.value">{{ item.label }}</var-radio>
        </var-radio-group>
      </div>
      <div class="flex gap-5 items-center">
        <small>图片轮询次数</small>
        <var-counter v-model="obj.count" min="1" decimal-length="0" :elevation="false"  input-text-size="11px" button-size="25"/>
      </div>
      <div class="flex gap-5 items-center">
        <small>延时时间 ( s ) </small>
        <var-counter v-model="obj.delay" min="1" decimal-length="0" :elevation="false"  input-text-size="11px" button-size="25"/>
      </div>
      <var-button size="small" @click="even.start()">{{obj.state.flag?'停止':'开始'}}采集</var-button>
      <var-button size="small" v-if="obj.data.length">查看数据</var-button>
    </div>
    <div class="flex gap-5 flex-wrap">
      <var-card v-for="(item,index) in obj.files" :key="index" class="w-58 h-54">
        <template #image>
          <var-image :src="item.cover" width="230" height="230" @click="ImagePreview(item.cover || '')"/>
        </template>
        <div class="flex gap-2 flex-col">
          <div class="flex gap-5 items-center justify-between">
            <div class="flex gap-5 items-center">
              <small>图片{{index+1}}</small>
              <var-icon :name="item.select?'checkbox-blank-outline':'checkbox-marked'" @click="item.select=!item.select" :transition="100" class="hover-cursor-pointer" v-ripple/>
            </div>
            <var-icon name="delete" class="hover:cursor-pointer hover:color-red" title="删除" @click="even.del(index)"/>
          </div>
          <div class="flex items-center justify-between">
            <small>持续时间(s)</small>
            <var-counter v-model="item.duration" min="1" decimal-length="1" :elevation="false"  input-text-size="11px" button-size="25"/>
          </div>
        </div>
      </var-card>
    </div>
    <var-uploader v-model="obj.files" multiple hide-list  v-if="!obj.files.length">
      <div class="flex flex-col gap-5 items-center bg-surfaceContainerHigh p10 rounded-5 var-elevation--2 hover-cursor-pointer">
        <var-icon name="image-outline"  class="bg-body p5 rounded-24" size="50"/>
        <h1>Drop image here or click to upload</h1>
        <h3 class="color-primary">PNG,JPG or GIF</h3>
      </div>
    </var-uploader>
    <var-popup v-model:show="obj.state.popup" :elevation="2" :close-on-click-overlay="false" :close-on-key-escape="false" class="flex flex-col gap-5 items-center">
      <small>采集中...</small>
      <small>当前循环次数{{ obj.count }}</small>
      <var-image :src="obj.current"></var-image>
    </var-popup>
  </div>
</template>
