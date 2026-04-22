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
import { calculateROI } from '@engine/roi';
import { ROIInput, ROIResult } from '@engine/types';
import { formatCurrency } from '@engine/utils/currency';

const roiSchema = z.object({
  purchasePrice: z.string().min(1, 'Purchase price is required'),
  downPayment: z.string().min(1, 'Down payment is required'),
  closingCosts: z.string().min(1, 'Closing costs is required'),
  rehabCosts: z.string().min(1, 'Rehab costs is required'),
  monthlyRent: z.string().min(1, 'Monthly rent is required'),
  monthlyExpenses: z.string().min(1, 'Monthly expenses is required'),
  vacancyRate: z.string().min(1, 'Vacancy rate is required'),
  appreciationRate: z.string().optional(),
  holdingPeriodYears: z.string().min(1, 'Holding period is required'),
});

type ROIFormData = z.infer<typeof roiSchema>;

const defaultValues: ROIFormData = {
  purchasePrice: '',
  downPayment: '',
  closingCosts: '',
  rehabCosts: '',
  monthlyRent: '',
  monthlyExpenses: '',
  vacancyRate: '',
  appreciationRate: '',
  holdingPeriodYears: '',
};

interface ROIFormContentProps {
  onCalculate: (data: ROIFormData) => void;
}

function ROIFormContent({ onCalculate }: ROIFormContentProps): React.JSX.Element {
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useFormContext<ROIFormData>();

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
        label="Down Payment"
        value={values.downPayment}
        onChangeText={(text) => setValue('downPayment', text, { shouldValidate: true })}
        keyboardType="decimal-pad"
        placeholder="e.g. 80000"
        error={errors.downPayment?.message}
        helperText="Amount paid upfront"
        accessibilityLabel="Down payment input"
        currency
      />
      <Input
        label="Closing Costs"
        value={values.closingCosts}
        onChangeText={(text) => setValue('closingCosts', text, { shouldValidate: true })}
        keyboardType="decimal-pad"
        placeholder="e.g. 5000"
        error={errors.closingCosts?.message}
        helperText="Closing costs and fees"
        accessibilityLabel="Closing costs input"
        currency
      />
      <Input
        label="Rehab Costs"
        value={values.rehabCosts}
        onChangeText={(text) => setValue('rehabCosts', text, { shouldValidate: true })}
        keyboardType="decimal-pad"
        placeholder="e.g. 10000"
        error={errors.rehabCosts?.message}
        helperText="Renovation and repair costs"
        accessibilityLabel="Rehab costs input"
        currency
      />
      <Input
        label="Monthly Rent"
        value={values.monthlyRent}
        onChangeText={(text) => setValue('monthlyRent', text, { shouldValidate: true })}
        keyboardType="decimal-pad"
        placeholder="e.g. 2500"
        error={errors.monthlyRent?.message}
        helperText="Expected monthly rental income"
        accessibilityLabel="Monthly rent input"
        currency
      />
      <Input
        label="Monthly Expenses"
        value={values.monthlyExpenses}
        onChangeText={(text) => setValue('monthlyExpenses', text, { shouldValidate: true })}
        keyboardType="decimal-pad"
        placeholder="e.g. 800"
        error={errors.monthlyExpenses?.message}
        helperText="Insurance, taxes, maintenance, etc."
        accessibilityLabel="Monthly expenses input"
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
      <Input
        label="Appreciation Rate"
        value={values.appreciationRate ?? ''}
        onChangeText={(text) => setValue('appreciationRate', text, { shouldValidate: true })}
        keyboardType="decimal-pad"
        placeholder="e.g. 3"
        error={errors.appreciationRate?.message}
        helperText="Expected annual appreciation (optional)"
        accessibilityLabel="Appreciation rate input"
        suffix="%"
      />
      <Input
        label="Holding Period"
        value={values.holdingPeriodYears}
        onChangeText={(text) => setValue('holdingPeriodYears', text, { shouldValidate: true })}
        keyboardType="number-pad"
        placeholder="e.g. 5"
        error={errors.holdingPeriodYears?.message}
        helperText="Years you plan to hold the property"
        accessibilityLabel="Holding period input"
        suffix="years"
      />
      <View style={styles.buttonRow}>
        <Button
          title="Calculate ROI"
          onPress={handleSubmit(onCalculate)}
          variant="primary"
          accessibilityLabel="Calculate ROI"
          style={styles.calculateButton}
        />
      </View>
    </View>
  );
}

