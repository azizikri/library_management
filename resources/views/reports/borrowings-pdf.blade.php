<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>Borrowings Report</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #ccc;
            padding: 6px;
            text-align: left;
        }

        th {
            background: #f0f0f0;
        }

        h1 {
            font-size: 18px;
        }
    </style>
</head>

<body>
    <h1>Borrowings Report</h1>
    <table>
        <thead>
            <tr>
                <th>User</th>
                <th>Book</th>
                <th>Borrowed</th>
                <th>Return</th>
                <th>Days</th>
                <th>Total</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($borrowings as $r)
                <tr>
                    <td>{{ $r->user?->name }}</td>
                    <td>{{ $r->book?->title }}</td>
                    <td>{{ $r->borrowed_date }}</td>
                    <td>{{ $r->return_date }}</td>
                    <td>{{ $r->days_borrowed }}</td>
                    <td>
                        <?php
                        $amount = is_object($r) ? $r->total_cost ?? 0 : (is_array($r) ? $r['total_cost'] ?? 0 : 0);
                        echo 'Rp ' . number_format((float) $amount, 0, ',', '.');
                        ?>
                    </td>
                    <td>{{ $r->status }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
