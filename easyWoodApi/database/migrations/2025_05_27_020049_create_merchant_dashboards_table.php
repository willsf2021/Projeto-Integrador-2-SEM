<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('merchant_dashboards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('merchant_id')->constrained('users');
            $table->json('widget_settings');
            $table->json('financial_summary')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('merchant_dashboards');
    }
};