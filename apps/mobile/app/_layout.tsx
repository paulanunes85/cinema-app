import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A6CF7',
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#1F2937',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarLabel: 'Home' }}
      />
      <Tabs.Screen
        name="departments"
        options={{ title: 'Departamentos', tabBarLabel: 'Depts' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil', tabBarLabel: 'Perfil' }}
      />
    </Tabs>
  );
}
