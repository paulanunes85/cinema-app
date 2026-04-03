import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, DEFAULT_DEPARTMENTS } from '@cinema-app/shared';

export default function DepartmentsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={DEFAULT_DEPARTMENTS}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.deptName}>{item.name}</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '0%' }]} />
            </View>
            <Text style={styles.progressText}>0% concluído</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgSecondary,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
  },
  deptName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
