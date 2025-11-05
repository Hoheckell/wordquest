<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle, XCircle } from 'lucide-vue-next'
import type { Question } from '../../data/missions'

interface Props {
  question: Question
  modelValue: string | string[]
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const selectedAnswer = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <button
      @click="selectedAnswer = 'true'"
      :class="[
        'p-6 border-2 rounded-xl transition-all hover:shadow-md text-center',
        selectedAnswer === 'true' ? 'border-purple-600 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
      ]"
    >
      <CheckCircle class="w-10 h-10 mx-auto mb-2 text-green-500" />
      <span class="block font-bold text-lg text-gray-800">Verdadeiro</span>
    </button>
    <button
      @click="selectedAnswer = 'false'"
      :class="[
        'p-6 border-2 rounded-xl transition-all hover:shadow-md text-center',
        selectedAnswer === 'false' ? 'border-purple-600 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
      ]"
    >
      <XCircle class="w-10 h-10 mx-auto mb-2 text-red-500" />
      <span class="block font-bold text-lg text-gray-800">Falso</span>
    </button>
  </div>
</template>
