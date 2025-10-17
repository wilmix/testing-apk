import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

const MARCAS = [
  'KIDDE BRASIL',
  'RESIL',
  'FANACIM',
  'SIN MARCA',
  'MELISAM',
  'AMEREX',
  'GEORGIA',
  'YUKON',
  'BADGER',
  'FADESA',
  'EFIR'
];

export default function App() {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme || 'light');
  const [count, setCount] = useState(0);
  const [selectedMarca, setSelectedMarca] = useState('');

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleSaludo = () => {
    Alert.alert('¡Hola Dann!', 'Esta es mi primera prueba aqui estara REX-MOBILE');
  };

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  return (
    <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.text, isDark ? styles.darkText : styles.lightText]}>Mi primera prueba</Text>
      <Text style={[styles.text, isDark ? styles.darkText : styles.lightText]}>Contador: {count}</Text>
      <View style={styles.formControl}>
        <Text style={[styles.label, isDark ? styles.darkText : styles.lightText]}>Marca</Text>
        <Picker
          selectedValue={selectedMarca}
          onValueChange={(itemValue) => setSelectedMarca(itemValue)}
          style={[styles.picker, isDark ? styles.darkPicker : styles.lightPicker]}
        >
          <Picker.Item label="Selecciona una marca" value="" />
          {MARCAS.map((marca) => (
            <Picker.Item key={marca} label={marca} value={marca} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity style={[styles.button, isDark ? styles.darkButton : styles.lightButton]} onPress={handleSaludo}>
        <Text style={[styles.buttonText, isDark ? styles.darkText : styles.lightText]}>Clic aquí</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.smallButton, isDark ? styles.darkButton : styles.lightButton]} onPress={handleDecrement}>
          <Text style={[styles.buttonText, isDark ? styles.darkText : styles.lightText]}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.smallButton, isDark ? styles.darkButton : styles.lightButton]} onPress={handleIncrement}>
          <Text style={[styles.buttonText, isDark ? styles.darkText : styles.lightText]}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.button, isDark ? styles.darkButton : styles.lightButton]} onPress={toggleTheme}>
        <Text style={[styles.buttonText, isDark ? styles.darkText : styles.lightText]}>Cambiar a {isDark ? 'Claro' : 'Oscuro'}</Text>
      </TouchableOpacity>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  text: {
    marginBottom: 20,
    fontSize: 18,
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  button: {
    marginVertical: 10,
    width: 200,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  lightButton: {
    backgroundColor: '#ddd',
  },
  darkButton: {
    backgroundColor: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 200,
    marginVertical: 10,
  },
  smallButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: 80,
    marginHorizontal: 5,
  },
  formControl: {
    marginVertical: 20,
    width: 250,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    borderRadius: 5,
  },
  lightPicker: {
    color: '#000',
    backgroundColor: '#f0f0f0',
  },
  darkPicker: {
    color: '#fff',
    backgroundColor: '#333',
  },
  buttonText: {
    fontSize: 16,
  },
});
