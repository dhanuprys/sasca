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
    pgm.createTable('counselor_classes', {
        id: 'id',
        grade_id: {
            type: 'varchar(10)',
            references: 'student_grades (id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        major_id: {
            type: 'varchar(20)',
            references: 'student_majors (id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        group_num: 'int2',
        counselor_id: {
            type: 'int4',
            references: 'counselors (id)',
            onDelete: 'CASCADE'
        }
    });

    pgm.createIndex('counselor_classes', 'grade_id');
    pgm.createIndex('counselor_classes', 'major_id');
    pgm.createIndex('counselor_classes', 'counselor_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('counselor_classes');
};
