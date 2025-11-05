import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { missions } from '../data/missions'
import type { Player, Badge } from '../lib/supabase'
import type { Question } from '../data/missions'

export interface GameState {
  currentPlayer: Player | null
  currentMission: string | null
  currentQuestionIndex: number
  streak: number
  startTime: number
  answers: Array<{ questionId: string; correct: boolean; timeSpent: number }>
  earnedBadges: Badge[]
  lastMissionScore: number
}

export function useGameLogic() {
  const gameState = ref<GameState>({
    currentPlayer: null,
    currentMission: null,
    currentQuestionIndex: 0,
    streak: 0,
    startTime: 0,
    answers: [],
    earnedBadges: [],
    lastMissionScore: 0,
  })

  const currentMission = computed(() => {
    return missions.find(m => m.id === gameState.value.currentMission)
  })

  const currentQuestion = computed(() => {
    return currentMission.value?.questions[gameState.value.currentQuestionIndex]
  })

  const isLastQuestion = computed(() => {
    if (!currentMission.value) return false
    return gameState.value.currentQuestionIndex === currentMission.value.questions.length - 1
  })

  const calculatePoints = (correct: boolean, timeSpent: number, difficulty: 'easy' | 'medium' | 'hard'): number => {
    if (!correct) return 0
    
    const difficultyPoints = { easy: 10, medium: 15, hard: 20 }
    const basePoints = difficultyPoints[difficulty]
    
    const timeBonus = Math.max(0, 15 - Math.floor(timeSpent))
    const streakBonus = gameState.value.streak * 2
    
    return basePoints + timeBonus + streakBonus
  }

  const checkAnswer = (userAnswer: string | string[], correctAnswer: string | string[]): boolean => {
    if (Array.isArray(correctAnswer)) { // Drag-drop case
      if (!Array.isArray(userAnswer) || userAnswer.length !== correctAnswer.length) return false
      // The order matters for drag-drop, so a direct comparison is fine.
      return JSON.stringify(userAnswer) === JSON.stringify(correctAnswer)
    }
    
    if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
      return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
    }
    
    return false
  }

  const submitAnswer = async (answer: string | string[], timeSpent: number): Promise<boolean> => {
    if (!currentQuestion.value || !gameState.value.currentPlayer) return false
    
    const isCorrect = checkAnswer(answer, currentQuestion.value.correctAnswer)
    
    gameState.value.streak = isCorrect ? gameState.value.streak + 1 : 0
    
    gameState.value.answers.push({
      questionId: currentQuestion.value.id,
      correct: isCorrect,
      timeSpent
    })
    
    return isCorrect
  }

  const nextQuestion = () => {
    if (!isLastQuestion.value) {
      gameState.value.currentQuestionIndex++
    }
  }

  const completeMission = async () => {
    const { currentPlayer, currentMission: missionId, answers, startTime } = gameState.value
    if (!currentPlayer || !missionId || !currentMission.value) return

    let missionScore = 0
    const scoreRecords = []

    for (const answer of answers) {
      const question = currentMission.value.questions.find(q => q.id === answer.questionId)
      if (question && answer.correct) {
        const points = calculatePoints(answer.correct, answer.timeSpent, question.difficulty)
        missionScore += points
        scoreRecords.push({
          player_id: currentPlayer.id,
          mission_id: missionId,
          points,
          time_bonus: Math.max(0, 15 - Math.floor(answer.timeSpent)),
          difficulty_bonus: { easy: 0, medium: 5, hard: 10 }[question.difficulty],
          streak_bonus: 0 // Simplified for bulk insert
        })
      }
    }
    
    gameState.value.lastMissionScore = missionScore;

    // Save scores
    if (scoreRecords.length > 0) {
      await supabase.from('scores').insert(scoreRecords)
    }

    // Update player progress
    const { data: existingProgress } = await supabase
      .from('player_progress')
      .select('id, attempts')
      .eq('player_id', currentPlayer.id)
      .eq('mission_id', missionId)
      .single()

    await supabase.from('player_progress').upsert({
      player_id: currentPlayer.id,
      mission_id: missionId,
      completed: true,
      score: missionScore,
      time_spent: Date.now() - startTime,
      attempts: (existingProgress?.attempts || 0) + 1,
      perfect_score: answers.every(a => a.correct)
    })

    // Check for and award badges
    await checkForBadges()

    // Update player total points and leaderboard
    await supabase.rpc('update_player_stats_and_leaderboard', { p_player_id: currentPlayer.id })
  }

  const checkForBadges = async () => {
    const { currentPlayer, currentMission: missionId, answers, streak } = gameState.value
    if (!currentPlayer || !missionId) return

    const earnedBadgeTypes: Badge['badge_type'][] = []

    // First Mission Badge
    const { data: progressData } = await supabase.from('player_progress').select('id').eq('player_id', currentPlayer.id)
    if (progressData?.length === 1) {
      earnedBadgeTypes.push('first_mission')
    }
    
    // Streak 3
    if (answers.some((_, i, arr) => arr.slice(i, i + 3).every(a => a.correct) && arr.slice(i, i + 3).length === 3)) {
      earnedBadgeTypes.push('streak_3')
    }

    // Perfect Mission & Flawless Theme
    const allCorrect = answers.every(a => a.correct)
    if (allCorrect && answers.length > 0) {
      earnedBadgeTypes.push('perfect_mission')
      earnedBadgeTypes.push('flawless_theme')
    }

    // Genius Idea
    if (answers.some(a => a.correct && a.timeSpent < 5)) {
      earnedBadgeTypes.push('genius_idea')
    }
    
    const { data: existingBadges } = await supabase
      .from('badges')
      .select('badge_type')
      .eq('player_id', currentPlayer.id)
      .in('badge_type', earnedBadgeTypes)

    const existingBadgeTypes = existingBadges?.map(b => b.badge_type) || []
    const newBadgeTypes = earnedBadgeTypes.filter(bt => !existingBadgeTypes.includes(bt))

    if (newBadgeTypes.length > 0) {
      const newBadgesToInsert = newBadgeTypes.map(badge_type => ({
        player_id: currentPlayer.id,
        badge_type,
        badge_data: { mission_id: missionId }
      }))

      const { data: insertedBadges } = await supabase.from('badges').insert(newBadgesToInsert).select()
      if (insertedBadges) {
        gameState.value.earnedBadges = insertedBadges
      }
    }
  }

  const startMission = (missionId: string) => {
    gameState.value = {
      ...gameState.value,
      currentMission: missionId,
      currentQuestionIndex: 0,
      streak: 0,
      startTime: Date.now(),
      answers: [],
      earnedBadges: [],
      lastMissionScore: 0,
    }
  }

  const resetGame = () => {
    gameState.value = {
      currentPlayer: null,
      currentMission: null,
      currentQuestionIndex: 0,
      streak: 0,
      startTime: 0,
      answers: [],
      earnedBadges: [],
      lastMissionScore: 0,
    }
  }

  return {
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
  }
}
