<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MethodController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', fn() => Inertia::render('welcome'))->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Budget routes
    Route::get('/dashboard', [BudgetController::class, 'index'])
         ->name('dashboard');

    Route::get('/new-budget', fn() => Inertia::render('new-budget'))
         ->name('new-budget');

    Route::get('/budgets', [BudgetController::class, 'index'])
         ->name('budgets.index');
    Route::post('/budgets', [BudgetController::class, 'store'])
         ->name('budgets.store');
    Route::get('/budgets/{budget}', [BudgetController::class, 'show'])
         ->name('budgets.show');
    Route::put('/budgets/{budget}', [BudgetController::class, 'update'])
         ->name('budgets.update');
    Route::delete('/budgets/{budget}', [BudgetController::class, 'destroy'])
         ->name('budgets.destroy');

    // Category routes (nested under a budget)
    Route::get('/budgets/{budget}/categories', [CategoryController::class, 'index'])
         ->name('categories.index');
    Route::get(
        '/budgets/{budget}/categories/create',
        [CategoryController::class, 'create']
    )->name('categories.create');
    Route::post(
        '/budgets/{budget}/categories',
        [CategoryController::class, 'store']
    )->name('categories.store');
    Route::delete(
        '/budgets/{budget}/categories/{category}',
        [CategoryController::class, 'destroy']
    )->name('categories.destroy');
    Route::put(
        '/budgets/{budget}/categories/{category}',
        [CategoryController::class, 'update']
    )->name('categories.update');

    // Set up routes
    Route::get(
        '/budgets/{budget}/setup',
        [BudgetController::class, 'setup']
    )->name('setup');

    // Methods routes (nested under a budget)
    Route::resource('methods', MethodController::class)
     ->only(['index','create','store','show','update','destroy']);
    Route::delete(
        '/budgets/{budget}/methods/{method}',
        [MethodController::class, 'destroy']
    )->name('methods.destroy');
    Route::get(
        '/budgets/{budget}/methods/create',
        [MethodController::class, 'create']
    )->name('methods.create');
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
