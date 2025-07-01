<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LowStockAlert extends Model
{
    protected $fillable = ['material_id', 'triggered_at', 'resolved'];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}
