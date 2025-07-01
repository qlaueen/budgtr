import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Inertia } from '@inertiajs/inertia';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';

const breadcrumbs = (budget_id: number, budget_name: string) => [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Budgets', href: `/budgets` },
    { title: `${budget_name}`, href: `/budgets/${budget_id}` },
    { title: 'Set up', href: `/setup` }

];

type Budget = { id: number; name: string };
type Category = { id: number; name: string; type: string };
type Method = { id: number; name: string; is_active: boolean; is_credit_card: boolean };

type Props = {
    budget: Budget;
    categories: Category[];
    methods: Method[];
};

const ALL_TYPES = ['income','expense','savings','investment','debt'] as const;

export default function SetUp({ budget, categories, methods }: Props) {
  const [editingCategory, setEditingCategory] = useState<Category|null>(null);
  const [editingMethod,   setEditingMethod]   = useState<Method|null>(null);

  return (
    <AppLayout breadcrumbs={breadcrumbs(budget.id, budget.name)}>
        <Head title={`Set Up – ${budget.name}`} />
        <h1 className="text-2xl p-4 font-semibold">{budget.name}</h1>

        <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-6 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Categories</h2>
                        <Button
                            onClick={() => window.location.href = route('categories.create', budget.id)}
                        >
                            Add new category
                        </Button>
                </div>

                {categories.length > 0 ? (
                    ALL_TYPES.map(type => {
                        const cats = categories.filter(c => c.type === type);
                        if (!cats.length) return null;

                        return (
                            <section key={type} className="flex flex-col gap-2">
                                <h3 className="text-xl font-semibold capitalize">{type}</h3>
                                {cats.map(c => (
                                    <div
                                        key={c.id}
                                        className="flex justify-between items-center p-4 border rounded-lg hover:shadow transition"
                                    >
                                        <div>
                                            <p className="font-medium">{c.name}</p>
                                            <p className="text-sm text-gray-500 capitalize">{c.type}</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setEditingCategory(c)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </section>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500">No categories yet.</p>
                )}
            </div>

            <div className="flex-1 flex flex-col gap-6 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Methods</h2>
                    <Button
                        onClick={() => window.location.href = route('methods.create', budget.id)}
                    >
                        Add new method
                    </Button>
                </div>

                {methods.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {methods.map(m => (
                            <div
                                key={m.id}
                                className="flex justify-between items-center p-4 border rounded-lg hover:shadow transition"
                            >
                                <div className="flex flex-col gap-2">
                                    <p className="font-medium">{m.name}</p>
                                    <div className="flex gap-4">
                                        <p className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
                                              {m.is_active ? 'Active' : 'Inactive'}
                                        </p>
                                        <p className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
                                              {m.is_credit_card ? 'Credit card' : 'Not a credit card'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setEditingMethod(m)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No methods yet.</p>
                )}
                </div>
        </div>

        {editingCategory && (
            <Modal onClose={() => setEditingCategory(null)}>
                <h2 className="text-xl font-semibold mb-4">
                    Edit “{editingCategory.name}”
                </h2>
                <EditCategoryForm
                    budgetId={budget.id}
                    category={editingCategory}
                    onSuccess={() => setEditingCategory(null)}
                />
            </Modal>
        )}

        {editingMethod && (
            <Modal onClose={() => setEditingMethod(null)}>
            <h2 className="text-xl font-semibold mb-4">
                Edit “{editingMethod.name}”
            </h2>
            <EditMethodForm
                budgetId={budget.id}
                method={editingMethod}
                onSuccess={() => setEditingMethod(null)}
            />
            </Modal>
        )}
        </AppLayout>
    );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose(): void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={onClose}
                >
                    ×
                </Button>
                {children}
            </div>
        </div>
    );
}

type EditCategoryProps = {
    budgetId: number;
    category: Category;
    onSuccess(): void;
};
function EditCategoryForm({ budgetId, category, onSuccess }: EditCategoryProps) {
    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        name: category.name,
        type: category.type,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('categories.update', [budgetId, category.id]), {
            onSuccess: onSuccess,
        });
    };

    function handleDelete() {
        if (!confirm('Are you sure you want to delete this method?')) return;
        destroy(
            route('categories.destroy', {
                budget:  budgetId,
                category: category.id
            }),
            { onSuccess }
        );
    }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
            <Label htmlFor="name">Name</Label>
            <Input
                id="name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
            <Label htmlFor="type">Type</Label>
            <Select
                value={data.type}
                onValueChange={val => setData('type', val)}
                required
            >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {ALL_TYPES.map(t => (
                        <SelectItem key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
        </div>

        <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onSuccess}>Cancel</Button>
            <Button type="submit" disabled={processing}>Save</Button>
            <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
            >
                Delete
            </Button>
        </div>
    </form>
  );
}

type EditMethodProps = {
    budgetId: number;
    method: Method;
    onSuccess(): void;
};
function EditMethodForm({ budgetId, method, onSuccess }: EditMethodProps) {
    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        name: method.name,
        is_active: method.is_active,
        is_credit_card: method.is_credit_card,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('methods.update', [budgetId, method.id]), {
            onSuccess: onSuccess,
        });
    };

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete this method?')) {
            return;
        }
        destroy(route('methods.destroy', [budgetId, method.id]), {
            onSuccess: onSuccess,
        });
    }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
            <Label htmlFor="name">Name</Label>
            <Input
                id="name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="flex items-center space-x-3">
            <Checkbox
                id="is_active"
                checked={data.is_active}
                onClick={() => setData('is_active', !data.is_active)}
            />
            <Label htmlFor="is_active">Active</Label>
        </div>

        <div className="flex items-center space-x-3">
            <Checkbox
                id="is_credit_card"
                checked={data.is_credit_card}
                onClick={() => setData('is_credit_card', !data.is_credit_card)}
            />
            <Label htmlFor="is_credit_card">Credit Card</Label>
        </div>

        <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onSuccess}>Cancel</Button>
            <Button type="submit" disabled={processing}>Save</Button>
            <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
            >
                Delete
            </Button>
        </div>
    </form>
  );
}
