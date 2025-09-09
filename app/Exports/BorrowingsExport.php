<?php

namespace App\Exports;

use App\Models\Borrowing;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BorrowingsExport implements FromQuery, WithHeadings, WithMapping
{
    public string $fileName = 'borrowings-report.xlsx';

    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $q = Borrowing::query()->with(['user', 'book']);

        if (! empty($this->filters['user_id'])) {
            $q->where('user_id', (int) $this->filters['user_id']);
        }

        if (! empty($this->filters['start_date'])) {
            $q->whereDate('borrowed_date', '>=', $this->filters['start_date']);
        }
        if (! empty($this->filters['end_date'])) {
            $q->whereDate('borrowed_date', '<=', $this->filters['end_date']);
        }

        return $q->orderByDesc('borrowed_date');
    }

    public function headings(): array
    {
        return ['User', 'Book', 'Borrowed', 'Return', 'Days', 'Total', 'Status'];
    }

    public function map($row): array
    {
        return [
            $row->user?->name,
            $row->book?->title,
            $row->borrowed_date,
            $row->return_date,
            $row->days_borrowed,
            $row->total_cost,
            $row->status,
        ];
    }
}
