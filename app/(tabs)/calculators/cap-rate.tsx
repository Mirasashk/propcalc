import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';

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
      />
      <View style={styles.buttonRow}>
        <Button
          title="Calculate Cap Rate"
          onPress={handleSubmit(onCalculate)}
          variant="primary"
          accessibilityLabel="Calculate cap rate"
          style={styles.calculateButton}
        />
      </View>
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
      <Text
        variant="headlineMedium"
        style={[styles.header, { color: theme.colors.onBackground }]}
      >
        Cap Rate Calculator
      </Text>

      <Card title="Property Details">
        <CalculatorForm
          validationSchema={capRateSchema}
          defaultValues={defaultValues}
          onSubmit={handleCalculate}
        >
          <CapRateFormContent onCalculate={handleCalculate} />
        </CalculatorForm>
      </Card>

      {error && (
        <Text
          style={[styles.errorText, { color: theme.colors.error }]}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}

      {result && (
        <>
          <Card title="Results">
            <View
              style={[
                styles.resultsRow,
                isTablet && styles.resultsRowTablet,
              ]}
            >
              <ResultCard
                title="Cap Rate"
                value={result.capRate * 100}
                unit="%"
                highlight
                accessibilityLabel={`Cap rate is ${(result.capRate * 100).toFixed(2)}%`}
              />
              <ResultCard
                title="NOI"
                value={result.noi}
                accessibilityLabel={`Net operating income is ${formatCurrency(result.noi)}`}
              />
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
  header: {
    marginBottom: 16,
    fontWeight: '700',
  },
  buttonRow: {
    marginTop: 8,
    marginBottom: 4,
  },
  calculateButton: {
    minHeight: 48,
  },
  errorText: {
    marginVertical: 12,
    textAlign: 'center',
  },
  resultsRow: {
    flexDirection: 'column',
    gap: 8,
    marginVertical: 8,
  },
  resultsRowTablet: {
    flexDirection: 'row',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 12,
    justifyContent: 'center',
  },
  actionButton: {
    flex: 1,
    minHeight: 48,
  },
});
