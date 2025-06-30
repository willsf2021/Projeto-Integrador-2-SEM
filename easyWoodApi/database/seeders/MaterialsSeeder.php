<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Material;

class MaterialsSeeder extends Seeder
{
    public function run()
    {
        $merchants = User::where('type', 'merchant')->get();

        foreach ($merchants as $merchant) {
            Material::create([
                'merchant_id' => $merchant->id,
                'name' => 'Tábua de Madeira 2m',
                'description' => 'Tábua de pinus 2m x 30cm',
                'price' => 35.90,
                'quantity' => 50,
                'unit' => 'un'
            ]);

            Material::create([
                'merchant_id' => $merchant->id,
                'name' => 'Parafuso 4mm',
                'description' => 'Parafuso de aço inoxidável',
                'price' => 0.25,
                'quantity' => 1000,
                'unit' => 'un'
            ]);

            Material::create([
                'merchant_id' => $merchant->id,
                'name' => 'Verniz Marrom',
                'description' => 'Verniz para madeira',
                'price' => 42.50,
                'quantity' => 20,
                'unit' => 'L'
            ]);
        }
    }
}