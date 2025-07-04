import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = (budget_id: number, budget_name: string) => [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Budgets', href: '/budgets' },
    { title: budget_name, href: `/budgets/${budget_id}` },
    { title: 'Monthly Overview', href: `/budgets/${budget_id}/monthly` },
];

type Budget = { id: number; name: string };
type Category = { id: number; name: string; type: string };
type Method = { id: number; name: string; is_active: boolean; is_credit_card: boolean };
type Expense = {
    id: number;
    description: string;
    date: string;
    amount: number;
    category: { id: number; name: string };
    method: { id: number; name: string };
    is_recurring: boolean;
};

type Props = {
  budget: Budget;
  categories: Category[];
  methods: Method[];
  expenses: Expense[];
  totals: { category_id: number; spent: number }[];
  expected: Record<number, number>;
};

export default function Monthly({ budget, totals, expected }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs(budget.id, budget.name)}>
      <Head title={`Monthly Overview – ${budget.name}`} />
      <div>
        <h1>{totals.</h1>
      </div>
    </AppLayout>
  );
}