<script setup lang="ts">
import { ref, onMounted } from 'vue'
import WelcomeScreen from './components/WelcomeScreen.vue'
import MissionSelect from './components/MissionSelect.vue'
import QuestionCard from './components/QuestionCard.vue'
import FeedbackScreen from './components/FeedbackScreen.vue'
import MissionComplete from './components/MissionComplete.vue'
import Leaderboard from './components/Leaderboard.vue'
import BadgesView from './components/BadgesView.vue'
import { useGameLogic } from './composables/useGameLogic'
import { supabase } from './lib/supabase'
import type { Player, PlayerProgress } from './lib/supabase'

type GameScreen = 'welcome' | 'mission-select' | 'playing' | 'feedback' | 'complete' | 'leaderboard' | 'badges'

const currentScreen = ref<GameScreen>('welcome')
const currentPlayer = ref<Player | null>(null)
const playerProgress = ref<PlayerProgress[]>([])
const showFeedback = ref(false)
const lastAnswerCorrect = ref(false)
const lastEarnedPoints = ref(0)
const secretPassword = ref('')
const showResetPrompt = ref(false)

const {
  gameState,
  currentMission,
  currentQuestion,
  isLastQuestion,
  submitAnswer,
  nextQuestion,
  completeMission,
  startMission,
  resetGame,
  calculatePoints,
} = useGameLogic()

const handlePlayerReady = async (player: Player) => {
  currentPlayer.value = player
  gameState.value.currentPlayer = player
  await loadPlayerProgress()
  currentScreen.value = 'mission-select'
}

const loadPlayerProgress = async () => {
  if (!currentPlayer.value) return
  const { data, error } = await supabase
    .from('player_progress')
    .select('*')
    .eq('player_id', currentPlayer.value.id)
  
  if (error) {
    console.error('Error loading player progress:', error)
    playerProgress.value = []
  } else {
    playerProgress.value = data || []
  }
}

const handleStartMission = (missionId: string) => {
  startMission(missionId)
  currentScreen.value = 'playing'
}

const handleAnswer = async (answer: string | string[], timeSpent: number) => {
  const correct = await submitAnswer(answer, timeSpent)
  lastAnswerCorrect.value = correct
  
  if (correct && currentQuestion.value) {
    lastEarnedPoints.value = calculatePoints(correct, timeSpent, currentQuestion.value.difficulty)
  } else {
    lastEarnedPoints.value = 0
  }
  
  showFeedback.value = true
}

const handleNextQuestion = () => {
  showFeedback.value = false
  if (!isLastQuestion.value) {
    nextQuestion()
  } else {
    handleCompleteMission()
  }
}

const handleCompleteMission = async () => {
  showFeedback.value = false
  await completeMission()
  
  // Refresh player data to get updated points and badges count
  if (currentPlayer.value) {
    const { data: updatedPlayer, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', currentPlayer.value.id)
      .single()
    
    if (updatedPlayer) {
      currentPlayer.value = updatedPlayer
      gameState.value.currentPlayer = updatedPlayer
    }
  }
  
  await loadPlayerProgress()
  currentScreen.value = 'complete'
}

const handleReturnHome = () => {
  currentScreen.value = 'mission-select'
}

const handleRetry = () => {
  if (gameState.value.currentMission) {
    handleStartMission(gameState.value.currentMission)
  }
}

const handleResetData = async () => {
  if (secretPassword.value === 'RESET2025' && currentPlayer.value) {
    await supabase.rpc('reset_player_data', { p_player_id: currentPlayer.value.id })
    localStorage.removeItem('wordquest_player_id')
    resetGame()
    currentPlayer.value = null
    playerProgress.value = []
    currentScreen.value = 'welcome'
    showResetPrompt.value = false
    secretPassword.value = ''
    alert('Dados do jogador resetados com sucesso!')
  } else {
    alert('Senha incorreta ou jogador não encontrado!')
  }
}

onMounted(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
      e.preventDefault()
      showResetPrompt.value = true
    }
  }
  window.addEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="min-h-screen font-sans">
    <WelcomeScreen
      v-if="currentScreen === 'welcome'"
      @player-ready="handlePlayerReady"
    />
    
    <MissionSelect
      v-else-if="currentScreen === 'mission-select' && currentPlayer"
      :player="currentPlayer"
      :progress="playerProgress"
      @start-mission="handleStartMission"
      @view-leaderboard="currentScreen = 'leaderboard'"
      @view-badges="currentScreen = 'badges'"
    />
    
    <div v-else-if="currentScreen === 'playing'" class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8 flex items-center justify-center">
      <QuestionCard
        v-if="currentQuestion && currentMission"
        :key="currentQuestion.id"
        :question="currentQuestion"
        :question-number="gameState.currentQuestionIndex + 1"
        :total-questions="currentMission.questions.length"
        :streak="gameState.streak"
        @answer="handleAnswer"
      />
    </div>
    
    <FeedbackScreen
      v-if="showFeedback && currentQuestion"
      :correct="lastAnswerCorrect"
      :explanation="currentQuestion.explanation"
      :earned-points="lastEarnedPoints"
      :streak="gameState.streak"
      :is-last-question="isLastQuestion"
      @next="handleNextQuestion"
      @complete="handleCompleteMission"
    />
    
    <MissionComplete
      v-else-if="currentScreen === 'complete' && currentMission"
      :mission-title="currentMission.title"
      :total-score="gameState.lastMissionScore"
      :correct-answers="gameState.answers.filter(a => a.correct).length"
      :total-questions="gameState.answers.length"
      :earned-badges="gameState.earnedBadges"
      @return-home="handleReturnHome"
      @retry="handleRetry"
    />
    
    <Leaderboard
      v-if="currentScreen === 'leaderboard'"
      @close="currentScreen = 'mission-select'"
    />
    
    <BadgesView
      v-if="currentScreen === 'badges' && currentPlayer"
      :player-id="currentPlayer.id"
      @close="currentScreen = 'mission-select'"
    />
    
    <div v-if="showResetPrompt" class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 class="text-2xl font-bold text-gray-800 mb-4">🔒 Resetar Dados</h3>
        <p class="text-gray-600 mb-6">Esta ação é irreversível e apagará todo o seu progresso, pontos e badges. Digite a senha secreta para confirmar:</p>
        
        <input
          v-model="secretPassword"
          type="password"
          placeholder="Senha secreta..."
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none mb-6"
          @keyup.enter="handleResetData"
        />
        
        <div class="flex gap-3">
          <button
            @click="showResetPrompt = false; secretPassword = ''"
            class="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleResetData"
            class="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Resetar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
