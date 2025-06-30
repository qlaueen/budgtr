import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

type Budget = {
  id: number;
  name: string;
};

type Props = {
  budgets: Budget[];
};

export default function Dashboard({ budgets }: Props) {
  function handleCreateBudget() {
    window.location.href = '/new-budget';
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Button
            type="button"
            className="default m-4"
            tabIndex={4}
            onClick={handleCreateBudget}
          >
            Create a budget
          </Button>
        </div>

        <div className="flex min-h-[100vh] p-3 flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className="flex flex-col gap-2 w-full h-full overflow-y-auto">
            {budgets.length > 0 ? (
                budgets.map((budget) => (
                    <div
                        key={budget.id}
                        className="flex justify-between items-center rounded-lg border p-4 hover:shadow-md"
                    >
                        <span className="font-medium text-lg">{budget.name}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/budgets/${budget.id}`}
                        >
                            View Budget
                        </Button>
                    </div>
                ))
                ) : (
                    <p className="text-center text-gray-500">No budgets yet.</p>
                )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
