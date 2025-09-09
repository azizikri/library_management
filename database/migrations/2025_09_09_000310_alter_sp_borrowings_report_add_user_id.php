<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::unprepared('DROP PROCEDURE IF EXISTS sp_borrowings_report');

        DB::unprepared(<<<'SQL'
        CREATE PROCEDURE sp_borrowings_report(
            IN p_start_date DATE,
            IN p_end_date DATE,
            IN p_user_id BIGINT
        )
        BEGIN
            SELECT 
                b.id,
                u.name AS user_name,
                k.title AS book_title,
                b.borrowed_date,
                b.return_date,
                b.days_borrowed,
                b.total_cost,
                b.status
            FROM borrowings b
            INNER JOIN users u ON u.id = b.user_id
            INNER JOIN books k ON k.id = b.book_id
            WHERE (p_start_date IS NULL OR b.borrowed_date >= p_start_date)
              AND (p_end_date IS NULL OR b.borrowed_date <= p_end_date)
              AND (p_user_id IS NULL OR b.user_id = p_user_id)
            ORDER BY b.borrowed_date DESC, b.id DESC;
        END
        SQL);
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::unprepared('DROP PROCEDURE IF EXISTS sp_borrowings_report');
    }
};

