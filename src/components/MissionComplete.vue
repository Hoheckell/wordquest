<script setup lang="ts">
import { computed } from 'vue'
import { Trophy, Star, Award, Home, RefreshCw } from 'lucide-vue-next'
import { getBadgeInfo } from '../data/missions'
import * as Icons from 'lucide-vue-next'
import type { Badge } from '../lib/supabase'

interface Props {
  missionTitle: string
  totalScore: number
  correctAnswers: number
  totalQuestions: number
  earnedBadges: Badge[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'returnHome'): void
  (e: 'retry'): void
}>()

const accuracy = computed(() => {
  if (props.totalQuestions === 0) return 0
  return Math.round((props.correctAnswers / props.totalQuestions) * 100)
})

const performanceMessage = computed(() => {
  if (accuracy.value === 100) return 'Desempenho Perfeito! 🏆'
  if (accuracy.value >= 80) return 'Excelente Trabalho! 🌟'
  if (accuracy.value >= 60) return 'Bom Trabalho! 👍'
  return 'Continue Praticando! 💪'
})

const getIconComponent = (iconName: string) => (Icons as any)[iconName] || Icons.Award
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
    <div class="max-w-4xl w-full animate-fade-in">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-32 h-32 bg-white rounded-full mb-6 shadow-2xl animate-bounce-trophy">
          <Trophy class="w-20 h-20 text-yellow-500" />
        </div>
        <h1 class="text-5xl font-extrabold text-white mb-4">Missão Concluída!</h1>
        <h2 class="text-2xl text-purple-100">{{ missionTitle }}</h2>
        <p class="text-xl text-purple-200 mt-2">{{ performanceMessage }}</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center text-white shadow-xl">
          <Star class="w-12 h-12 text-yellow-300 mx-auto mb-3" />
          <div class="text-4xl font-bold mb-2">{{ totalScore.toLocaleString() }}</div>
          <div class="opacity-80">Pontos Ganhos</div>
        </div>
        <div class="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center text-white shadow-xl">
          <Award class="w-12 h-12 text-pink-300 mx-auto mb-3" />
          <div class="text-4xl font-bold mb-2">{{ accuracy }}%</div>
          <div class="opacity-80">de Acerto</div>
        </div>
        <div class="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center text-white shadow-xl">
          <CheckCircle class="w-12 h-12 text-green-300 mx-auto mb-3" />
          <div class="text-4xl font-bold mb-2">{{ correctAnswers }}/{{ totalQuestions }}</div>
          <div class="opacity-80">Respostas Corretas</div>
        </div>
      </div>
      
      <div v-if="earnedBadges.length > 0" class="bg-white/20 backdrop-blur-md rounded-2xl p-8 mb-8 shadow-xl">
        <h3 class="text-2xl font-bold text-white mb-6 text-center">🏅 Badges Conquistados!</h3>
        <div class="flex flex-wrap justify-center gap-4">
          <div
            v-for="badge in earnedBadges"
            :key="badge.id"
            class="flex items-center gap-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 shadow-md"
          >
            <component :is="getIconComponent(getBadgeInfo(badge.badge_type).icon)" class="w-10 h-10 text-white flex-shrink-0" />
            <div>
              <div class="font-bold text-white">{{ getBadgeInfo(badge.badge_type).name }}</div>
              <div class="text-sm text-yellow-100">{{ getBadgeInfo(badge.badge_type).description }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-4">
        <button @click="emit('returnHome')" class="flex-1 flex items-center justify-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all shadow-xl">
          <Home class="w-6 h-6" /> Voltar ao Início
        </button>
        <button @click="emit('retry')" class="flex-1 flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
          <RefreshCw class="w-6 h-6" /> Tentar Novamente
        </button>
      </div>
    </div>
  </div>
</template>
