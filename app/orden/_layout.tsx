import { Stack } from 'expo-router'

export default function OrdenLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#007AFF' },
      headerTintColor: '#fff',
    }}>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Detalles de Orden',
        }}
      />
    </Stack>
  )
}
