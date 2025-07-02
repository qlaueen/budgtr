import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash } from 'lucide-react';

const breadcrumbs = (budget_id: number, budget_name: string) => [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Budgets', href: '/budgets' },
    { title: budget_name, href: `/budgets/${budget_id}` },
    { title: 'Expense Tracker', href: `/budgets/${budget_id}/expenses` },
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
};

export default function Expenses({ budget, categories, methods, expenses }: Props) {
    type PageProps = {
        flash?: { success?: string };
    };
    const page = usePage<PageProps>().props;
    const flash = page.flash || {};
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        delete: destroy,
    } = useForm<{
        description: string;
        amount: number;
        date: string;
        category_id: number | null;
        method_id: number | null;
        is_recurring: boolean;
    }>({
        description: '',
        date: '',
        amount: 0,
        category_id: categories[0]?.id || null,
        method_id: methods[0]?.id || null,
        is_recurring: false,
    });

    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('expenses.store', budget.id), {
            onFinish: () => reset(
                'description',
                'amount',
                'date',
                'category_id',
                'method_id',
                'is_recurring'
            ),
        });
    };

    const handleDelete = (expenseId: number) => {
        if (confirm('Delete this expense?')) {
            destroy(route('expenses.destroy', [budget.id, expenseId]));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(budget.id, budget.name)}>
            <Head title={`Expenses: ${budget.name}`} />

            {flash.success && (
                <div className="mb-4 rounded bg-green-100 p-3 text-green-800">
                    {flash.success}
                </div>
            )}
            <div className="p-4">
                <h1 className="text-2xl p-4 font-semibold">{budget.name} - Expense Tracker</h1>

                <form onSubmit={handleSubmit} className="mb-6 p-6 bg-card rounded-lg shadow">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[200px] flex flex-col">
                            <Input
                                id="description"
                                value={data.description}
                                placeholder='Description'
                                onChange={e => setData('description', e.target.value)}
                                className="w-full"
                            />
                            {errors.description && <p className="text-destructive mt-1 text-sm">{errors.description}</p>}
                        </div>

                        <div className="w-32 flex flex-col">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={e => setData('amount', parseFloat(e.target.value) || 0)}
                                    className="pl-7 w-full"
                                />
                            </div>
                            {errors.amount && <p className="text-destructive mt-1 text-sm">{errors.amount}</p>}
                        </div>

                        <div className="w-36 flex flex-col">
                            <Input
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                className="w-full"
                            />
                            {errors.date && <p className="text-destructive mt-1 text-sm">{errors.date}</p>}
                        </div>

                        <div className="w-40 flex flex-col">
                            <Select
                                defaultValue=""
                                value={data.category_id?.toString()}
                                onValueChange={val => setData('category_id', Number(val))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category_id && <p className="text-destructive mt-1 text-sm">{errors.category_id}</p>}
                        </div>

                        <div className="w-40 flex flex-col">
                            <Select
                                defaultValue=""
                                value={data.method_id?.toString()}
                                onValueChange={val => setData('method_id', Number(val))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {methods.map(m => (
                                        <SelectItem key={m.id} value={m.id.toString()}>
                                            {m.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.method_id && <p className="text-destructive mt-1 text-sm">{errors.method_id}</p>}
                        </div>

                        <div className="flex items-center justify-center space-x-2">
                            <Checkbox
                                id="is_recurring"
                                checked={data.is_recurring}
                                onCheckedChange={checked => setData('is_recurring', Boolean(checked))}
                            />
                            <Label htmlFor="is_recurring">Recurring</Label>
                        </div>

                        <div className="ml-auto">
                        <Button type="submit" disabled={processing}>Add Expense</Button>
                        </div>
                    </div>
                </form>

                <div className="overflow-x-auto bg-card rounded-lg shadow">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Recurring</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {expenses.length ? (
                                expenses.map(e => (
                                    <tr key={e.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{e.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{e.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${Number(e.amount).toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{e.category.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{e.method.name}</td>
                                        <td className="block md:table-cell px-4 py-2 whitespace-normal">
                                        {Number(e.is_recurring) ? 'Yes' : 'No'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="icon" onClick={() => setEditingExpense(e)}>
                                                    <Pencil className='h-4 w-4' />
                                                </Button>
                                                <Button variant="destructive" size="icon" onClick={() => handleDelete(e.id)}>
                                                    <Trash className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-muted-foreground">No expenses yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {editingExpense && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Edit Expense</h2>
                            <EditExpenseForm
                                budget={budget}
                                expense={editingExpense}
                                categories={categories}
                                methods={methods}
                                onClose={() => setEditingExpense(null)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function EditExpenseForm({ budget, expense, categories, methods, onClose }: { budget: Budget; expense: Expense; categories: Category[]; methods: Method[]; onClose(): void }) {
    const { data, setData, put, processing, errors } = useForm({
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category_id: expense.category.id,
        method_id: expense.method.id,
        is_recurring: expense.is_recurring,
    });
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('expenses.update', [budget.id, expense.id]), { onSuccess: () => onClose() });
    };
    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
                <Label htmlFor="desc_edit">Description</Label>
                <Input id="desc_edit" value={data.description} onChange={e => setData('description', e.target.value)} />
                {errors.description && <p className="text-destructive mt-1 text-sm">{errors.description}</p>}
            </div>
            <div>
                <Label htmlFor="amount_edit">Amount</Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input id="amount_edit" type="number" step="0.01" value={data.amount} onChange={e => setData('amount', parseFloat(e.target.value) || 0)} className="pl-7" />
                </div>
                {errors.amount && <p className="text-destructive mt-1 text-sm">{errors.amount}</p>}
            </div>
            <div>
                <Label htmlFor="date_edit">Date</Label>
                <Input id="date_edit" type="date" value={data.date} onChange={e => setData('date', e.target.value)} />
                {errors.date && <p className="text-destructive mt-1 text-sm">{errors.date}</p>}
            </div>
            <div>
                <Label htmlFor="cat_edit">Category</Label>
                <Select value={data.category_id?.toString()} onValueChange={val => setData('category_id', Number(val))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(c => (
                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.category_id && <p className="text-destructive mt-1 text-sm">{errors.category_id}</p>}
            </div>
            <div>
                <Label htmlFor="method_edit">Method</Label>
                <Select value={data.method_id?.toString()} onValueChange={val => setData('method_id', Number(val))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                        {methods.map(m => (
                            <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.method_id && <p className="text-destructive mt-1 text-sm">{errors.method_id}</p>}
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="recurring_edit" checked={data.is_recurring} onCheckedChange={checked => setData('is_recurring', Boolean(checked))} />
                <Label htmlFor="recurring_edit">Recurring</Label>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={processing}>Save</Button>
            </div>
        </form>
    );
}
