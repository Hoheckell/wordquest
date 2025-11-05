<script setup lang="ts">
import { CheckCircle, XCircle, Lightbulb, Zap, ArrowRight } from 'lucide-vue-next'

interface Props {
  correct: boolean
  explanation: string
  earnedPoints: number
  streak: number
  isLastQuestion: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'next'): void
  (e: 'complete'): void
}>()
</script>

<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
      <div
        :class="correct ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'"
        class="p-8 text-white text-center"
      >
        <component :is="correct ? CheckCircle : XCircle" class="w-20 h-20 mx-auto mb-4" />
        <h2 class="text-4xl font-bold mb-2">{{ correct ? 'Correto!' : 'Ops!' }}</h2>
        <p class="text-xl opacity-90">{{ correct ? 'Você mandou bem!' : 'Não foi dessa vez, mas continue tentando!' }}</p>
        
        <div v-if="correct" class="mt-6 flex justify-center gap-4">
          <div class="bg-white/20 px-6 py-3 rounded-xl">
            <div class="text-3xl font-bold">+{{ earnedPoints }}</div>
            <div class="text-sm opacity-80">Pontos</div>
          </div>
          <div v-if="streak > 1" class="bg-white/20 px-6 py-3 rounded-xl">
            <div class="text-3xl font-bold flex items-center gap-1"><Zap class="w-6 h-6 fill-current" />{{ streak }}</div>
            <div class="text-sm opacity-80">Sequência</div>
          </div>
        </div>
      </div>
      
      <div class="p-8">
        <div class="flex items-start gap-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4 mb-8">
          <Lightbulb class="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h3 class="font-bold text-blue-900 mb-1">Explicação:</h3>
            <p class="text-gray-700">{{ explanation }}</p>
          </div>
        </div>
        
        <button
          @click="isLastQuestion ? emit('complete') : emit('next')"
          class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          {{ isLastQuestion ? 'Ver Resultados' : 'Próxima Questão' }}
          <ArrowRight class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
