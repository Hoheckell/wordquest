<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Trophy, Medal, Award, X } from 'lucide-vue-next'
import { supabase } from '../lib/supabase'
import type { LeaderboardEntry } from '../lib/supabase'

const emit = defineEmits<{ (e: 'close'): void }>()

const leaderboard = ref<LeaderboardEntry[]>([])
const loading = ref(true)

const getRankIcon = (index: number) => {
  if (index === 0) return { icon: Trophy, class: 'text-yellow-400' }
  if (index === 1) return { icon: Medal, class: 'text-gray-400' }
  if (index === 2) return { icon: Medal, class: 'text-orange-500' }
  return { icon: Award, class: 'text-purple-500' }
}

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select('*, players(display_name, is_anonymous)')
      .order('total_score', { ascending: false })
      .limit(20)
    
    if (error) throw error
    leaderboard.value = data as LeaderboardEntry[]
  } catch (error) {
    console.error('Erro ao carregar leaderboard:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
      <header class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center flex-shrink-0">
        <div>
          <h2 class="text-3xl font-bold">🏆 Ranking Global</h2>
          <p class="text-purple-100">Os 20 melhores jogadores de Word Quest</p>
        </div>
        <button @click="emit('close')" class="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
          <X class="w-6 h-6" />
        </button>
      </header>
      
      <main class="p-6 overflow-y-auto">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p class="text-gray-600 mt-4">Carregando ranking...</p>
        </div>
        <div v-else-if="leaderboard.length === 0" class="text-center py-12">
          <Trophy class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-gray-700">O Ranking está vazio!</h3>
          <p class="text-gray-500">Seja o primeiro a marcar pontos e aparecer aqui.</p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="(entry, index) in leaderboard"
            :key="entry.player_id"
            :class="{
              'bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300 scale-105 shadow-lg': index === 0,
              'bg-gradient-to-r from-gray-200 to-gray-100 border border-gray-300': index === 1,
              'bg-gradient-to-r from-orange-200 to-orange-100 border border-orange-300': index === 2,
              'bg-white border border-gray-200': index > 2
            }"
            class="rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-md hover:border-purple-300"
          >
            <div class="flex items-center gap-4 w-16">
              <span class="text-2xl font-bold text-gray-500 w-8 text-center">{{ index + 1 }}º</span>
              <component :is="getRankIcon(index).icon" :class="getRankIcon(index).class" class="w-8 h-8 flex-shrink-0" />
            </div>
            <div class="flex-1">
              <div class="font-bold text-lg text-gray-800">{{ entry.players.display_name }}</div>
              <div class="text-sm text-gray-500">{{ entry.missions_completed }} missões completas</div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-purple-600">{{ entry.total_score.toLocaleString() }}</div>
              <div class="text-xs text-gray-500">pontos</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
