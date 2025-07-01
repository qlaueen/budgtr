<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Budget;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $categories = Category::where('budget_id', $request->query('budget_id'))
            ->whereHas('budget', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->get();

        return Inertia::render('categories', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
        'name'      => 'required|string|max:255',
        'budget_id' => 'required|exists:budgets,id',
        'type'      => 'required|string|in:debt,expense,bill,savings,investment,income',
        ]);
        // dd($validated);
        $category = Category::create([
            'name' => $validated['name'],
            'budget_id' => $validated['budget_id'],
            'type' => $validated['type'],
        ]);

        Route::get('/budgets/{budget}/categories', [CategoryController::class,'index'])
            ->name('categories.index');

        return Redirect::route('dashboard', $category->budget_id)
        ->with('success', 'Category created successfully');
    }

    public function create(Budget $budget)
    {
        return Inertia::render('new-category', [
            'budget' => $budget,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = Category::where('id', $id)
            ->whereHas('budget', fn($q) => $q->where('user_id', Auth::id()))
            ->firstOrFail();

        return Inertia::render('category', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Budget $budget, Category $category)
    {
        $validated = $request->validate([
        'name' => 'required|string|max:255',
        'type' => 'required|in:income,expense,savings,investment,debt',
        ]);

        $category->update($validated);

        // Option A: go back to the same URL (/budgets/{budget}/setup)
        return Redirect::route('setup', $budget->id)
            ->with('success', 'Category updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::where('id', $id)
            ->whereHas('budget', fn($q) => $q->where('user_id', Auth::id()))
            ->firstOrFail();

        $category->delete();

        return Redirect::route('categories.index', ['budget_id' => $category->budget_id])
            ->with('success', 'Category deleted successfully');
    }
}