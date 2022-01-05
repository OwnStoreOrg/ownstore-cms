import { useRef, useEffect, useContext } from 'react'
import ApplicationContext from '../components/ApplicationContext'

const useLoginEffect = (effect, dependencies = []) => {
  const applicationContext = useContext(ApplicationContext)
  const { isLoggedIn } = applicationContext

  useEffect(() => {
    if (isLoggedIn) {
      effect()
    }
  }, [isLoggedIn, ...dependencies])
}

export default useLoginEffect
