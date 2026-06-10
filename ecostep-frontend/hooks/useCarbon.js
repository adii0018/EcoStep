import { useCallback } from 'react';
import { calculateCO2, getTypesForCategory, categories, categoryMeta } from '../lib/carbonFactors';

export function useCarbon() {
  const getCalculation = useCallback((category, type, quantity) => {
    return calculateCO2(category, type, quantity);
  }, []);

  const getTypes = useCallback((category) => {
    return getTypesForCategory(category);
  }, []);

  return {
    categories,
    categoryMeta,
    calculateCO2: getCalculation,
    getTypesForCategory: getTypes,
  };
}
