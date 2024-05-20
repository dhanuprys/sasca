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
    pgm.createTable('student_feedbacks', {
        id: 'id',
        student_id: {
            type: 'integer',
            notNull: true,
            references: 'Students (id)',
            onDelete: 'CASCADE',
        },
        stars: {
            type: 'integer',
            notNull: true,
            check: 'stars >= 1 AND stars <= 5',
        },
        message: {
            type: 'text',
            notNull: false,
        },
        datetime: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        coordinate: {
            type: 'jsonb',
            notNull: false,
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('student_feedbacks');
};
