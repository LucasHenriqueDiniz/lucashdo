'use server';

export interface LyftaWorkout {
  id: string;
  title: string;
  workout_perform_date: string;
  body_weight: number;
  total_volume: number;
  totalLiftedWeight: number;
  user: {
    username: string;
  };
  exercises: LyftaExercise[];
}

export interface LyftaExercise {
  exercise_id: number;
  excercise_name: string;
  exercise_type: string;
  exercise_image: string;
  exercise_rest_time: number;
  sets: Array<{
    id: string;
    weight: number | null;
    reps: string | null;
    duration?: number;
    is_completed: boolean;
  }>;
}

export interface LyftaStats {
  totalWorkouts: number;
  totalDuration: number; // in seconds
  totalLiftedWeight: number; // total weight lifted in kg
  favoriteExercise: string;
  topMuscleGroups: Array<{ name: string; count: number }>;
  weeklyActivity: Array<{ day: string; count: number }>;
  currentStreak: number; // current streak in weeks
  longestStreak: number; // longest streak in weeks
  lastWorkout: LyftaWorkout | null;
  workoutStreak: Array<{ date: string; count: number }>; // last 30 days of activity
  exerciseStats: {
    totalExercises: number;
    uniqueExercises: number;
    mostUsedWeight: number;
    averageReps: number;
  };
}

// Obtém as chaves de API do ambiente Next.js ou process.env
const API_KEY = process.env.NEXT_PUBLIC_LYFTA_API_KEY || process.env.LYFTA_API_KEY || '';
const BASE_URL = 'https://my.lyfta.app';

/**
 * Get recent workouts from Lyfta API
 */
export async function getWorkouts(limit = 5, page = 1): Promise<LyftaWorkout[]> {
  try {
    if (!API_KEY) {
      console.error('❌ Lyfta API key not found');
      return [];
    }

    console.log('🔍 Fetching Lyfta workouts...');
    const response = await fetch(`${BASE_URL}/api/v1/workouts?limit=${limit}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch workouts: ${response.statusText}`);
    }

    const data = await response.json();

    // Log first 2 workouts if data is an array
    if (Array.isArray(data)) {
      console.log('📦 Lyfta API Response:', JSON.stringify(data.slice(0, 2), null, 2));
    } else if (data.workouts && Array.isArray(data.workouts)) {
      console.log('📦 Lyfta API Response:', JSON.stringify(data.workouts.slice(0, 2), null, 2));
    } else {
      console.log('📦 Lyfta API Response:', JSON.stringify(data, null, 2));
    }

    // Return workouts array or empty array if not found
    return Array.isArray(data) ? data : data.workouts || [];
  } catch (error) {
    console.error('❌ Error fetching Lyfta workouts:', error);
    return [];
  }
}

/**
 * Get aggregated statistics from workouts
 */
