<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class BudgetController extends Controller
{
    /**
     * Display a listing of the user's budgets.
     */
    public function index()
    {

        $budgets = Budget::where('user_id', Auth::id())->get();

        return Inertia::render('dashboard', [
            'budgets' => $budgets,
        ]);
    }
    /**
     * Store a newly created budget.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'=> 'required|string|max:255',
        ]);

        $budget = Budget::create([
            'name' => $validated['name'],
            'user_id' => Auth::id(),
        ]);

        return Redirect::route('dashboard', ['budget' => $budget->id])
            ->with('success', 'Budget created successfully');
    }

    /**
     * Display the specified budget if user owns it.
     */
    public function show(string $id)
    {
        $budget = Budget::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('budget', [
            'budget' => $budget,
        ]);
    }

    /**
     * Update the specified budget.
     */
    public function update(Request $request, string $id)
    {
        $budget = Budget::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $budget->update($validated);

        return response()->json($budget);
    }

    /**
     * Remove the specified budget.
     */
    public function destroy(string $id)
    {
        $budget = Budget::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $budget->delete();

        return response()->json(['message' => 'Budget deleted successfully'], 204);
    }

    /**
     * Show the "Set up" page for a given budget.
     */
    public function setup(Budget $budget)
    {
        $categories = $budget->categories()->orderBy('name')->get();
        $methods = $budget->methods()->orderBy('name')->get();

        return Inertia::render('setup', [
            'budget'     => $budget,
            'categories' => $categories,
            'methods'    => $methods,
        ]);
    }
}
