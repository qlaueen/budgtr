<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Budget;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Budget $budget)
    {
        // make sure this budget belongs to the user
        abort_unless($budget->user_id === Auth::id(), 403);

        // eager-load relationships so you don’t N+1
        $budget->load(['categories', 'methods', 'expenses.category', 'expenses.method']);

        return Inertia::render('expenses', [
            'budget'     => $budget,
            'categories' => $budget->categories,
            'methods'    => $budget->methods,
            'expenses'   => $budget->expenses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Budget $budget)
    {
        // 1) Ensure the user owns this budget
        abort_unless($budget->user_id === Auth::id(), 403);

        // 2) Validate exactly the fields your form sends
        $validated = $request->validate([
            'description'  => 'required|string|max:255',
            'amount'       => 'required|numeric',
            'date'         => 'required|date',
            'category_id'  => 'required|exists:categories,id',
            'method_id'    => 'required|exists:methods,id',
            'is_recurring' => 'sometimes|boolean',
        ]);

        // 3) Create via the budget relationship so budget_id is set automatically
        $budget->expenses()->create($validated);

        // 4) Redirect back with a flash message
        return Redirect::route('expenses.index', $budget->id)
                    ->with('success', 'Expense added!');
    }

    public function create(Budget $budget)
    {
        return Inertia::render('new-expense', [
            'budget' => $budget,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $expense = Expense::where('id', $id)
            ->whereHas('budget', fn($q) => $q->where('user_id', Auth::id()))
            ->firstOrFail();

        return Inertia::render('expense', [
            'expense' => $expense,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Budget $budget, Expense $expense)
    {
        abort_unless($budget->user_id === Auth::id(), 403);

        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount'      => 'required|numeric',
            'date'        => 'required|date',
            'category_id' => 'required|exists:categories,id',
            'method_id'   => 'required|exists:methods,id',
            'is_recurring'=> 'sometimes|boolean',
        ]);

        $expense->update($validated);

        return Redirect::route('expenses.index', $budget->id)
                    ->with('success', 'Expense updated!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Budget $budget, Expense $expense)
    {
        $expense->delete();

        return Redirect::route('expenses.index', $budget->id)
                   ->with('success', 'Expense deleted.');
    }
}