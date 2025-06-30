import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type Props = {
  budget: { id: number; name: string };
};

type Form = {
  name: string;
  type: 'income' | 'expense' | 'savings' | 'investment' | 'debt';
  budget_id: number;
};

export default function NewCategory({ budget }: Props) {
  const { data, setData, post, reset } = useForm<Form>({
    name: '',
    type: 'income',
    budget_id: budget.id,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('categories.store', budget.id), {
      onFinish: () => reset('name'),
    });
  };

  return (
    <AppLayout>
      <Head title={`New Category – ${budget.name}`} />
        <div className="flex h-full flex-1 flex-col rounded-xl p-4 overflow-x-auto">
            <form onSubmit={submit} className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium">Type</label>
                    <Select
                        value={data.type}
                        onValueChange={(val) => setData('type', val as Form['type'])}
                        required
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type…" />
                        </SelectTrigger>
                        <SelectContent>
                            {['income','expense','savings','investment','debt'].map((t) => (
                                <SelectItem key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium">Category Name</label>
                    <Input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Enter category name"
                        required
                    />
                </div>
                <Button type="submit">Create Category</Button>
            </form>
        </div>
    </AppLayout>
  );
}
