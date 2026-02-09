import { useMemo } from 'react';
import type { Contract, DashboardStats } from '../types';
import { monthlyTrend } from '../utils/dataTransformers';

export function useDashboardStats(contracts: Contract[]): DashboardStats {
  return useMemo(() => {
    const active = contracts.filter(c => !c.cancelled);
    const totalValue = active.reduce((s, c) => s + c.totalValue, 0);
    const totalArea = active.reduce((s, c) => s + c.area, 0);
    const direct = active.filter(c => c.isDirect);
    const directValue = direct.reduce((s, c) => s + c.totalValue, 0);

    const contractsByYear: Record<number, number> = {};
    const valueByYear: Record<number, number> = {};
    for (const c of active) {
      contractsByYear[c.year] = (contractsByYear[c.year] ?? 0) + 1;
      valueByYear[c.year] = (valueByYear[c.year] ?? 0) + c.totalValue;
    }

    const withArea = active.filter(c => c.area > 0);
    const avgPricePerM2 = withArea.length > 0
      ? withArea.reduce((s, c) => s + c.totalValue, 0) / withArea.reduce((s, c) => s + c.area, 0)
      : 0;

    const brokerMap: Record<string, { count: number; value: number }> = {};
    for (const c of active) {
      const name = c.broker || 'Direta';
      if (!brokerMap[name]) brokerMap[name] = { count: 0, value: 0 };
      brokerMap[name].count += 1;
      brokerMap[name].value += c.totalValue;
    }
    const salesByBroker = Object.entries(brokerMap)
      .map(([broker, data]) => ({ broker, ...data }))
      .sort((a, b) => b.value - a.value);

    return {
      totalContracts: active.length,
      totalValue,
      directSalesCount: direct.length,
      directSalesValue: directValue,
      directSalesPercent: active.length > 0 ? (direct.length / active.length) * 100 : 0,
      totalArea,
      avgPricePerM2,
      contractsByYear,
      valueByYear,
      salesByBroker,
      monthlyTrend: monthlyTrend(active),
    };
  }, [contracts]);
}
