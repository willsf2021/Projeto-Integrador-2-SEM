<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrderPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->type === 'merchant';
    }

    public function view(User $user, Order $order)
    {
        return $user->id === $order->merchant_id;
    }

    public function create(User $user)
    {
        return $user->type === 'merchant';
    }

    public function update(User $user, Order $order)
    {
        return $user->id === $order->merchant_id;
    }

    public function delete(User $user, Order $order)
    {
        return $user->id === $order->merchant_id;
    }
}