<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     * If the user is already authenticated, redirect based on role.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ?string $guard = null)
    {
        $guard = $guard ?: 'web';

        if (Auth::guard($guard)->check()) {
            $user = Auth::guard($guard)->user();

            if (($user->role ?? 'user') === 'admin') {
                return redirect()->route('dashboard');
            }

            return redirect()->route('borrowings.index');
        }

        return $next($request);
    }
}

