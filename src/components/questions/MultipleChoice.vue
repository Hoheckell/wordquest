<script setup lang="ts">
import { computed } from 'vue'
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
  <div class="space-y-3">
    <button
      v-for="option in question.options"
      :key="option"
      @click="selectedAnswer = option"
      :class="[
        'w-full text-left p-4 border-2 rounded-xl transition-all text-gray-800 font-medium',
        selectedAnswer === option ? 'border-purple-600 bg-purple-50 shadow-md' : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
      ]"
    >
      {{ option }}
    </button>
  </div>
</template>
