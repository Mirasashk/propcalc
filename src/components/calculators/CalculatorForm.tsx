import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, FormProvider, DefaultValues, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface CalculatorFormProps<T extends FieldValues> {
  validationSchema: z.ZodSchema<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
}

export function CalculatorForm<T extends FieldValues>({
  validationSchema,
  defaultValues,
  children,
}: CalculatorFormProps<T>): React.JSX.Element {
  const form = useForm<T>({
    resolver: zodResolver(validationSchema as unknown as Parameters<typeof zodResolver>[0]) as any,
    defaultValues,
    mode: 'onBlur',
  });

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        {children}
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
