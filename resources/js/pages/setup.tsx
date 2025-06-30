import { Head, Link } from '@inertiajs/react';
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

type Category = {
  id: number;
  name: string;
  type: 'income' | 'expense' | 'savings' | 'investment' | 'debt';
};

const ALL_TYPES = ['income','expense','savings','investment','debt'] as const;

type Props = {
  budget: Budget;
  categories: Category[];
};

export default function SetUp({ budget, categories }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={`Set Up – ${budget.name}`} />

        <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">{budget.name}</h1>
                <Button
                    onClick={() =>
                    window.location.href = route('categories.create', budget.id)
                    }
                >
                    Add new category
                </Button>
            </div>

            {categories.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {ALL_TYPES.map((type) => {
                        const catsOfType = categories.filter((c) => c.type === type);

                        if (catsOfType.length === 0) return null;

                        return (
                            <section className="flex flex-col gap-2" key={type}>
                                <h2 className="text-xl font-semibold capitalize">{type}</h2>
                                {catsOfType.map((c) => (
                                    <div
                                        key={c.id}
                                        className="flex justify-between items-center p-4 border rounded-lg hover:shadow transition"
                                    >
                                        <div>
                                            <p className="font-medium">{c.name}</p>
                                            <p className="text-sm text-gray-500 capitalize">{c.type}</p>
                                        </div>
                                        <Link href={route('categories.update', [budget.id, c.id])}>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </section>
                        );
                        })}
                </div>
                ) : (
                    <p className="text-center text-gray-500">No categories yet.</p>
                )}
        </div>
    </AppLayout>
  );
}
