import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Input, Button, Card } from '@components/ui';
import { CalculatorForm, ResultCard } from '@components/calculators';
import { calculateCapRate } from '@engine/cap-rate';
import { CapRateInput, CapRateResult } from '@engine/types';
import { formatCurrency } from '@engine/utils/currency';

const capRateSchema = z.object({
  purchasePrice: z.string().min(1, 'Purchase price is required'),
  grossAnnualRent: z.string().min(1, 'Gross annual rent is required'),
  operatingExpenses: z.string().min(1, 'Operating expenses is required'),
  vacancyRate: z.string().min(1, 'Vacancy rate is required'),
});

type CapRateFormData = z.infer<typeof capRateSchema>;

const defaultValues: CapRateFormData = {
  purchasePrice: '',
  grossAnnualRent: '',
  operatingExpenses: '',
  vacancyRate: '',
};

interface CapRateFormContentProps {
  onCalculate: (data: CapRateFormData) => void;
}

function CapRateFormContent({ onCalculate }: CapRateFormContentProps): React.JSX.Element {
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useFormContext<CapRateFormData>();

  const values = watch();

  return (
    <View>
      <Input
        label="Purchase Price"
        value={values.purchasePrice}
        onChangeText={(text) => setValue('purchasePrice', text, { shouldValidate: true })}
        keyboardType="decimal-pad"
        placeholder="e.g. 400000"
        error={errors.purchasePrice?.message}
        helperText="Total purchase price of the property"
        accessibilityLabel="Purchase price input"
        currency
      />
      <Input
        label="Gross Annual Rent"
        value={values.grossAnnualRent}
        onChangeText={(text) => setValue('grossAnnualRent', text, { shouldValidate: true })}
        keyboardType="decimal-pad"
        placeholder="e.g. 36000"
        error={errors.grossAnnualRent?.message}
        helperText="Total annual rental income if fully occupied"
        accessibilityLabel="Gross annual rent input"
        currency
      />
      <Input
        label="Operating Expenses"
        value={values.operatingExpenses}
        onChangeText={(text) => setValue('operatingExpenses', text, { shouldValidate: true })}
        keyboardType="decimal-pad"
        placeholder="e.g. 8000"
        error={errors.operatingExpenses?.message}
        helperText="Annual operating expenses (taxes, insurance, maintenance)"
        accessibilityLabel="Operating expenses input"
        currency
      />
      <Input
        label="Vacancy Rate"
        value={values.vacancyRate}
        onChangeText={(text) => setValue('vacancyRate', text, { shouldValidate: true })}
        keyboardType="decimal-pad"
        placeholder="e.g. 5"
        error={errors.vacancyRate?.message}
        helperText="Expected vacancy rate as a percentage"
        accessibilityLabel="Vacancy rate input"
        suffix="%"
        returnKeyType="done"
        onSubmitEditing={handleSubmit(onCalculate)}
      />
      <Button
        title="Calculate Cap Rate"
        onPress={handleSubmit(onCalculate)}
        variant="primary"
        accessibilityLabel="Calculate cap rate"
        style={styles.calculateButton}
      />
    </View>
  );
}

