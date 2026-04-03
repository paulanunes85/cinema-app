import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@cinema-app/shared';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👤</Text>
      </View>
      <Text style={styles.name}>Utilizador</Text>
      <Text style={styles.role}>Membro de Equipa</Text>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Notificações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 32,
  },
  section: {
    width: '100%',
    gap: 1,
  },
  menuItem: {
    backgroundColor: COLORS.bgSecondary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  logoutItem: {
    marginTop: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
  },
});
