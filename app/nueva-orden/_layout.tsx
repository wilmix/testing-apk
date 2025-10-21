import { Stack } from 'expo-router'

export default function NuevaOrdenLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#007AFF' },
      headerTintColor: '#fff',
      headerShown: true,
    }}>
      <Stack.Screen
        name="paso1"
        options={{
          title: 'Paso 1: Cliente',
          headerBackTitle: 'Atrás',
        }}
      />
      <Stack.Screen
        name="paso2"
        options={{
          title: 'Paso 2: Detalles',
          headerBackTitle: 'Atrás',
        }}
      />
    </Stack>
  )
}