export default function ROICalculatorScreen(): React.JSX.Element {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [result, setResult] = useState<ROIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedInputs, setSavedInputs] = useState<ROIFormData | null>(null);

  const handleCalculate = useCallback((data: ROIFormData) => {
    setError(null);
    try {
      const purchasePrice = parseFloat(data.purchasePrice.replace(/[$,]/g, ''));
      const downPayment = parseFloat(data.downPayment.replace(/[$,]/g, ''));
      const closingCosts = parseFloat(data.closingCosts.replace(/[$,]/g, ''));
      const rehabCosts = parseFloat(data.rehabCosts.replace(/[$,]/g, ''));
      const monthlyRent = parseFloat(data.monthlyRent.replace(/[$,]/g, ''));
      const monthlyExpenses = parseFloat(data.monthlyExpenses.replace(/[$,]/g, ''));
      const vacancyRate = parseFloat(data.vacancyRate) / 100;
      const appreciationRate = data.appreciationRate
        ? parseFloat(data.appreciationRate) / 100
        : 0;
      const holdingPeriodYears = parseInt(data.holdingPeriodYears, 10);

      if (isNaN(purchasePrice) || purchasePrice <= 0) {
        setError('Please enter a valid purchase price');
        return;
      }
      if (isNaN(downPayment) || downPayment < 0) {
        setError('Please enter a valid down payment');
        return;
      }
      if (isNaN(closingCosts) || closingCosts < 0) {
        setError('Please enter valid closing costs');
        return;
      }
      if (isNaN(rehabCosts) || rehabCosts < 0) {
        setError('Please enter valid rehab costs');
        return;
      }
      if (isNaN(monthlyRent) || monthlyRent <= 0) {
        setError('Please enter a valid monthly rent');
        return;
      }
      if (isNaN(monthlyExpenses) || monthlyExpenses < 0) {
        setError('Please enter valid monthly expenses');
        return;
      }
      if (isNaN(vacancyRate) || vacancyRate < 0 || vacancyRate > 1) {
        setError('Please enter a valid vacancy rate (0-100)');
        return;
      }
      if (isNaN(holdingPeriodYears) || holdingPeriodYears <= 0) {
        setError('Please enter a valid holding period');
        return;
      }

      const input: ROIInput = {
        purchasePrice,
        downPayment,
        closingCosts,
        rehabCosts,
        monthlyRent,
        monthlyExpenses,
        vacancyRate,
        appreciationRate,
        holdingPeriodYears,
      };

      setSavedInputs(data);
      const roiResult = calculateROI(input);
      setResult(roiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!result || !savedInputs) return;
    try {
      const { saveCalculation } = await import('../../services/storage');
      const { parseCurrency } = await import('../../engine/utils/currency');
      await saveCalculation({
        id: `roi-${Date.now()}`,
        type: 'roi',
        inputs: {
          purchasePrice: parseCurrency(savedInputs.purchasePrice),
          downPayment: parseCurrency(savedInputs.downPayment),
          closingCosts: parseCurrency(savedInputs.closingCosts),
          rehabCosts: parseCurrency(savedInputs.rehabCosts),
          monthlyRent: parseCurrency(savedInputs.monthlyRent),
          monthlyExpenses: parseCurrency(savedInputs.monthlyExpenses),
          vacancyRate: parseFloat(savedInputs.vacancyRate) / 100,
          appreciationRate: savedInputs.appreciationRate ? parseFloat(savedInputs.appreciationRate) / 100 : 0,
          holdingPeriodYears: parseInt(savedInputs.holdingPeriodYears, 10),
        },
        result: {
          cashOnCashReturn: result.cashOnCashReturn,
          annualCashFlow: result.annualCashFlow,
          totalReturn: result.totalReturn,
          capRate: result.capRate,
        },
        createdAt: Date.now(),
      });
      Alert.alert('Saved', 'ROI calculation saved successfully!');
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
        ROI Calculator
      </Text>

      <Card title="Investment Details">
        <CalculatorForm
          validationSchema={roiSchema}
          defaultValues={defaultValues}
          onSubmit={handleCalculate}
        >
          <ROIFormContent onCalculate={handleCalculate} />
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
                title="Cash-on-Cash Return"
                value={result.cashOnCashReturn * 100}
                unit="%"
                highlight
                accessibilityLabel={`Cash-on-cash return is ${(result.cashOnCashReturn * 100).toFixed(2)}%`}
              />
              <ResultCard
                title="Annual Cash Flow"
                value={result.annualCashFlow}
                accessibilityLabel={`Annual cash flow is ${formatCurrency(result.annualCashFlow)}`}
              />
            </View>
            <View style={[styles.resultsRow, isTablet && styles.resultsRowTablet]}>
              <ResultCard
                title="Cap Rate"
                value={result.capRate * 100}
                unit="%"
                accessibilityLabel={`Cap rate is ${(result.capRate * 100).toFixed(2)}%`}
              />
              <ResultCard
                title="Total Return"
                value={result.totalReturn}
                accessibilityLabel={`Total return is ${formatCurrency(result.totalReturn)}`}
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
