<script setup lang="ts">
import {ImagePreview} from "@varlet/ui";
import obj from './index'
import even from './even'
import {onBeforeMount} from "vue";
onBeforeMount(() => even.init())
</script>


<template>
  <div class="flex flex-col gap-5 m-5">
    <div class="flex flex-col gap-5 top-0 sticky bg-body z-1 pt-5">
      <div class="flex gap-5">
        <var-button size="small" @click="even.connect()">{{obj.state.connect?'断开':'连接'}}设备</var-button>
        <var-uploader v-model="obj.files" multiple hide-list>
          <var-button size="small">上传图片</var-button>
        </var-uploader>
        <var-button size="small" @click="even.start()">{{obj.state.flag?'停止':'开始'}}采集</var-button>
        <var-button size="small" v-if="obj.data.length">查看数据</var-button>
      </div>
      <var-divider/>
    </div>
    <div class="flex gap-5 flex-wrap" v-if="obj.files.length">
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
            <var-icon name="delete" class="hover:cursor-pointer" title="删除" @click="even.del(index)"/>
          </div>
          <div class="flex items-center justify-between">
            <small>持续时间(s)</small>
            <var-counter v-model="item.duration" min="1" decimal-length="1" :elevation="false"  input-text-size="11px" button-size="25"/>
          </div>
        </div>
      </var-card>
    </div>
    <div class="flex flex-col gap-5" v-else>

    </div>
  </div>
</template>