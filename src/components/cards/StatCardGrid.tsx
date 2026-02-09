import { FileText, DollarSign, Target, ShoppingCart, Building } from 'lucide-react';
import { StatCard } from './StatCard';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import type { DashboardStats } from '../../types';

interface StatCardGridProps {
  stats: DashboardStats;
}

export function StatCardGrid({ stats }: StatCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total de Contratos"
        value={String(stats.totalContracts)}
        subtitle={`${Object.entries(stats.contractsByYear).map(([y, c]) => `${y}: ${c}`).join(' | ')}`}
        icon={FileText}
        color="text-gold-400"
      />
      <StatCard
        title="Valor Total"
        value={formatCurrency(stats.totalValue)}
        subtitle={`Média: ${formatCurrency(stats.totalValue / (stats.totalContracts || 1))}`}
        icon={DollarSign}
        color="text-emerald"
      />
      <StatCard
        title="Vendas Diretas"
        value={`${stats.directSalesCount}`}
        subtitle={`${formatPercent(stats.directSalesPercent)} dos contratos`}
        icon={Target}
        color="text-teal"
      />
      <StatCard
        title="Total de Vendas"
        value={formatCurrency(stats.totalValue)}
        subtitle={`${Object.entries(stats.valueByYear).sort(([a], [b]) => Number(a) - Number(b)).map(([y, v]) => `${y}: ${formatCurrency(v)}`).join(' | ')}`}
        icon={ShoppingCart}
        color="text-amber"
      />
      <StatCard
        title="Vendas por Imobiliária"
        value={`${stats.salesByBroker.length} imobiliárias`}
        subtitle={stats.salesByBroker.slice(0, 3).map(b => `${b.broker}: ${formatCurrency(b.value)}`).join(' | ')}
        icon={Building}
        color="text-blue-400"
      />
    </div>
  );
}
