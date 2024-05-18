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
    pgm.createTable('last_attendance_checking_date', {
        last_check_date: { 
            type: 'date', 
            notNull: true 
        },
        run_on: {
            type: 'datetime',
            default: pgm.func('now()')
        }
    });

    pgm.createIndex('last_attendance_checking_date', 'last_check_date');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('last_attendance_checking_date');
};
