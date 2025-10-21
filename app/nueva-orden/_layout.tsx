import { Stack } from 'expo-router'

export default function NuevaOrdenLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#007AFF' },
      headerTintColor: '#fff',
      headerShown: false, // Los pasos manejarán sus propios headers
    }}>
      <Stack.Screen name="paso1" />
      <Stack.Screen name="paso2" />
    </Stack>
  )
}
