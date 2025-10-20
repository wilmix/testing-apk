import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export interface ValidationIconProps {
  isValid?: boolean
  isInvalid?: boolean
}

export const ValidationIcon: React.FC<ValidationIconProps> = ({
  isValid,
  isInvalid,
}) => {
  if (isValid) {
    return (
      <View style={[styles.icon, styles.validIcon]}>
        <Text style={styles.validText}>✓</Text>
      </View>
    )
  }

  if (isInvalid) {
    return (
      <View style={[styles.icon, styles.invalidIcon]}>
        <Text style={styles.invalidText}>✗</Text>
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
  validIcon: {
    backgroundColor: '#e8f5e9',
  },
  validText: {
    fontSize: 18,
    color: '#388e3c',
    fontWeight: 'bold',
  },
  invalidIcon: {
    backgroundColor: '#ffebee',
  },
  invalidText: {
    fontSize: 18,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
})
