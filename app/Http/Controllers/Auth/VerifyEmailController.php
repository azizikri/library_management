<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            $role = $request->user()->role ?? 'user';
            $base = $role === 'admin' ? route('dashboard', absolute: false) : route('borrowings.index', absolute: false);
            return redirect()->intended($base.'?verified=1');
        }

        $request->fulfill();

        $role = $request->user()->role ?? 'user';
        $base = $role === 'admin' ? route('dashboard', absolute: false) : route('borrowings.index', absolute: false);
        return redirect()->intended($base.'?verified=1');
    }
}
