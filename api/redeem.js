import { Pool } from 'pg';

const pool = new Pool({
  connectionString: "postgres://avnadmin:AVNS_41-sHsw6njShmw7KzAA@pg-1e3202b8-redee2.h.aivencloud.com:10414/defaultdb",
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { code, userId } = req.body;
    try {
      const promo = await pool.query(
        'SELECT * FROM promocodes WHERE UPPER(code) = UPPER($1) AND active = true AND uses < maxuses AND expires > NOW()',
        [code]
      );

      if (promo.rows.length === 0) {
        return res.json({ success: false, message: "Invalid or expired code" });
      }

      await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [promo.rows[0].pts, userId]);
      await pool.query('UPDATE promocodes SET uses = uses + 1 WHERE id = $1', [promo.rows[0].id]);

      res.json({ success: true, pts: promo.rows[0].pts });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  }
}
