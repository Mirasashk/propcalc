import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';

import { Card, Button } from '../components/ui';
import {
  getCalculations,
  deleteCalculation,
  SavedCalculation,
} from '../services/storage';
import { shareCalculation } from '../utils/share';
import { formatCurrency } from '../engine/utils/currency';

export default function SavedCalculationsScreen(): React.JSX.Element {
  const theme = useTheme();
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCalculations = useCallback(async () => {
    try {
      const data = await getCalculations();
      setCalculations(data);
    } catch (err) {
      console.error('Failed to load calculations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCalculations();
  }, [loadCalculations]);

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

  const renderRightActions = useCallback(
    (calc: SavedCalculation) => (
      <View style={styles.actionsContainer}>
        <Button
          title="Share"
          onPress={() => handleShare(calc)}
          variant="secondary"
          style={styles.actionButton}
        />
        <Button
          title="Delete"
          onPress={() => handleDelete(calc.id)}
          variant="danger"
          style={styles.actionButton}
        />
      </View>
    ),
    [handleDelete, handleShare]
  );

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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text
        variant="headlineMedium"
        style={[styles.header, { color: theme.colors.onBackground }]}
      >
        Saved Calculations
      </Text>

      {loading ? (
        <Text style={{ color: theme.colors.onBackground }}>Loading...</Text>
      ) : calculations.length === 0 ? (
        <Card>
          <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
            No saved calculations yet.{'\n'}
            Calculate something and save it!
          </Text>
        </Card>
      ) : (
        calculations.map((calc) => (
          <Swipeable
            key={calc.id}
            renderRightActions={() => renderRightActions(calc)}
          >
            <Card style={styles.calcCard}>
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
                  {new Date(calc.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
              >
                {formatCalcSummary(calc)}
              </Text>
            </Card>
          </Swipeable>
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
  header: {
    marginBottom: 16,
    fontWeight: '700',
  },
  calcCard: {
    marginBottom: 8,
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
    minHeight: 40,
    paddingHorizontal: 12,
  },
});
