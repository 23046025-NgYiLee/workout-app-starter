import React, { useEffect } from 'react'
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user) {
        return // Do not proceed if user is not logged in
      }

      const response = await fetch('/api/workouts', {
        headers: {'Authorization': `Bearer ${user.token}`}
      })

      if (response.ok) {
        const json = await response.json()
        dispatch({ type: 'SET_WORKOUTS', payload: json })
      } else {
        // Handle errors (e.g., 404 or 500)
        console.error('Failed to fetch workouts:', await response.text())
      }
    }

    fetchWorkouts()
  }, [dispatch, user]) // Re-run when 'user' or 'dispatch' changes

  return (
    <div className="home">
      <div className="workouts">
        {workouts && workouts.map((workout) => (
          <WorkoutDetails key={workout._id} workout={workout} />
        ))}
      </div>
      <WorkoutForm />
    </div>
  )
}

export default Home
