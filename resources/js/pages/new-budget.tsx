import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { FormEventHandler } from 'react';

type NewBudgetForm = {
    name: string;
};

export default function NewBudget() {
    const { data, setData, post, reset } = useForm<Required<NewBudgetForm>>({
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('budgets.store'), {
            onFinish: () => reset('name'),
        });
    };
    return (
        <AppLayout>
            <Head title="New Budget" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium">Budget Name</label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            type="text"
                            placeholder="Enter your budget name"
                            className="w-full"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            tabIndex={1}
                        />
                    </div>
                    <Button type="submit" className="default" tabIndex={4}>
                        Create Budget
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
