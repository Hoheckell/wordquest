<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, UserPlus, Trophy } from 'lucide-vue-next'
import { supabase } from '../lib/supabase'
import type { Player } from '../lib/supabase'

const emit = defineEmits<{
  (e: 'playerReady', player: Player): void
}>()

const screen = ref<'initial' | 'name' | 'anonymous'>('initial')
const playerName = ref('')
const loading = ref(false)

const handlePlayerAction = async (isAnonymous: boolean) => {
  if (!isAnonymous && !playerName.value.trim()) return
  
  loading.value = true
  
  try {
    const displayName = isAnonymous ? `Anônimo_${Math.floor(Math.random() * 10000)}` : playerName.value.trim()
    
    // Using RPC to handle player creation/retrieval
    const { data, error } = await supabase
      .rpc('get_or_create_player', {
        p_display_name: displayName,
        p_is_anonymous: isAnonymous
      })
      .select()
      .single()

    if (error) throw error
    
    if (data) {
      localStorage.setItem('wordquest_player_id', data.id)
      emit('playerReady', data as Player)
    }
  } catch (error) {
    console.error('Erro ao configurar jogador:', error)
    alert('Não foi possível iniciar o jogo. Tente novamente.')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const playerId = localStorage.getItem('wordquest_player_id')
  if (playerId) {
    loading.value = true
    const { data: player, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', playerId)
      .single()
    
    if (player) {
      emit('playerReady', player)
    } else {
      localStorage.removeItem('wordquest_player_id') // Clean up invalid ID
    }
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full text-center">
      <div class="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-2xl">
        <Trophy class="w-12 h-12 text-purple-600" />
      </div>
      <h1 class="text-5xl md:text-6xl font-extrabold text-white mb-4">Word Quest</h1>
      <p class="text-xl text-purple-100">Domine o Microsoft Word com missões interativas.</p>
      
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mt-12 max-w-md mx-auto">
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
          <p class="text-white mt-4">Carregando seu progresso...</p>
        </div>
        
        <div v-else-if="screen === 'initial'" class="space-y-4 animate-fade-in">
          <h2 class="text-2xl font-bold text-white mb-6">Como deseja jogar?</h2>
          <button @click="screen = 'name'" class="w-full flex items-center justify-center gap-3 bg-white text-purple-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-100 transition-all transform hover:scale-105 shadow-lg">
            <User class="w-6 h-6" />
            Jogar com Meu Nome
          </button>
          <button @click="handlePlayerAction(true)" class="w-full flex items-center justify-center gap-3 bg-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/40 transition-all transform hover:scale-105">
            <UserPlus class="w-6 h-6" />
            Jogar Anonimamente
          </button>
        </div>
        
        <div v-else-if="screen === 'name'" class="space-y-4 animate-fade-in">
          <h2 class="text-2xl font-bold text-white mb-6">Digite seu nome</h2>
          <input
            v-model="playerName"
            type="text"
            placeholder="Seu nome aqui..."
            class="w-full px-5 py-3 rounded-lg border-2 border-transparent bg-white/20 text-white placeholder-purple-200 focus:bg-white/30 focus:border-purple-300 focus:outline-none text-lg text-center"
            @keyup.enter="handlePlayerAction(false)"
            maxlength="20"
          />
          <button @click="handlePlayerAction(false)" :disabled="!playerName.trim()" class="w-full bg-white text-purple-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-100 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            Começar Aventura
          </button>
          <button @click="screen = 'initial'" class="w-full mt-2 text-purple-200 hover:text-white py-2">
            &larr; Voltar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
