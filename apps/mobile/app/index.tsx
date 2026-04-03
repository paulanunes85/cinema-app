import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '@cinema-app/shared';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🎬 Production Bible</Text>
        <Text style={styles.subtitle}>
          Plataforma colaborativa de pré-produção audiovisual
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bem-vindo!</Text>
        <Text style={styles.cardText}>
          Selecione um projeto para ver os objetivos do seu departamento,
          colaborar com a equipa e acompanhar o progresso da pré-produção.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Entrar com Google</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  content: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
