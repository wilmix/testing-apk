import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { ValidationIcon } from '../Feedback/ValidationIcon'

export interface DropdownItem {
  label: string
  value: string | number
}

export interface FormDropdownProps {
  label?: string
  items: DropdownItem[]
  value: string | number | null
  onChange: (item: DropdownItem) => void
  placeholder?: string
  error?: string
  touched?: boolean
  editable?: boolean
  searchable?: boolean
}

export const FormDropdown: React.FC<FormDropdownProps> = ({
  label,
  items,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  error,
  touched,
  editable = true,
  searchable = true,
}) => {
  const [isFocus, setIsFocus] = useState(false)
  const isValid = touched && !error
  const isInvalid = touched && !!error

  const selectedItem = items.find((item) => item.value === value)

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.dropdownWrapper}>
        <Dropdown
          style={[
            styles.dropdown,
            isFocus && styles.dropdownFocus,
            isInvalid && styles.dropdownError,
            isValid && styles.dropdownValid,
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={items}
          search={searchable}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          searchPlaceholder="Buscar..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={onChange}
          disable={!editable}
          activeColor="#f0f0f0"
          itemTextStyle={styles.itemTextStyle}
        />
        <ValidationIcon isValid={isValid} isInvalid={isInvalid} />
      </View>
      {error && touched && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    flex: 1,
    height: 44, // Touch-friendly
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownFocus: {
    borderColor: '#007AFF',
  },
  dropdownError: {
    borderColor: '#d32f2f',
  },
  dropdownValid: {
    borderColor: '#388e3c',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  itemTextStyle: {
    fontSize: 15,
    color: '#333',
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    marginTop: 4,
  },
})
