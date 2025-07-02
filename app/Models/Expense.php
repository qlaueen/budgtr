<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'budget_id',
        'category_id',
        'method_id',
        'description',
        'amount',
        'date',
        'is_recurring'
    ];

    public function method() {
        return $this->belongsTo(Method::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function budget() {
        return $this->belongsTo(Budget::class);
    }
}
