<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query()->where('role', 'user');

        if ($search = trim((string) $request->get('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('users/index', [
            'users' => $query->orderBy('name')->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('users/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $data['password'] = bcrypt($data['password']);
        $data['role'] = 'user';

        User::create($data);

        return redirect()->route('users.index')->with('success', 'User created');
    }

    public function edit(User $user): Response
    {
        if ($user->role !== 'user') {
            abort(403);
        }
        return Inertia::render('users/edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        if ($user->role !== 'user') {
            abort(403);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        // Always enforce user role
        $data['role'] = 'user';

        $user->update($data);

        return redirect()->route('users.index')->with('success', 'User updated');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->id === $user->id) {
            return back()->withErrors(['user' => 'You cannot delete your own account.']);
        }
        if ($user->role !== 'user') {
            return back()->withErrors(['user' => 'You cannot delete admin accounts.']);
        }
        $user->delete();
        return back()->with('success', 'User deleted');
    }
}
