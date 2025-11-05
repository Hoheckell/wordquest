<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Clock, Zap } from 'lucide-vue-next'
import type { Question } from '../data/missions'
import MultipleChoice from './questions/MultipleChoice.vue'
import TrueFalse from './questions/TrueFalse.vue'
import DragDrop from './questions/DragDrop.vue'
import Flashcard from './questions/Flashcard.vue'
import CaseStudy from './questions/CaseStudy.vue'

interface Props {
  question: Question
  questionNumber: number
  totalQuestions: number
  streak: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'answer', answer: string | string[], timeSpent: number): void
}>()

const userAnswer = ref<string | string[]>('')
const timeLeft = ref(props.question.timeLimit)
const startTime = Date.now()
let timerInterval: number | undefined

const progress = computed(() => (props.questionNumber / props.totalQuestions) * 100)
const canSubmit = computed(() => {
  if (Array.isArray(userAnswer.value)) {
    return userAnswer.value.every(item => item !== '')
  }
  return userAnswer.value !== ''
})

const questionComponents = {
  'multiple-choice': MultipleChoice,
  'true-false': TrueFalse,
  'drag-drop': DragDrop,
  'flashcard': Flashcard,
  'case-study': CaseStudy,
}
const currentQuestionComponent = computed(() => questionComponents[props.question.type])

const submitAnswer = () => {
  if (timerInterval) clearInterval(timerInterval)
  const timeSpent = (Date.now() - startTime) / 1000
  emit('answer', userAnswer.value, timeSpent)
}

onMounted(() => {
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      submitAnswer()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full animate-fade-in">
    <header class="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white">
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
          Questão {{ questionNumber }}/{{ totalQuestions }}
        </span>
        <div class="flex items-center gap-3">
          <span v-if="streak > 0" class="text-sm font-semibold bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full flex items-center gap-1">
            <Zap class="w-4 h-4" /> {{ streak }} em sequência
          </span>
          <div class="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            <Clock class="w-5 h-5" />
            <span class="font-bold text-base tabular-nums">{{ timeLeft }}s</span>
          </div>
        </div>
      </div>
      <div class="w-full bg-white/20 rounded-full h-2.5">
        <div class="bg-white h-2.5 rounded-full transition-all duration-500" :style="{ width: progress + '%' }"></div>
      </div>
    </header>
    
    <main class="p-6 md:p-8">
      <h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-6">{{ question.question }}</h2>
      
      <component
        :is="currentQuestionComponent"
        :question="question"
        v-model="userAnswer"
        @submit="submitAnswer"
      />
      
      <button
        @click="submitAnswer"
        :disabled="!canSubmit"
        class="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        Confirmar Resposta
      </button>
    </main>
  </div>
</template>
