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
    pgm.createTable('face_samples', {
        id: 'id',
        student_id: {
            type: 'int4',
            references: 'students (id)',
            onDelete: 'CASCADE'
        },
        sample_path: {
            type: 'varchar(255)',
            notNull: true
        },
        accuration: 'float4'
    });

    pgm.createTable('attendances', {
        id: 'id',
        student_id: {
            type: 'int4',
            references: 'students (id)',
            onDelete: 'CASCADE'
        },
        check_in_time: 'time(6)',
        check_out_time: 'time(6)',
        check_in_coordinate: 'jsonb',
        check_out_coordinate: 'jsonb',
        date: 'date',
        status: 'varchar(30)'
    });

    pgm.createIndex('attendances', 'date');
    pgm.createIndex('attendances', 'student_id');

    pgm.createTable('school_day_schedule', {
        date: {
            type: 'date',
            primaryKey: true
        },
        checkin_start_time: 'time(6)',
        checkin_end_time: 'time(6)',
        checkout_start_time: 'time(6)',
        checkout_end_time: 'time(6)',
        holiday_reason: 'varchar(255)'
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('face_samples');
    pgm.dropTable('attendances');
    pgm.dropTable('school_day_schedule');
};
