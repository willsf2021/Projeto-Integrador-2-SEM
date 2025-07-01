<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Material extends Model
{
    protected $fillable = [
        'name',
        'description',
        'minimum_quantity',
        'price',
        'quantity',
        'unit',
        'merchant_id'
    ];

    public function merchant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'merchant_id');
    }
    public function lowStockAlerts()
    {
        return $this->hasMany(LowStockAlert::class);
    }
}
