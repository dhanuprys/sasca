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
    pgm.createTable('student_majors', {
        id: {
            type: 'varchar(20)',
            primaryKey: true
        },
        long_name: {
            type: 'varchar(100)',
            notNull: true
        }
    });

    pgm.createTable('student_grades', {
        id: {
            type: 'varchar(10)',
            primaryKey: true
        },
        long_name: {
            type: 'varchar(50)',
            notNull: true
        }
    });

    pgm.createTable('counselors', {
        id: 'id',
        avatar_path: 'varchar(100)',
        nip: {
            type: 'varchar(20)'
        },
        name: {
            type: 'varchar(255)',
            notNull: true
        },
        gender: 'char(1)',
        group_num: 'int2',
        contact: 'varchar(25)'
    });

    pgm.createIndex('counselors', 'name');

    pgm.createTable('students', {
        id: 'id',
        avatar_path: 'varchar(100)',
        nisn: {
            type: 'varchar(10)',
            notNull: true
        },
        nis: {
            type: 'varchar(5)',
            notNull: true
        },
        name: {
            type: 'varchar(255)',
            notNull: true
        },
        gender: 'char(1)',
        grade_id: {
            type: 'varchar(10)',
            references: 'student_grades (id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        },
        major_id: {
            type: 'varchar(20)',
            references: 'student_majors (id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        },
        group_num: 'int2',
        counselor_id: {
            type: 'int4',
            references: 'counselors (id)',
            onDelete: 'SET NULL'
        },
        contact: 'varchar(25)',
        contact_parent: 'varchar(25)'
    });

    pgm.addIndex('students', 'name');

    pgm.createTable('accounts', {
        id: 'id',
        entity_id: 'int4',
        role: 'varchar(20)',
        username: {
            type: 'varchar(255)',
            notNull: true
        },
        password: {
            type: 'varchar(255)',
            notNull: true
        }
    });

    pgm.createIndex('accounts', 'username');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('student_majors', { cascade: true });
    pgm.dropTable('student_grades', { cascade: true });
    pgm.dropTable('students', { cascade: true });
};
