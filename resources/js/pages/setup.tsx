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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex justify-between items-center p-4 border rounded-lg hover:shadow transition"
              >
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{cat.type}</p>
                </div>
                {/* <Link href={route('categories.edit', [budget.id, cat.id])}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link> */}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No categories yet.</p>
        )}
      </div>
    </AppLayout>
  );
}
