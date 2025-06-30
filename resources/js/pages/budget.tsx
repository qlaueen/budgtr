import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

type Budget = {
  id: number;
  name: string;
};

type Props = {
  budget: Budget;
};

export default function Budget({ budget }: Props) {
    const cards = [
        { label: 'Set up', routeName: 'setup' },
        { label: 'Expense tracker', routeName: 'dashboard' },
        { label: 'Monthly Overview', routeName: 'dashboard' },
        { label: 'Yearly Overview', routeName: 'dashboard' },
        { label: 'Bills Calendar', routeName: 'dashboard' },
        { label: 'Savings', routeName: 'dashboard' },
    ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={budget.name} />

        <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">{budget.name}</h1>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onSelect={() => {
                                    if (confirm('Really delete this budget?')) {
                                    fetch(`/budgets/${budget.id}`, {
                                        method: 'DELETE',
                                        headers: { 'X-CSRF-TOKEN': document
                                        .querySelector('meta[name="csrf-token"]')
                                        ?.getAttribute('content') || '' },
                                    }).then(() => window.location.href = '/dashboard');
                                    }
                                }}
                            >
                                Delete this budget
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        onClick={() =>
                            window.location.href = route('categories.create', budget.id)
                        }
                    >
                        Add new category
                    </Button>
                </div>
            </div>
            <div className="space-y-8">
                <div className="grid border rounded-lg p-4 grid-cols-1 sm:grid-cols-2 gap-6">
                    {cards.map(({ label, routeName }) => (
                        <Link
                            key={label}
                            href={route(routeName, budget.id)}
                            className="w-full"
                        >
                            <Button
                                variant="secondary"
                                size="xl"
                                className="w-full"
                            >
                                {label}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    </AppLayout>
  );
}
