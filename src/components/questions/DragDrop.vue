<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Question } from '../../data/missions'

interface Props {
  question: Question
  modelValue: string | string[]
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'submit'])

const droppedItems = ref<Record<string, string>>({}) // zoneId -> itemId

const onDragStart = (event: DragEvent, itemId: string) => {
  event.dataTransfer!.setData('text/plain', itemId)
  event.dataTransfer!.effectAllowed = 'move'
}

const onDrop = (event: DragEvent, zoneId: string) => {
  const itemId = event.dataTransfer!.getData('text/plain')
  
  // Un-assign from other zones if already dropped
  Object.keys(droppedItems.value).forEach(key => {
    if (droppedItems.value[key] === itemId) {
      delete droppedItems.value[key]
    }
  })

  droppedItems.value[zoneId] = itemId
}

const getItemText = (itemId: string) => {
  return props.question.dragItems?.find(item => item.id === itemId)?.text || ''
}

onMounted(() => {
  // Initialize droppedItems for each zone
  props.question.dropZones?.forEach(zone => {
    droppedItems.value[zone.id] = ''
  })
})

watch(droppedItems, (newValue) => {
  const orderedAnswers = props.question.dropZones?.map(zone => newValue[zone.id] || '') || []
  emit('update:modelValue', orderedAnswers)
}, { deep: true })
</script>

<template>
  <div class="space-y-6">
    <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
      <h3 class="font-semibold text-blue-900 mb-3">Arraste os itens abaixo:</h3>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="item in question.dragItems"
          :key="item.id"
          :draggable="!Object.values(droppedItems).includes(item.id)"
          @dragstart="onDragStart($event, item.id)"
          :class="[
            'bg-white border-2 border-blue-300 px-4 py-2 rounded-lg font-medium text-gray-800 transition-opacity',
            Object.values(droppedItems).includes(item.id) ? 'opacity-40 cursor-not-allowed' : 'cursor-move'
          ]"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    
    <div class="space-y-3">
      <div
        v-for="zone in question.dropZones"
        :key="zone.id"
        @drop.prevent="onDrop($event, zone.id)"
        @dragover.prevent
        class="border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center gap-4 min-h-[80px] hover:border-purple-400 transition-colors"
      >
        <div class="text-gray-600 font-medium flex-shrink-0">{{ zone.label }}</div>
        <div class="flex-grow text-center">
          <div v-if="droppedItems[zone.id]" class="bg-purple-100 border-2 border-purple-300 px-4 py-2 rounded-lg font-medium text-gray-800 inline-block">
            {{ getItemText(droppedItems[zone.id]) }}
          </div>
          <div v-else class="text-gray-400 text-sm italic">
            Solte aqui
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
