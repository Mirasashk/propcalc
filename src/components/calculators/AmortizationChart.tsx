import React, { useMemo, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';
import { AmortizationEntry } from '@engine/types';
import { formatCurrency } from '@engine/utils/currency';

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

/** Filter to show every N years for long loans */
function filterByInterval(years: YearAggregate[], interval: number): YearAggregate[] {
  if (interval <= 1) return years;
  return years.filter((_, index) => index % interval === 0 || index === years.length - 1);
}

export const AmortizationChart = React.memo(function AmortizationChart({
  data,
}: AmortizationChartProps): React.JSX.Element {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const [interval, setInterval] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<YearAggregate | null>(null);
  const [showModal, setShowModal] = useState(false);

  const years = useMemo(() => aggregateByYear(data), [data]);
  const totalYears = years.length;

  // Auto-suggest interval based on total years
  const suggestedInterval = useMemo(() => {
    if (totalYears <= 10) return 1;
    if (totalYears <= 20) return 2;
    if (totalYears <= 30) return 5;
    return 10;
  }, [totalYears]);

  // Track if we've auto-initialized the interval (only do it once on mount)
  const didAutoInit = useRef(false);

  // Initialize interval once on mount if loan is long
  React.useEffect(() => {
    if (!didAutoInit.current && totalYears > 10) {
      didAutoInit.current = true;
      setInterval(suggestedInterval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalYears, suggestedInterval]);

  const displayYears = useMemo(
    () => filterByInterval(years, interval),
    [years, interval]
  );

  const chartData = useMemo(() => {
    return displayYears.map((y) => ({
      stacks: [
        { value: Math.round(y.principal), color: theme.colors.primary, marginBottom: 2 },
        { value: Math.round(y.interest), color: theme.colors.tertiary },
      ],
      label: `Y${y.year}`,
    }));
  }, [displayYears, theme.colors.primary, theme.colors.tertiary]);

  const handleBarPress = (index: number) => {
    const yearData = displayYears[index];
    if (yearData) {
      setSelectedYear(yearData);
      setShowModal(true);
    }
  };

  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          No amortization data available
        </Text>
      </View>
    );
  }

  // Calculate chart dimensions
  const containerPadding = 32;
  const availableWidth = screenWidth - containerPadding - 32;
  const chartHeight = 220;

  // Minimum width per bar to ensure readability
  const minBarWidth = 28;
  const barSpacing = 8;
  const totalChartWidth = Math.max(
    availableWidth,
    chartData.length * (minBarWidth + barSpacing) + barSpacing * 2
  );

  const barWidth = Math.max(
    12,
    (totalChartWidth - barSpacing * 2) / chartData.length - barSpacing
  );

  // Get monthly data for the selected year
  const getMonthlyDataForYear = (yearNum: number) => {
    const startMonth = (yearNum - 1) * 12 + 1;
    const endMonth = yearNum * 12;
    return data.filter((entry) => entry.month >= startMonth && entry.month <= endMonth);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text
          variant="titleMedium"
          style={[styles.header, { color: theme.colors.onSurface }]}
        >
          Amortization Schedule
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Principal vs Interest by Year
        </Text>
      </View>

      {/* Interval selector for long loans */}
      {totalYears > 10 && (
        <View style={styles.intervalRow}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Show:
          </Text>
          {[1, 2, 5, 10].map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setInterval(opt)}
              style={[
                styles.intervalChip,
                {
                  backgroundColor:
                    interval === opt
                      ? theme.colors.primaryContainer
                      : theme.colors.surfaceVariant,
                  borderColor:
                    interval === opt ? theme.colors.primary : theme.colors.outline,
                },
              ]}
            >
              <Text
                variant="labelMedium"
                style={{
                  color:
                    interval === opt
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant,
                }}
              >
                {opt === 1 ? 'Every year' : `Every ${opt} years`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Tap hint */}
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
        Tap a bar to see details
      </Text>

      {/* Horizontal scroll for chart overflow */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.chartScrollContainer}
        style={styles.chartScroll}
      >
        <BarChart
          stackData={chartData}
          width={totalChartWidth}
          height={chartHeight}
          barWidth={barWidth}
          spacing={barSpacing}
          initialSpacing={barSpacing}
          endSpacing={barSpacing}
          noOfSections={5}
          yAxisLabelPrefix="$"
          yAxisTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
          xAxisColor={theme.colors.outline}
          yAxisColor={theme.colors.outline}
          rulesColor={theme.colors.outlineVariant}
          rulesType="solid"
          showValuesAsTopLabel={true}
          topLabelTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 9 }}
          hideRules={false}
          hideYAxisText={false}
          hideOrigin={false}
          onPress={handleBarPress}
        />
      </ScrollView>

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

      {/* Year Detail Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          onPress={() => setShowModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                  Year {selectedYear?.year}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Monthly breakdown
                </Text>
              </View>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowModal(false)}
                iconColor={theme.colors.onSurfaceVariant}
              />
            </View>

            {/* Year Summary */}
            {selectedYear && (
              <View style={[styles.yearSummary, { backgroundColor: theme.colors.primaryContainer }]}>
                <View style={styles.summaryItem}>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Principal</Text>
                  <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                    {formatCurrency(selectedYear.principal)}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Interest</Text>
                  <Text variant="titleMedium" style={{ color: theme.colors.tertiary, fontWeight: '700' }}>
                    {formatCurrency(selectedYear.interest)}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>End Balance</Text>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                    {formatCurrency(selectedYear.endBalance)}
                  </Text>
                </View>
              </View>
            )}

            {/* Monthly Table Header */}
            <View style={[styles.tableHeader, { borderBottomColor: theme.colors.outline }]}>
              <Text variant="labelMedium" style={[styles.tableCell, { color: theme.colors.onSurfaceVariant }]}>
                Month
              </Text>
              <Text variant="labelMedium" style={[styles.tableCellRight, { color: theme.colors.onSurfaceVariant }]}>
                Principal
              </Text>
              <Text variant="labelMedium" style={[styles.tableCellRight, { color: theme.colors.onSurfaceVariant }]}>
                Interest
              </Text>
              <Text variant="labelMedium" style={[styles.tableCellRight, { color: theme.colors.onSurfaceVariant }]}>
                Balance
              </Text>
            </View>

            {/* Monthly Data */}
            <FlatList
              data={selectedYear ? getMonthlyDataForYear(selectedYear.year) : []}
              keyExtractor={(item) => item.month.toString()}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>
                  <Text variant="bodySmall" style={[styles.tableCell, { color: theme.colors.onSurface }]}>
                    {item.month}
                  </Text>
                  <Text variant="bodySmall" style={[styles.tableCellRight, { color: theme.colors.primary }]}>
                    {formatCurrency(item.principal)}
                  </Text>
                  <Text variant="bodySmall" style={[styles.tableCellRight, { color: theme.colors.tertiary }]}>
                    {formatCurrency(item.interest)}
                  </Text>
                  <Text variant="bodySmall" style={[styles.tableCellRight, { color: theme.colors.onSurface }]}>
                    {formatCurrency(item.balance)}
                  </Text>
                </View>
              )}
              style={styles.tableList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  headerRow: {
    marginBottom: 12,
  },
  header: {
    fontWeight: '600',
  },
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  intervalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  intervalChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  chartScroll: {
    marginHorizontal: -8,
  },
  chartScrollContainer: {
    paddingHorizontal: 8,
  },
  legend: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
    justifyContent: 'center',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  yearSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  tableCell: {
    flex: 1,
  },
  tableCellRight: {
    flex: 1.2,
    textAlign: 'right',
  },
  tableList: {
    maxHeight: 300,
  },
});
