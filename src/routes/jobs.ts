import { Router, Request, Response } from 'express'
import pool from '../config/pg'

const jobRouter = Router()

//get all job
jobRouter.get('/', async (req: Request, res: Response) => {
  try {
    const jobs = await pool.query('SELECT * FROM job')
    res.status(200).json(jobs.rows)
  } catch ({ message }) {
    res.status(500).json({ msg: message })
  }
})

//add new job
jobRouter.post('/add', async (req: Request, res: Response) => {
  try {
    const newJob = await pool.query(
      `
        INSERT INTO job (title) VALUES ($1) RETURNING *
      `,
      [req.body.title],
    )
    res.status(201).json(newJob.rows)
  } catch ({ message }) {
    res.status(500).json({ msg: message })
  }
})

//delete job
jobRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    await pool.query(`DELETE FROM employer WHERE job_id = $1`, [req.params.id])
    await pool.query(`DELETE FROM job WHERE id = $1`, [req.params.id])

    res.status(201).json({ msg: 'Deleted job' })
  } catch ({ message }) {
    res.status(500).json({ msg: message })
  }
})

export default jobRouter
