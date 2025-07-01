<?php

namespace App\Http\Controllers;

use App\Models\Method;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Budget;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class MethodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $methods = Method::where('budget_id', $request->query('budget_id'))
            ->whereHas('budget', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->get();

        return Inertia::render('methods', [
            'methods' => $methods,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       $validated = $request->validate([
            'name' => 'required|string|max:255',
            'budget_id' => 'required|exists:budgets,id',
            'is_active' => 'required|bool',
            'is_credit_card' => 'required|bool'
        ]);

        $method = Method::create([
            'name' => $validated['name'],
            'budget_id' => $validated['budget_id'],
            'is_active' => $validated['is_active'],
            'is_credit_card' => $validated['is_credit_card']
        ]);


        return Redirect::route('setup', $method->budget_id)
            ->with('success', 'Method created successfully');
    }

    public function create(Budget $budget)
    {
        return Inertia::render('new-method', [
            'budget' => $budget,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $method = Method::where('id', $id)
            ->whereHas('budget', fn($q) => $q->where('user_id', Auth::id()))
            ->firstOrFail();

        return Inertia::render('method', [
            'method' => $method,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Method $method)
    {
        // no need to re-validate budget_id here
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'is_active'      => 'required|boolean',
            'is_credit_card' => 'required|boolean',
        ]);

        $method->update($validated);

        // just go back (Inertia will intercept and merge the flash)
        return back()->with('success', 'Method updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Budget $budget, Method $method)
    {
        $method->delete();

        return Redirect::route('setup', $budget->id)
                   ->with('success', 'Method deleted.');
    }
}