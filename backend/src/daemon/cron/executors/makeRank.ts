import knexDB from "../../../utils/db";

async function makeRank() {
    return await knexDB.raw(`
        WITH rank_data AS (
            SELECT 
                student_id,
                (present * 2) +
                (present_late * 1) +
                (not_confirmed_absent * -1) +
                (permission_absent * 0) +  -- Neutral, no impact on points
                (sick * -1) +
                (check_in_only * 1) AS total_points,
                ROW_NUMBER() OVER (ORDER BY (present * 2) +
                                               (present_late * 1) +
                                               (not_confirmed_absent * -1) +
                                               (sick * -1) +
                                               (check_in_only * 1) DESC) AS rank
            FROM
                attendance_summary
        )
        INSERT INTO attendance_rank (student_id, total_points, rank, calculation_date, previous_rank, rank_change)
        SELECT 
            student_id,
            total_points,
            rank,
            NOW(),  -- or CURRENT_TIMESTAMP for current date and time
            LAG(rank) OVER (ORDER BY rank) AS previous_rank,
            rank - LAG(rank) OVER (ORDER BY rank) AS rank_change
        FROM 
            rank_data;
    `);
}

export default makeRank;