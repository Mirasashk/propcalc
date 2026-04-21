import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';
import { AmortizationEntry } from '@engine/types';

interface AmortizationChartProps {
  data: AmortizationEntry[];
}

interface YearAggregate {
  year: number;
  principal: number;
  interest: number;
  endBalance: number;
}

function aggregateByYear(entries: AmortizationEntry[]): YearAggregate[] {
  const years: YearAggregate[] = [];
  let currentYear: YearAggregate | null = null;

  for (const entry of entries) {
    const yearNumber = Math.ceil(entry.month / 12);
    if (!currentYear || currentYear.year !== yearNumber) {
      currentYear = {
        year: yearNumber,
        principal: 0,
        interest: 0,
        endBalance: entry.balance,
      };
      years.push(currentYear);
    }
    currentYear.principal += entry.principal;
    currentYear.interest += entry.interest;
    currentYear.endBalance = entry.balance;
  }

  return years;
}

export const AmortizationChart = React.memo(function AmortizationChart({
  data,
}: AmortizationChartProps): React.JSX.Element {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const chartData = useMemo(() => {
    const years = aggregateByYear(data);
    return years.map((y) => ({
      stacks: [
        { value: Math.round(y.principal), color: theme.colors.primary, marginBottom: 2 },
        { value: Math.round(y.interest), color: theme.colors.tertiary },
      ],
      label: `Y${y.year}`,
    }));
  }, [data, theme.colors.primary, theme.colors.tertiary]);

  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          No amortization data available
        </Text>
      </View>
    );
  }

  const chartWidth = Math.min(width - 32, 600);

  return (
    <View style={styles.container}>
      <Text
        variant="titleMedium"
        style={[styles.header, { color: theme.colors.onSurface }]}
      >
        Amortization Schedule (Principal vs Interest by Year)
      </Text>
      <BarChart
        stackData={chartData}
        width={chartWidth}
        height={220}
        barWidth={Math.max(8, chartWidth / chartData.length - 4)}
        spacing={4}
        initialSpacing={8}
        endSpacing={8}
        noOfSections={5}
        yAxisLabelPrefix="$"
        yAxisTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
        xAxisColor={theme.colors.outline}
        yAxisColor={theme.colors.outline}
        rulesColor={theme.colors.outlineVariant}
        rulesType="solid"
        showValuesAsTopLabel={false}
        hideRules={false}
        hideYAxisText={false}
        hideOrigin={false}
      />
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Principal
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: theme.colors.tertiary }]} />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Interest
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    alignItems: 'center',
  },
  header: {
    marginBottom: 12,
    fontWeight: '600',
  },
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
