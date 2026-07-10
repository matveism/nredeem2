import { Pool } from 'pg';

const pool = new Pool({
  connectionString: "postgres://avnadmin:AVNS_41-sHsw6njShmw7KzAA@pg-1e3202b8-redee2.h.aivencloud.com:10414/defaultdb",
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    try {
      const result = await pool.query(
        'SELECT id, username, onhold, balance FROM users WHERE username = $1 AND password = $2',
        [username, password]
      );
      if (result.rows.length > 0) {
        res.status(200).json({ success: true, user: result.rows[0] });
      } else {
        res.status(200).json({ success: false, message: "Invalid username or password" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}
