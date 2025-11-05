<script setup lang="ts">
import { computed } from 'vue'
import { Lightbulb } from 'lucide-vue-next'
import type { Question } from '../../data/missions'

interface Props {
  question: Question
  modelValue: string | string[]
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'submit'])

const answer = computed({
  get: () => props.modelValue as string,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="space-y-4">
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-r-lg p-4 flex items-center gap-3">
      <Lightbulb class="w-6 h-6 text-yellow-600" />
      <p class="text-sm text-gray-700 font-medium">Digite a resposta correta e pressione Enter ou clique em confirmar.</p>
    </div>
    <input
      v-model="answer"
      type="text"
      placeholder="Sua resposta..."
      class="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:outline-none text-lg text-center"
      @keyup.enter="emit('submit')"
    />
  </div>
</template>
