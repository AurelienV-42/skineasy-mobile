import { colors } from '@/theme/colors'
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet } from 'react-native'
  
interface BackgroundGradientProps {
  children: React.ReactNode
}

export function BackgroundGradient({ children }: BackgroundGradientProps) {
  return (
    <LinearGradient
      colors={[colors.background, '#f8ece7', colors.background]}
      locations={[0, 0.5, 1]}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
})
