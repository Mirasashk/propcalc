import React from 'react';
import { View, StyleSheet, ScrollView, Switch, useWindowDimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/styles/ThemeProvider';
import { Card } from '@/components/ui';

export default function ProfileScreen(): React.JSX.Element {
  const theme = useTheme();
  const { themeMode, toggleTheme } = useAppTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const settings = [
    {
      icon: 'moon' as const,
      title: 'Dark Mode',
      subtitle: themeMode === 'dark' ? 'Enabled' : 'Disabled',
      action: (
        <Switch
          value={themeMode === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.colors.outline, true: theme.colors.primary }}
          thumbColor="#FFFFFF"
        />
      ),
    },
  ];

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
        Profile
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.subheader, { color: theme.colors.onSurfaceVariant }]}
      >
        App settings and preferences
      </Text>

      <Card title="Appearance">
        {settings.map((setting, index) => (
          <View
            key={setting.title}
            style={[
              styles.settingRow,
              index < settings.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.outline,
              },
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name={setting.icon} size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingText}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                {setting.title}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {setting.subtitle}
              </Text>
            </View>
            {setting.action}
          </View>
        ))}
      </Card>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          PropCalc v1.0.0
        </Text>
      </View>
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
});
