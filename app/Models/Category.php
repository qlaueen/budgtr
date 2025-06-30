<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'budget_id',
        'type',
    ];

    public function budget()
    {
        return $this->belongsTo(Budget::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

}
