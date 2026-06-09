import { calculateCO2, getTypesForCategory } from '../lib/carbonFactors.js'
import { AppError } from '../lib/AppError.js'

describe('calculateCO2', () => {
  describe('travel', () => {
    test('Car petrol 10km = 1.8 kg CO2', () => {
      expect(calculateCO2('travel', 'Car (petrol)', 10)).toBe(1.8)
    })
    test('Bus 10km = 0.4 kg CO2', () => {
      expect(calculateCO2('travel', 'Bus', 10)).toBe(0.4)
    })
    test('Metro 10km = 0.2 kg CO2', () => {
      expect(calculateCO2('travel', 'Metro/train', 10)).toBe(0.2)
    })
  })
  describe('food', () => {
    test('Vegan meal 1 unit = 0.5 kg CO2', () => {
      expect(calculateCO2('food', 'Vegan meal', 1)).toBe(0.5)
    })
    test('Chicken meal 1 unit = 6.0 kg CO2', () => {
      expect(calculateCO2('food', 'Chicken meal', 1)).toBe(6.0)
    })
  })
  describe('edge cases', () => {
    test('zero quantity returns 0', () => {
      expect(calculateCO2('travel', 'Bus', 0)).toBe(0)
    })
    test('negative quantity throws AppError', () => {
      expect(() => calculateCO2('travel', 'Bus', -5)).toThrow(AppError)
    })
    test('unknown type throws AppError', () => {
      expect(() => calculateCO2('travel', 'Rocket ship', 10)).toThrow(AppError)
    })
    test('unknown category throws AppError', () => {
      expect(() => calculateCO2('flying', 'Bus', 10)).toThrow(AppError)
    })
  })
})

describe('getTypesForCategory', () => {
  test('travel returns 6 types', () => {
    expect(getTypesForCategory('travel')).toHaveLength(6)
  })
  test('unknown category returns empty array', () => {
    expect(getTypesForCategory('xyz')).toEqual([])
  })
})
