<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Budget;
use Illuminate\Support\Facades\DB;

class MonthlyController extends Controller
{
    public function index(Budget $budget)
    {
        // eager-load so $budget->categories etc. won't lazy-N+1
        $budget->load(['categories', 'methods', 'expenses']);

        $now = Carbon::now();

        // actual spent per category
        $totals = DB::table('expenses')
            ->select('category_id', DB::raw('SUM(amount) as spent'))
            ->where('budget_id', $budget->id)
            ->whereYear('date',  $now->year)
            ->whereMonth('date', $now->month)
            ->groupBy('category_id')
            ->get();

        // budgeted (expected) per category
        $expected = DB::table('monthly_budgets')
            ->where('budget_id', $budget->id)
            ->where('year',  $now->year)
            ->where('month', $now->month)
            ->pluck('expected', 'category_id');

        return Inertia::render('monthly', [
            'budget'     => $budget,
            'categories' => $budget->categories,
            'methods'    => $budget->methods,
            'expenses'   => $budget->expenses,
            'totals'     => $totals,     // renamed from monthly_budgets
            'expected'   => $expected,
        ]);
    }
}
