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
    pgm.createTable('attendance_rank', {
        student_id: {
            type: 'int4',
            references: 'students (id)',
            onDelete: 'CASCADE'
        },
        total_points: {
            type: 'integer'
        },
        rank: {
            type: 'integer'
        },
        previous_rank: {
            type: 'integer'
        },
        rank_change: {
            type: 'integer'
        },
        calculation_date: {
            type: 'timestamp',
            default: pgm.func('current_timestamp')
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('attendance_rank');
};
