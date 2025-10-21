/**
 * SearchBar.tsx
 * Componente de búsqueda con filtros para órdenes
 * FASE 7.2 - Lista de Órdenes
 */

import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown'

interface SearchBarProps {
  onSearch: (query: string, filter: 'cliente' | 'numero') => void
  onClear?: () => void
  isDark: boolean
}

const FILTER_OPTIONS = [
  { label: 'Cliente', value: 'cliente' },
  { label: 'Número de Orden', value: 'numero' },
]

export function SearchBar({ onSearch, onClear, isDark }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'cliente' | 'numero'>('cliente')

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim(), filter)
    }
  }

  const handleClear = () => {
    setQuery('')
    if (onClear) {
      onClear()
    }
  }

  const hasQuery = query.trim().length > 0

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
      {/* Fila 1: Dropdown de filtro + Input */}
      <View style={styles.row}>
        {/* Dropdown de filtro */}
        <Dropdown
          data={FILTER_OPTIONS}
          labelField="label"
          valueField="value"
          value={filter}
          onChange={item => setFilter(item.value as 'cliente' | 'numero')}
          style={[styles.dropdown, {
            backgroundColor: isDark ? '#2a2a2a' : '#fff',
            borderColor: isDark ? '#444' : '#ddd'
          }]}
          selectedTextStyle={[styles.dropdownText, { color: isDark ? '#fff' : '#000' }]}
          placeholderStyle={{ color: isDark ? '#888' : '#666' }}
          containerStyle={[styles.dropdownContainer, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}
          itemTextStyle={{ color: isDark ? '#fff' : '#000', fontSize: 13 }}
          activeColor={isDark ? '#333' : '#f0f0f0'}
        />

        {/* Input de búsqueda */}
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={`Buscar por ${filter === 'cliente' ? 'cliente' : 'número'}...`}
          placeholderTextColor={isDark ? '#888' : '#666'}
          style={[styles.input, {
            backgroundColor: isDark ? '#2a2a2a' : '#fff',
            color: isDark ? '#fff' : '#000',
            borderColor: isDark ? '#444' : '#ddd'
          }]}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {/* Fila 2: Botones de acción */}
      <View style={styles.actions}>
        {/* Botón Buscar */}
        <TouchableOpacity
          onPress={handleSearch}
          style={[styles.button, styles.searchButton, { opacity: hasQuery ? 1 : 0.5 }]}
          disabled={!hasQuery}
        >
          <Text style={styles.buttonText}>🔍 Buscar</Text>
        </TouchableOpacity>

        {/* Botón Limpiar (solo visible si hay texto) */}
        {hasQuery && (
          <TouchableOpacity
            onPress={handleClear}
            style={[styles.button, styles.clearButton]}
          >
            <Text style={[styles.buttonText, { color: isDark ? '#fff' : '#666' }]}>✕ Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdown: {
    width: 110,
    height: 44,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '500',
  },
  dropdownContainer: {
    borderRadius: 8,
    marginTop: 4,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  clearButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})
