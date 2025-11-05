<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X, Award } from 'lucide-vue-next'
import * as Icons from 'lucide-vue-next'
import { supabase } from '../lib/supabase'
import { getBadgeInfo } from '../data/missions'
import type { Badge } from '../lib/supabase'

interface Props {
  playerId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'close'): void }>()

const badges = ref<Badge[]>([])
const loading = ref(true)

const getIconComponent = (iconName: string) => (Icons as any)[iconName] || Icons.Award

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('player_id', props.playerId)
      .order('earned_at', { ascending: false })
    
    if (error) throw error
    badges.value = data || []
  } catch (error) {
    console.error('Erro ao carregar badges:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
      <header class="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white flex justify-between items-center flex-shrink-0">
        <div>
          <h2 class="text-3xl font-bold">🏅 Suas Conquistas</h2>
          <p class="text-yellow-100">{{ badges.length }} badges conquistados até agora</p>
        </div>
        <button @click="emit('close')" class="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
          <X class="w-6 h-6" />
        </button>
      </header>
      
      <main class="p-6 overflow-y-auto">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          <p class="text-gray-600 mt-4">Carregando suas conquistas...</p>
        </div>
        <div v-else-if="badges.length === 0" class="text-center py-12">
          <Award class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-gray-700">Nenhum badge ainda!</h3>
          <p class="text-gray-500">Complete missões e desafios para ganhar badges.</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="badge in badges"
            :key="badge.id"
            class="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-5 hover:shadow-lg hover:border-yellow-300 transition-all"
          >
            <div class="flex items-center gap-4">
              <component :is="getIconComponent(getBadgeInfo(badge.badge_type).icon)" :class="getBadgeInfo(badge.badge_type).color" class="w-12 h-12 flex-shrink-0" />
              <div>
                <h3 class="font-bold text-lg text-gray-800">{{ getBadgeInfo(badge.badge_type).name }}</h3>
                <p class="text-sm text-gray-600">{{ getBadgeInfo(badge.badge_type).description }}</p>
                <p class="text-xs text-gray-500 mt-2">
                  Conquistado em: {{ new Date(badge.earned_at).toLocaleDateString('pt-BR') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