export async function getLyftaStats(): Promise<LyftaStats> {
  console.log('🔍 Fetching Lyfta workouts...');
  const workouts = await getWorkouts(100);

  // Calculate total duration and weight
  const totalDuration = workouts.reduce((acc, workout) => {
    const workoutDuration = workout.exercises.reduce((exerciseAcc, exercise) => {
      const setsDuration = exercise.sets.reduce((setAcc, set) => {
        const setDuration = set.duration || (set.reps ? parseInt(set.reps) * 2 : 0);
        return setAcc + setDuration;
      }, 0);
      return exerciseAcc + setsDuration + (exercise.exercise_rest_time || 0);
    }, 0);
    return acc + workoutDuration;
  }, 0);

  const totalLiftedWeight = workouts.reduce((acc, workout) => {
    return acc + (workout.totalLiftedWeight || 0);
  }, 0);

  // Find favorite exercise
  const exerciseCounts = new Map<string, number>();
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const exerciseName = exercise.excercise_name;
      if (exerciseName) {
        const count = exerciseCounts.get(exerciseName) || 0;
        exerciseCounts.set(exerciseName, count + 1);
      }
    });
  });

  const favoriteExercise = Array.from(exerciseCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];

  // Calculate top muscle groups
  const muscleGroupCounts = new Map<string, number>();
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const muscleGroup = exercise.exercise_type.split('_')[0].toUpperCase();
      if (muscleGroup) {
        const count = muscleGroupCounts.get(muscleGroup) || 0;
        muscleGroupCounts.set(muscleGroup, count + 1);
      }
    });
  });

  const topMuscleGroups = Array.from(muscleGroupCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate weekly activity
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => ({
    day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i],
    count: 0,
  }));

  workouts.forEach(workout => {
    if (workout.workout_perform_date) {
      const date = new Date(workout.workout_perform_date);
      const dayIndex = date.getDay();
      if (weeklyActivity[dayIndex]) {
        weeklyActivity[dayIndex].count++;
      }
    }
  });

  // Calculate streaks
  const workoutDates = workouts
    .map(w => new Date(w.workout_perform_date))
    .sort((a, b) => b.getTime() - a.getTime());

  // Calculate current streak
  let currentStreak = 0;
  let longestStreak = 0;

  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  // Group workouts by week
  const workoutsByWeek = new Map<string, number>();
  workoutDates.forEach(date => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split('T')[0];
    workoutsByWeek.set(weekKey, (workoutsByWeek.get(weekKey) || 0) + 1);
  });

  // Calculate current streak
  const weeks = Array.from(workoutsByWeek.keys()).sort((a, b) => b.localeCompare(a));
  let streak = 0;
  const currentWeek = new Date();
  currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay()); // Start of current week
  const currentWeekKey = currentWeek.toISOString().split('T')[0];

  // Check if there was a workout this week
  if (workoutsByWeek.has(currentWeekKey)) {
    streak = 1;
    // Check previous weeks
    for (let i = 1; i < weeks.length; i++) {
      const prevWeek = new Date(currentWeek);
      prevWeek.setDate(prevWeek.getDate() - 7 * i);
      const prevWeekKey = prevWeek.toISOString().split('T')[0];

      if (workoutsByWeek.has(prevWeekKey)) {
        streak++;
      } else {
        break;
      }
    }
  }

  currentStreak = streak;

  // Calculate longest streak
  let maxStreak = 0;
  let tempMaxStreak = 0;
  weeks.forEach((week, index) => {
    if (
      index === 0 ||
      new Date(week).getTime() === new Date(weeks[index - 1]).getTime() - 7 * 24 * 60 * 60 * 1000
    ) {
      tempMaxStreak++;
      maxStreak = Math.max(maxStreak, tempMaxStreak);
    } else {
      tempMaxStreak = 1;
    }
  });

  longestStreak = maxStreak;

  const workoutStreak = last30Days.map(date => ({
    date,
    count: workoutDates.filter(d => d.toISOString().split('T')[0] === date).length,
  }));

  // Calculate exercise stats
  const allExercises = workouts.flatMap(w => w.exercises);
  const uniqueExercises = new Set(allExercises.map(e => e.excercise_name));
  const allWeights = allExercises
    .flatMap(e => e.sets.map(s => s.weight))
    .filter(w => w !== null) as number[];
  const allReps = allExercises
    .flatMap(e => e.sets.map(s => s.reps))
    .filter(r => r !== null)
    .map(r => parseInt(r));

  return {
    totalWorkouts: workouts.length,
    totalDuration,
    totalLiftedWeight,
    favoriteExercise: favoriteExercise || 'Nenhum',
    topMuscleGroups: topMuscleGroups.length > 0 ? topMuscleGroups : [{ name: 'Geral', count: 0 }],
    weeklyActivity,
    currentStreak,
    longestStreak,
    lastWorkout: workouts[0] || null,
    workoutStreak,
    exerciseStats: {
      totalExercises: allExercises.length,
      uniqueExercises: uniqueExercises.size,
      mostUsedWeight: allWeights.length > 0 ? Math.max(...allWeights) : 0,
      averageReps:
        allReps.length > 0 ? Math.round(allReps.reduce((a, b) => a + b, 0) / allReps.length) : 0,
    },
  };
}
