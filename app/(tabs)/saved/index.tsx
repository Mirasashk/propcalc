import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';

import { Card } from '@/components/ui';
import {
  getCalculations,
  deleteCalculation,
} from '@/services/storage';
import { SavedCalculation } from '@/types/saved';
import { shareCalculation } from '@/utils/share';
import { formatCurrency } from '@/engine/utils/currency';

export default function SavedCalculationsScreen(): React.JSX.Element {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCalculations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCalculations();
      setCalculations(data);
    } catch (err) {
      console.error('Failed to load calculations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCalculations();
    }, [loadCalculations])
  );

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteCalculation(id);
      setCalculations((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      Alert.alert('Error', 'Failed to delete calculation');
    }
  }, []);

  const handleShare = useCallback(async (calc: SavedCalculation) => {
    try {
      await shareCalculation(calc);
    } catch (err) {
      Alert.alert('Error', 'Failed to share calculation');
    }
  }, []);

  const getCalcIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'mortgage': return 'home';
      case 'roi': return 'cash';
      case 'capRate': return 'trending-up';
      default: return 'calculator';
    }
  };

  const getCalcColor = (type: string): string => {
    switch (type) {
      case 'mortgage': return '#0D7377';
      case 'roi': return '#D4A017';
      case 'capRate': return '#2E7D32';
      default: return theme.colors.primary;
    }
  };

  const formatCalcSummary = (calc: SavedCalculation): string => {
    switch (calc.type) {
      case 'mortgage':
        return `Monthly: ${formatCurrency(calc.result.monthlyPayment || 0)}`;
      case 'roi':
        return `Cash-on-Cash: ${((calc.result.cashOnCashReturn || 0) * 100).toFixed(2)}%`;
      case 'capRate':
        return `Cap Rate: ${((calc.result.capRate || 0) * 100).toFixed(2)}%`;
      default:
        return '';
    }
  };

  const renderRightActions = useCallback(
    (calc: SavedCalculation) => (
      <View style={styles.actionsContainer}>
        <IconButton
          icon="share-variant"
          size={20}
          onPress={() => handleShare(calc)}
          iconColor={theme.colors.primary}
          style={[styles.actionButton, { backgroundColor: theme.colors.primaryContainer }]}
        />
        <IconButton
          icon="delete"
          size={20}
          onPress={() => handleDelete(calc.id)}
          iconColor={theme.colors.error}
          style={[styles.actionButton, { backgroundColor: theme.colors.errorContainer }]}
        />
      </View>
    ),
    [handleDelete, handleShare, theme]
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[
        styles.content,
        isTablet && styles.contentTablet,
      ]}
    >
      <Text
        variant="headlineMedium"
        style={[styles.header, { color: theme.colors.onBackground }]}
      >
        Saved Calculations
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.subheader, { color: theme.colors.onSurfaceVariant }]}
      >
        {calculations.length > 0
          ? `${calculations.length} calculation${calculations.length !== 1 ? 's' : ''} saved`
          : 'Your saved calculations appear here'}
      </Text>

      {loading ? (
        <Card>
          <View style={styles.loadingContainer}>
            <Ionicons name="refresh" size={32} color={theme.colors.onSurfaceVariant} />
            <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
              Loading calculations...
            </Text>
          </View>
        </Card>
      ) : calculations.length === 0 ? (
        <Card>
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="bookmark-outline" size={40} color={theme.colors.primary} />
            </View>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onSurface, marginTop: 16, fontWeight: '600' }}
            >
              No saved calculations
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}
            >
              Calculate something and save it to see it here
            </Text>
          </View>
        </Card>
      ) : (
        calculations.map((calc, index) => (
          <Animated.View
            key={calc.id}
            entering={FadeInUp.delay(index * 50).duration(300)}
          >
            <Swipeable
              renderRightActions={() => renderRightActions(calc)}
              friction={2}
            >
              <Card style={styles.calcCard}>
                <View style={styles.calcRow}>
                  <View style={[styles.calcIconContainer, { backgroundColor: getCalcColor(calc.type) + '15' }]}>
                    <Ionicons
                      name={getCalcIcon(calc.type)}
                      size={22}
                      color={getCalcColor(calc.type)}
                    />
                  </View>
                  <View style={styles.calcInfo}>
                    <View style={styles.calcHeader}>
                      <Text
                        variant="titleMedium"
                        style={{ color: theme.colors.onSurface, fontWeight: '600' }}
                      >
                        {calc.name || `${calc.type.charAt(0).toUpperCase() + calc.type.slice(1)} Calculation`}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        {new Date(calc.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                    <Text
                      variant="bodyMedium"
                      style={{ color: theme.colors.primary, marginTop: 4, fontWeight: '500' }}
                    >
                      {formatCalcSummary(calc)}
                    </Text>
                  </View>
                </View>
              </Card>
            </Swipeable>
          </Animated.View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  contentTablet: {
    paddingHorizontal: 64,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 4,
    fontWeight: '700',
  },
  subheader: {
    marginBottom: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calcCard: {
    marginBottom: 8,
  },
  calcRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calcIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  calcInfo: {
    flex: 1,
  },
  calcHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    margin: 0,
    borderRadius: 10,
  },
});
