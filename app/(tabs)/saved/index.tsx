import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { useSavedCalculations } from '../../../src/hooks/useSavedCalculations';
import { SavedCalculation } from '../../../src/types/saved';
import { shareCalculation } from '../../../src/utils/share';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getTypeLabel(type: SavedCalculation['type']): string {
  switch (type) {
    case 'mortgage':
      return 'Mortgage';
    case 'roi':
      return 'ROI';
    case 'capRate':
      return 'Cap Rate';
    default:
      return 'Calculation';
  }
}

export default function SavedScreen(): React.JSX.Element {
  const theme = useTheme();
  const router = useRouter();
  const { calculations, isLoading, error, delete: deleteCalc, refresh } = useSavedCalculations();

  const handleDelete = useCallback(
    (item: SavedCalculation) => {
      Alert.alert(
        'Delete Calculation',
        `Are you sure you want to delete "${item.name ?? getTypeLabel(item.type)}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteCalc(item.id),
          },
        ]
      );
    },
    [deleteCalc]
  );

  const handleShare = useCallback(async (item: SavedCalculation) => {
    try {
      await shareCalculation(item);
    } catch {
      Alert.alert('Error', 'Failed to share calculation');
    }
  }, []);

  const handlePress = useCallback(
    (item: SavedCalculation) => {
      router.push({
        pathname: '/result/[id]',
        params: { id: item.id },
      });
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: SavedCalculation }) => (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.typeLabel, { color: theme.colors.primary }]}>
                {getTypeLabel(item.type)}
              </Text>
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                {item.name ?? `${getTypeLabel(item.type)} Calculation`}
              </Text>
              <Text style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <IconButton
              icon="share-variant"
              size={20}
              onPress={() => handleShare(item)}
              iconColor={theme.colors.primary}
              accessibilityLabel="Share calculation"
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDelete(item)}
              iconColor={theme.colors.error}
              accessibilityLabel="Delete calculation"
            />
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handlePress, handleShare, handleDelete, theme]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <FlatList
        data={calculations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}
              >No saved calculations</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Run a calculator and tap Save to see it here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeader: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
});
