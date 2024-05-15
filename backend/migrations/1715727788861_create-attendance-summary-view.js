/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createView('attendance_summary', {}, `
        SELECT
            students.id as student_id,
            SUM ( CASE WHEN status = 'present' THEN 1 ELSE 0 END ) AS present,
            SUM ( CASE WHEN status = 'present_late' THEN 1 ELSE 0 END ) AS present_late,
            SUM ( CASE WHEN status = 'not_confirmed_absent' THEN 1 ELSE 0 END ) AS not_confirmed_absent,
            SUM ( CASE WHEN status = 'sick' THEN 1 ELSE 0 END ) AS sick,
            SUM ( CASE WHEN status = 'permission_absent' THEN 1 ELSE 0 END ) AS permission_absent,
            SUM ( CASE WHEN status = 'check_in_only' THEN 1 ELSE 0 END ) AS check_in_only 
        FROM
            students
        LEFT JOIN attendances ON attendances.student_id = students.id
        GROUP BY students.id
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropView('attendance_summary');
};
