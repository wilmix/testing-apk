import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../contexts/ThemeContext'

export interface ValidationIconProps {
  isValid?: boolean
  isInvalid?: boolean
}

export const ValidationIcon: React.FC<ValidationIconProps> = ({
  isValid,
  isInvalid,
}) => {
  const { theme } = useTheme()

  if (isValid) {
    return (
      <View
        style={[
          styles.icon,
          { backgroundColor: theme.successBg },
        ]}
      >
        <Text style={[styles.iconText, { color: theme.success }]}>
          ✓
        </Text>
      </View>
    )
  }

  if (isInvalid) {
    return (
      <View
        style={[
          styles.icon,
          { backgroundColor: theme.errorBg },
        ]}
      >
        <Text style={[styles.iconText, { color: theme.error }]}>
          ✗
        </Text>
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})
