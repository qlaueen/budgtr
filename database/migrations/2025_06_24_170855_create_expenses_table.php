<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('budget_id')
                  ->constrained('budgets')
                  ->onDelete('cascade');
            $table->foreignId('category_id')
                    ->constrained('categories')
                    ->onDelete('cascade');
            $table->foreignId('method_id')
                    ->constrained('methods')
                    ->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->date('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
