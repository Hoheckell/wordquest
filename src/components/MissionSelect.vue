<script setup lang="ts">
import { computed } from 'vue'
import { Clock, Star, Trophy, Award } from 'lucide-vue-next'
import * as Icons from 'lucide-vue-next'
import { missions } from '../data/missions'
import type { Player, PlayerProgress } from '../lib/supabase'

interface Props {
  player: Player
  progress: PlayerProgress[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'startMission', missionId: string): void
  (e: 'viewLeaderboard'): void
  (e: 'viewBadges'): void
}>()

const getIconComponent = (iconName: string) => (Icons as any)[iconName] || Icons.HelpCircle

const getMissionProgress = (missionId: string) => {
  return props.progress?.find(p => p.mission_id === missionId)
}

const completedMissionsCount = computed(() => {
  return props.progress?.filter(p => p.completed).length || 0
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <header class="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-800">Olá, {{ player.display_name }}! 👋</h1>
            <p class="text-gray-600 mt-1">Escolha uma missão e continue sua jornada de aprendizado.</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <button @click="emit('viewBadges')" class="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition-all shadow-md">
              <Award class="w-5 h-5" /> Badges
            </button>
            <button @click="emit('viewLeaderboard')" class="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition-all shadow-md">
              <Trophy class="w-5 h-5" /> Ranking
            </button>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div class="bg-purple-100/60 rounded-xl p-4">
            <div class="text-3xl font-bold text-purple-600">{{ player.total_points.toLocaleString() }}</div>
            <div class="text-sm font-medium text-purple-800">Pontos Totais</div>
          </div>
          <div class="bg-blue-100/60 rounded-xl p-4">
            <div class="text-3xl font-bold text-blue-600">{{ completedMissionsCount }}/{{ missions.length }}</div>
            <div class="text-sm font-medium text-blue-800">Missões Completas</div>
          </div>
          <div class="bg-pink-100/60 rounded-xl p-4">
            <div class="text-3xl font-bold text-pink-600">{{ player.total_badges }}</div>
            <div class="text-sm font-medium text-pink-800">Badges Conquistados</div>
          </div>
        </div>
      </header>
      
      <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="mission in missions"
          :key="mission.id"
          class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden cursor-pointer group"
          @click="emit('startMission', mission.id)"
        >
          <div :class="mission.color" class="h-2.5"></div>
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div :class="`${mission.color} bg-opacity-10`" class="p-3 rounded-xl">
                <component :is="getIconComponent(mission.icon)" :class="mission.color.replace('bg-', 'text-')" class="w-8 h-8" />
              </div>
              <div v-if="getMissionProgress(mission.id)?.completed" class="flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                <Star class="w-4 h-4 fill-current" /> Completo
              </div>
            </div>
            
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ mission.title }}</h3>
            <p class="text-gray-600 text-sm mb-6 h-10">{{ mission.description }}</p>
            
            <div class="flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center gap-1.5">
                <Clock class="w-4 h-4" /> {{ mission.estimatedTime }} min
              </div>
              <div
                :class="{
                  'bg-green-100 text-green-700': mission.difficulty === 'easy',
                  'bg-yellow-100 text-yellow-700': mission.difficulty === 'medium',
                  'bg-red-100 text-red-700': mission.difficulty === 'hard'
                }"
                class="px-3 py-1 rounded-full font-semibold capitalize"
              >
                {{ mission.difficulty }}
              </div>
            </div>

            <div v-if="getMissionProgress(mission.id)" class="mt-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="h-2 rounded-full" :class="mission.color" style="width: 100%"></div>
              </div>
              <div class="text-right text-xs font-semibold mt-1" :class="mission.color.replace('bg-','text-')">{{ getMissionProgress(mission.id)?.score }} pts</div>
            </div>

          </div>
        </div>
      </main>
    </div>
  </div>
</template>
