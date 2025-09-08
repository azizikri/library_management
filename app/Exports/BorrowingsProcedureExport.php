<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BorrowingsProcedureExport implements FromCollection, WithHeadings, WithMapping
{
    public string $fileName = 'borrowings-report.xlsx';

    /** @var Collection<int, object> */
    protected Collection $rows;

    /**
     * @param Collection<int, object> $rows
     */
    public function __construct(Collection $rows)
    {
        $this->rows = $rows;
    }

    public function collection(): Collection
    {
        return $this->rows;
    }

    public function headings(): array
    {
        return ['User', 'Book', 'Borrowed', 'Return', 'Days', 'Total', 'Status'];
    }

    public function map($row): array
    {
        return [
            $row->user_name ?? '',
            $row->book_title ?? '',
            $row->borrowed_date ?? '',
            $row->return_date ?? '',
            $row->days_borrowed ?? 0,
            $row->total_cost ?? 0,
            $row->status ?? '',
        ];
    }
}
