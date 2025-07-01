import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type Props = {
  budget: { id: number; name: string };
};

type Form = {
  name: string;
  budget_id: number;
  is_active: boolean;
  is_credit_card: boolean;
};

export default function NewMethod({ budget }: Props) {
  const { data, setData, post, reset } = useForm<Form>({
    name: '',
    is_active: true,
    is_credit_card: false,
    budget_id: budget.id,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('methods.store', budget.id), {
      onFinish: () => reset('name'),
    });
  };

  return (
    <AppLayout>
      <Head title={`New method – ${budget.name}`} />
        <div className="flex h-full flex-1 flex-col rounded-xl p-4 overflow-x-auto">
            <form onSubmit={submit} className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium">Method Name</label>
                    <Input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Enter method name"
                        required
                    />
                    <div className="flex py-2 space-x-5">
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="is_active"
                                name="is_active"
                                checked={data.is_active}
                                onClick={() => setData('is_active', !data.is_active)}
                            />
                            <Label htmlFor="is_active">Is Active</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="is_credit_card"
                                name="is_credit_card"
                                checked={data.is_credit_card}
                                onClick={() => setData('is_credit_card', !data.is_credit_card)}
                            />
                            <Label htmlFor="is_credit_card">Credit Card</Label>
                        </div>
                    </div>

                </div>

                <Button type="submit">Create Method</Button>
            </form>
        </div>
    </AppLayout>
  );
}
