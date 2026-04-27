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

interface SectionHeaderProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

function SectionHeader({ icon, title, subtitle }: SectionHeaderProps): React.JSX.Element {
  const theme = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <View style={styles.sectionText}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}

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
  const theme = useTheme();

  return (
    <View>
      {/* Purchase Section */}
      <SectionHeader
        icon="cash"
        title="Purchase Costs"
        subtitle="Upfront investment required"
      />
      <View style={styles.inputGrid}>
        <View style={styles.inputHalf}>
          <Input
            label="Purchase Price"
            value={values.purchasePrice}
            onChangeText={(text) => setValue('purchasePrice', text, { shouldValidate: true })}
            keyboardType="decimal-pad"
            placeholder="400000"
            error={errors.purchasePrice?.message}
            accessibilityLabel="Purchase price input"
            currency
          />
        </View>
        <View style={styles.inputHalf}>
          <Input
            label="Down Payment"
            value={values.downPayment}
            onChangeText={(text) => setValue('downPayment', text, { shouldValidate: true })}
            keyboardType="decimal-pad"
            placeholder="80000"
            error={errors.downPayment?.message}
            accessibilityLabel="Down payment input"
            currency
          />
        </View>
      </View>
      <View style={styles.inputGrid}>
        <View style={styles.inputHalf}>
          <Input
            label="Closing Costs"
            value={values.closingCosts}
            onChangeText={(text) => setValue('closingCosts', text, { shouldValidate: true })}
            keyboardType="decimal-pad"
            placeholder="5000"
            error={errors.closingCosts?.message}
            accessibilityLabel="Closing costs input"
            currency
          />
        </View>
        <View style={styles.inputHalf}>
          <Input
            label="Rehab Costs"
            value={values.rehabCosts}
            onChangeText={(text) => setValue('rehabCosts', text, { shouldValidate: true })}
            keyboardType="decimal-pad"
            placeholder="10000"
            error={errors.rehabCosts?.message}
            accessibilityLabel="Rehab costs input"
            currency
          />
        </View>
      </View>

      {/* Income Section */}
      <View style={[styles.sectionDivider, { backgroundColor: theme.colors.outline }]} />
      <SectionHeader
        icon="trending-up"
        title="Rental Income"
        subtitle="Monthly cash flow estimates"
      />
      <View style={styles.inputGrid}>
        <View style={styles.inputHalf}>
          <Input
            label="Monthly Rent"
            value={values.monthlyRent}
            onChangeText={(text) => setValue('monthlyRent', text, { shouldValidate: true })}
            keyboardType="decimal-pad"
            placeholder="2500"
            error={errors.monthlyRent?.message}
            accessibilityLabel="Monthly rent input"
            currency
          />
        </View>
        <View style={styles.inputHalf}>
          <Input
            label="Monthly Expenses"
            value={values.monthlyExpenses}
            onChangeText={(text) => setValue('monthlyExpenses', text, { shouldValidate: true })}
            keyboardType="decimal-pad"
            placeholder="800"
            error={errors.monthlyExpenses?.message}
            accessibilityLabel="Monthly expenses input"
            currency
          />
        </View>
      </View>

      {/* Projections Section */}
      <View style={[styles.sectionDivider, { backgroundColor: theme.colors.outline }]} />
      <SectionHeader
        icon="calendar"
        title="Projections"
        subtitle="Future assumptions"
      />
      <View style={styles.inputGrid}>
        <View style={styles.inputHalf}>
          <Input
            label="Vacancy Rate"
            value={values.vacancyRate}
            onChangeText={(text) => setValue('vacancyRate', text, { shouldValidate: true })}
            keyboardType="decimal-pad"
            placeholder="5"
            error={errors.vacancyRate?.message}
            accessibilityLabel="Vacancy rate input"
            suffix="%"
          />
        </View>
        <View style={styles.inputHalf}>
          <Input
            label="Appreciation"
            value={values.appreciationRate ?? ''}
            onChangeText={(text) => setValue('appreciationRate', text, { shouldValidate: true })}
            keyboardType="decimal-pad"
            placeholder="3"
            error={errors.appreciationRate?.message}
            accessibilityLabel="Appreciation rate input"
            suffix="%"
          />
        </View>
      </View>
      <Input
        label="Holding Period"
        value={values.holdingPeriodYears}
        onChangeText={(text) => setValue('holdingPeriodYears', text, { shouldValidate: true })}
        keyboardType="number-pad"
        placeholder="5"
        error={errors.holdingPeriodYears?.message}
        accessibilityLabel="Holding period input"
        suffix="years"
        returnKeyType="done"
        onSubmitEditing={handleSubmit(onCalculate)}
      />

      <Button
        title="Calculate ROI"
        onPress={handleSubmit(onCalculate)}
        variant="primary"
        accessibilityLabel="Calculate ROI"
        style={styles.calculateButton}
      />
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
      const { saveCalculation } = await import('@/services/storage');
      const { parseCurrency } = await import('@/engine/utils/currency');
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
            ROI Calculator
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subheader, { color: theme.colors.onSurfaceVariant }]}
          >
            Calculate cash-on-cash return and cash flow
          </Text>
        </View>
      </View>

      <Card>
        <CalculatorForm
          validationSchema={roiSchema}
          defaultValues={defaultValues}
          onSubmit={handleCalculate}
        >
          <ROIFormContent onCalculate={handleCalculate} />
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
          <Card title="Investment Returns">
            <View style={[styles.resultsGrid, isTablet && styles.resultsGridTablet]}>
              <ResultCard
                title="Cash-on-Cash"
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionText: {
    flex: 1,
  },
  sectionDivider: {
    height: 1,
    marginVertical: 16,
    opacity: 0.5,
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
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
