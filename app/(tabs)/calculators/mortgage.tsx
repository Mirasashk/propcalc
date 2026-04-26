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
import { Ionicons } from '@expo/vector-icons';

import { Input, Button, Card } from '@components/ui';
import { CalculatorForm, ResultCard, AmortizationChart } from '@components/calculators';
import { calculateMortgage } from '@engine/mortgage';
import { MortgageInput, MortgageResult } from '@engine/types';
import { formatCurrency } from '@engine/utils/currency';

const mortgageSchema = z.object({
  loanAmount: z.string().min(1, 'Loan amount is required'),
  interestRate: z.string().min(1, 'Interest rate is required'),
  loanTermYears: z.string().min(1, 'Loan term is required'),
  downPayment: z.string().optional(),
});

type MortgageFormData = z.infer<typeof mortgageSchema>;

const defaultValues: MortgageFormData = {
  loanAmount: '',
  interestRate: '',
  loanTermYears: '',
  downPayment: '',
};

interface MortgageFormContentProps {
  onCalculate: (data: MortgageFormData) => void;
}

function MortgageFormContent({ onCalculate }: MortgageFormContentProps): React.JSX.Element {
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useFormContext<MortgageFormData>();

  const values = watch();

  return (
    <View>
      <Input
        label="Loan Amount"
        value={values.loanAmount}
        onChangeText={(text) => setValue('loanAmount', text, { shouldValidate: true })}
        keyboardType="decimal-pad"
        placeholder="e.g. 400000"
        error={errors.loanAmount?.message}
        helperText="Total purchase price of the property"
        accessibilityLabel="Loan amount input"
        currency
      />
      <Input
        label="Down Payment"
        value={values.downPayment ?? ''}
        onChangeText={(text) => setValue('downPayment', text, { shouldValidate: true })}
        keyboardType="decimal-pad"
        placeholder="e.g. 80000"
        error={errors.downPayment?.message}
        helperText="Amount paid upfront (optional)"
        accessibilityLabel="Down payment input"
        currency
      />
      <Input
        label="Interest Rate"
        value={values.interestRate}
        onChangeText={(text) => setValue('interestRate', text, { shouldValidate: true })}
        keyboardType="decimal-pad"
        placeholder="e.g. 6.5"
        error={errors.interestRate?.message}
        helperText="Annual interest rate as a percentage"
        accessibilityLabel="Interest rate input"
        suffix="%"
      />
      <Input
        label="Loan Term"
        value={values.loanTermYears}
        onChangeText={(text) => setValue('loanTermYears', text, { shouldValidate: true })}
        keyboardType="number-pad"
        placeholder="e.g. 30"
        error={errors.loanTermYears?.message}
        helperText="Length of the loan in years"
        accessibilityLabel="Loan term input"
        suffix="years"
      />
      <View style={styles.buttonRow}>
        <Button
          title="Calculate Mortgage"
          onPress={handleSubmit(onCalculate)}
          variant="primary"
          accessibilityLabel="Calculate mortgage payment"
          style={styles.calculateButton}
        />
      </View>
    </View>
  );
}

export default function MortgageCalculatorScreen(): React.JSX.Element {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [result, setResult] = useState<MortgageResult | null>(null);
  const [showAmortization, setShowAmortization] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedInputs, setSavedInputs] = useState<MortgageFormData | null>(null);

  const handleCalculate = useCallback((data: MortgageFormData) => {
    setError(null);
    try {
      const loanAmount = parseFloat(data.loanAmount.replace(/[$,]/g, ''));
      const downPayment = data.downPayment
        ? parseFloat(data.downPayment.replace(/[$,]/g, ''))
        : 0;
      const interestRate = parseFloat(data.interestRate);
      const loanTermYears = parseInt(data.loanTermYears, 10);

      if (isNaN(loanAmount) || loanAmount <= 0) {
        setError('Please enter a valid loan amount');
        return;
      }
      if (isNaN(interestRate) || interestRate < 0) {
        setError('Please enter a valid interest rate');
        return;
      }
      if (isNaN(loanTermYears) || loanTermYears <= 0) {
        setError('Please enter a valid loan term');
        return;
      }

      const input: MortgageInput = {
        loanAmount,
        interestRate,
        loanTermYears,
        downPayment: downPayment > 0 ? downPayment : undefined,
      };

      setSavedInputs(data);
      const mortgageResult = calculateMortgage(input);
      setResult(mortgageResult);
      setShowAmortization(false);
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
        id: `mortgage-${Date.now()}`,
        type: 'mortgage',
        inputs: {
          loanAmount: parseCurrency(savedInputs.loanAmount),
          interestRate: parseFloat(savedInputs.interestRate),
          loanTermYears: parseInt(savedInputs.loanTermYears, 10),
          downPayment: savedInputs.downPayment ? parseCurrency(savedInputs.downPayment) : 0,
        },
        result: {
          monthlyPayment: result.monthlyPayment,
          totalInterest: result.totalInterest,
          totalCost: result.totalCost,
          amortizationSchedule: result.amortizationSchedule,
        },
        createdAt: Date.now(),
      });
      Alert.alert('Saved', 'Calculation saved successfully!');
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
        Mortgage Calculator
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.subheader, { color: theme.colors.onSurfaceVariant }]}
      >
        Estimate monthly payments and total cost
      </Text>

      <Card>
        <CalculatorForm
          validationSchema={mortgageSchema}
          defaultValues={defaultValues}
          onSubmit={handleCalculate}
        >
          <MortgageFormContent onCalculate={handleCalculate} />
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
          <Card title="Payment Summary">
            <View
              style={[
                styles.resultsGrid,
                isTablet && styles.resultsGridTablet,
              ]}
            >
              <ResultCard
                title="Monthly Payment"
                value={result.monthlyPayment}
                highlight
                accessibilityLabel={`Monthly payment is ${formatCurrency(result.monthlyPayment)}`}
              />
              <ResultCard
                title="Total Interest"
                value={result.totalInterest}
                accessibilityLabel={`Total interest is ${formatCurrency(result.totalInterest)}`}
              />
              <ResultCard
                title="Total Cost"
                value={result.totalCost}
                accessibilityLabel={`Total cost is ${formatCurrency(result.totalCost)}`}
              />
            </View>
          </Card>

          <View style={styles.actionRow}>
            <Button
              title={showAmortization ? 'Hide Schedule' : 'Show Amortization'}
              onPress={() => setShowAmortization((prev) => !prev)}
              variant="secondary"
              accessibilityLabel="Toggle amortization schedule"
              style={styles.actionButton}
            />
            <Button
              title="Save Calculation"
              onPress={handleSave}
              variant="outline"
              accessibilityLabel="Save this calculation"
              style={styles.actionButton}
            />
          </View>

          {showAmortization && (
            <Card>
              <AmortizationChart data={result.amortizationSchedule} />
            </Card>
          )}
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
    marginBottom: 4,
    fontWeight: '700',
  },
  subheader: {
    marginBottom: 20,
  },
  buttonRow: {
    marginTop: 8,
    marginBottom: 4,
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
    flexWrap: 'wrap',
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
