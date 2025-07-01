<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Method extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'budget_id',
        'is_active',
        'is_credit_card'
    ];

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function budget()
    {
        return $this->belongsTo(Budget::class);
    }
}
