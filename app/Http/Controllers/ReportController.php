<?php

namespace App\Http\Controllers;

use App\Exports\BorrowingsExport;
use App\Exports\BorrowingsProcedureExport;
use App\Models\Borrowing;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Contracts\Pagination\LengthAwarePaginator as LengthAwarePaginatorContract;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['start_date', 'end_date', 'user_id']);
        $user = $request->user();

        if (($user->role ?? 'user') === 'user') {
            $borrowings = Borrowing::with(['book', 'user'])
                ->where('user_id', $user->id)
                ->when($filters['start_date'] ?? null, fn ($q, $d) => $q->whereDate('borrowed_date', '>=', $d))
                ->when($filters['end_date'] ?? null, fn ($q, $d) => $q->whereDate('borrowed_date', '<=', $d))
                ->orderByDesc('borrowed_date')
                ->paginate(10)
                ->withQueryString();
        } else {
            $borrowings = $this->getBorrowingsReport($filters);
        }

        return Inertia::render('reports/index', [
            'borrowings' => $borrowings,
            'filters' => $filters,
            'users' => ($user->role ?? 'user') === 'admin' ? \App\Models\User::where('role', 'user')->orderBy('name')->get(['id', 'name']) : [],
        ]);
    }

    protected function getBorrowingsReport(array $filters): LengthAwarePaginatorContract
    {
        $perPage = 10;
        $page = LengthAwarePaginator::resolveCurrentPage();

        if (DB::getDriverName() === 'mysql') {
            $raw = collect(DB::select('CALL sp_borrowings_report(?, ?, ?)', [
                $filters['start_date'] ?? null,
                $filters['end_date'] ?? null,
                $filters['user_id'] ?? null,
            ]));

            $rows = $raw->map(function ($r) {
                return (object) [
                    'id' => $r->id,
                    'user' => (object) ['name' => $r->user_name],
                    'book' => (object) ['title' => $r->book_title],
                    'borrowed_date' => $r->borrowed_date,
                    'return_date' => $r->return_date,
                    'days_borrowed' => $r->days_borrowed,
                    'total_cost' => $r->total_cost,
                    'status' => $r->status,
                ];
            });

            $slice = $rows->forPage($page, $perPage)->values();

            return new LengthAwarePaginator(
                $slice,
                $rows->count(),
                $perPage,
                $page,
                ['path' => request()->url(), 'query' => request()->query()]
            );
        }

        $query = Borrowing::with(['book', 'user'])
            ->when(! empty($filters['user_id']), fn ($q) => $q->where('user_id', (int) $filters['user_id']))
            ->when($filters['start_date'] ?? null, fn ($q, $d) => $q->whereDate('borrowed_date', '>=', $d))
            ->when($filters['end_date'] ?? null, fn ($q, $d) => $q->whereDate('borrowed_date', '<=', $d))
            ->orderByDesc('borrowed_date');

        return $query->paginate($perPage)->withQueryString();
    }

    public function export(Request $request, string $type)
    {
        $filters = $request->only(['start_date', 'end_date']);
        $user = $request->user();

        if ($type === 'excel') {
            if (($user->role ?? 'user') === 'user') {
                return Excel::download(new BorrowingsExport($filters + ['user_id' => $user->id]), 'borrowings-report.xlsx');
            }
            if (DB::getDriverName() === 'mysql') {
                $rows = collect(DB::select('CALL sp_borrowings_report(?, ?, ?)', [
                    $filters['start_date'] ?? null,
                    $filters['end_date'] ?? null,
                    $filters['user_id'] ?? null,
                ]));

                return Excel::download(new BorrowingsProcedureExport($rows), 'borrowings-report.xlsx');
            }

            return Excel::download(new BorrowingsExport($filters), 'borrowings-report.xlsx');
        }

        if ($type === 'pdf') {
            if (($user->role ?? 'user') === 'user') {
                $borrowings = Borrowing::with(['book', 'user'])
                    ->where('user_id', $user->id)
                    ->when($filters['start_date'] ?? null, fn ($q, $d) => $q->whereDate('borrowed_date', '>=', $d))
                    ->when($filters['end_date'] ?? null, fn ($q, $d) => $q->whereDate('borrowed_date', '<=', $d))
                    ->orderByDesc('borrowed_date')
                    ->get();
            } elseif (DB::getDriverName() === 'mysql') {
                $borrowings = collect(DB::select('CALL sp_borrowings_report(?, ?, ?)', [
                    $filters['start_date'] ?? null,
                    $filters['end_date'] ?? null,
                    $filters['user_id'] ?? null,
                ]))->map(function ($r) {
                    return (object) [
                        'id' => $r->id,
                        'user' => (object) ['name' => $r->user_name],
                        'book' => (object) ['title' => $r->book_title],
                        'borrowed_date' => $r->borrowed_date,
                        'return_date' => $r->return_date,
                        'days_borrowed' => $r->days_borrowed,
                        'total_cost' => $r->total_cost,
                        'status' => $r->status,
                    ];
                });
            } else {
                $borrowings = Borrowing::with(['book', 'user'])
                    ->when($filters['start_date'] ?? null, fn ($q, $d) => $q->whereDate('borrowed_date', '>=', $d))
                    ->when($filters['end_date'] ?? null, fn ($q, $d) => $q->whereDate('borrowed_date', '<=', $d))
                    ->orderByDesc('borrowed_date')
                    ->get();
            }

            $html = view('reports.borrowings-pdf', ['borrowings' => $borrowings])->render();

            $options = new Options();
            $options->set('isRemoteEnabled', true);
            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            return response($dompdf->output(), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="borrowings-report.pdf"',
            ]);
        }

        abort(404);
    }
}
