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
        Schema::create('monthly_budgets', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('budget_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignId('category_id')
                ->constrained()
                ->onDelete('cascade');
            $table->year('year');
            $table->unsignedTinyInteger('month');
            $table->decimal('expected', 10, 2);
            $table->unique(['budget_id','category_id','year','month'],
                        'monthly_budget_unique_per_category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monthly_budget');
    }
};