export default function CapRateCalculatorScreen(): React.JSX.Element {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [result, setResult] = useState<CapRateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedInputs, setSavedInputs] = useState<CapRateFormData | null>(null);

  const handleCalculate = useCallback((data: CapRateFormData) => {
    setError(null);
    try {
      const purchasePrice = parseFloat(data.purchasePrice.replace(/[$,]/g, ''));
      const grossAnnualRent = parseFloat(data.grossAnnualRent.replace(/[$,]/g, ''));
      const operatingExpenses = parseFloat(data.operatingExpenses.replace(/[$,]/g, ''));
      const vacancyRate = parseFloat(data.vacancyRate) / 100;

      if (isNaN(purchasePrice) || purchasePrice <= 0) {
        setError('Please enter a valid purchase price');
        return;
      }
      if (isNaN(grossAnnualRent) || grossAnnualRent <= 0) {
        setError('Please enter a valid gross annual rent');
        return;
      }
      if (isNaN(operatingExpenses) || operatingExpenses < 0) {
        setError('Please enter valid operating expenses');
        return;
      }
      if (isNaN(vacancyRate) || vacancyRate < 0 || vacancyRate > 1) {
        setError('Please enter a valid vacancy rate (0-100)');
        return;
      }

      const input: CapRateInput = {
        purchasePrice,
        grossAnnualRent,
        operatingExpenses,
        vacancyRate,
      };

      setSavedInputs(data);
      const capRateResult = calculateCapRate(input);
      setResult(capRateResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!result || !savedInputs) return;
    try {
      const { saveCalculation } = await import('@/services/storage');
      const { parseCurrency } = await import('@/engine/utils/currency');
      await saveCalculation({
        id: `caprate-${Date.now()}`,
        type: 'capRate',
        inputs: {
          purchasePrice: parseCurrency(savedInputs.purchasePrice),
          grossAnnualRent: parseCurrency(savedInputs.grossAnnualRent),
          operatingExpenses: parseCurrency(savedInputs.operatingExpenses),
          vacancyRate: parseFloat(savedInputs.vacancyRate) / 100,
        },
        result: {
          capRate: result.capRate,
          noi: result.noi,
        },
        createdAt: Date.now(),
      });
      Alert.alert('Saved', 'Cap Rate calculation saved successfully!');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to save');
    }
  }, [result, savedInputs]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[
        styles.content,
        isTablet && styles.contentTablet,
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.onBackground} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text
            variant="headlineMedium"
            style={[styles.header, { color: theme.colors.onBackground }]}
          >
            Cap Rate Calculator
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subheader, { color: theme.colors.onSurfaceVariant }]}
          >
            Evaluate property profitability
          </Text>
        </View>
      </View>

      <Card>
        <CalculatorForm
          validationSchema={capRateSchema}
          defaultValues={defaultValues}
          onSubmit={handleCalculate}
        >
          <CapRateFormContent onCalculate={handleCalculate} />
        </CalculatorForm>
      </Card>

      {error && (
        <View style={[styles.errorBanner, { backgroundColor: theme.colors.errorContainer }]}>
          <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        </View>
      )}

      {result && (
        <>
          <Card title="Property Analysis">
            <View style={[styles.resultsGrid, isTablet && styles.resultsGridTablet]}>
              <ResultCard
                title="Cap Rate"
                value={result.capRate * 100}
                unit="%"
                highlight
                accessibilityLabel={`Cap rate is ${(result.capRate * 100).toFixed(2)}%`}
              />
              <ResultCard
                title="Net Operating Income"
                value={result.noi}
                accessibilityLabel={`Net operating income is ${formatCurrency(result.noi)}`}
              />
            </View>

            {/* Cap Rate Gauge */}
            <View style={styles.gaugeContainer}>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                Cap Rate Benchmark
              </Text>
              <View style={styles.gaugeBar}>
                <View style={[styles.gaugeTrack, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <View
                    style={[
                      styles.gaugeFill,
                      {
                        backgroundColor: result.capRate >= 0.08
                          ? theme.colors.primary
                          : result.capRate >= 0.06
                          ? theme.colors.secondary
                          : theme.colors.error,
                        width: `${Math.min(result.capRate * 100 * 10, 100)}%`,
                      },
                    ]}
                  />
                </View>
                <View style={styles.gaugeLabels}>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>0%</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>5%</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>10%</Text>
                </View>
              </View>
              <Text variant="bodySmall" style={[styles.gaugeHint, { color: theme.colors.onSurfaceVariant }]}>
                {result.capRate >= 0.08
                  ? 'Excellent — Strong cash flow potential'
                  : result.capRate >= 0.06
                  ? 'Good — Solid investment opportunity'
                  : 'Caution — Review cash flow carefully'}
              </Text>
            </View>
          </Card>

          <View style={styles.actionRow}>
            <Button
              title="Save Calculation"
              onPress={handleSave}
              variant="outline"
              accessibilityLabel="Save this calculation"
              style={styles.actionButton}
            />
          </View>
        </>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  backButton: {
    padding: 4,
    marginTop: 4,
  },
  headerText: {
    flex: 1,
  },
  header: {
    marginBottom: 4,
    fontWeight: '700',
  },
  subheader: {
    marginBottom: 0,
  },
  calculateButton: {
    marginTop: 8,
    minHeight: 48,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  errorText: {
    flex: 1,
    fontWeight: '500',
  },
  resultsGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  resultsGridTablet: {
    flexDirection: 'row',
  },
  gaugeContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  gaugeBar: {
    marginVertical: 8,
  },
  gaugeTrack: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 6,
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  gaugeHint: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
    justifyContent: 'center',
  },
  actionButton: {
    flex: 1,
    minHeight: 48,
  },
});
