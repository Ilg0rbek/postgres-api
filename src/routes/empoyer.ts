import { Router, Request, Response } from 'express'
import pool from '../config/pg'

const emlpoyRouter = Router()

//get all employer
emlpoyRouter.get('/', async (req: Request, res: Response) => {
  try {
    const employers = await pool.query('SELECT * FROM employer')
    res.status(200).json(employers.rows)
  } catch ({ message }) {
    res.status(500).json({ msg: message })
  }
})

//Add new employer
emlpoyRouter.post('/add', async (req: Request, res: Response) => {
  try {
    const { name, salary, degree, job_id } = req.body
    const newEmployer = await pool.query(
      `
        INSERT INTO employer (name, degree, salary, job_id) VALUES ($1, $2, $3,$4) RETURNING *
      `,
      [name, degree, salary, job_id],
    )
    res.status(201).json(newEmployer.rows[0])
  } catch ({ message }) {
    res.status(500).json({ msg: message })
  }
})

//Update employer
emlpoyRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, degree, salary, job_id } = req.body

    const oldEmployer = await pool.query(
      `
       SELECT * FROM employer WHERE id=$1
    `,
      [id],
    )

    const updatedEmployer = await pool.query(
      `
       UPDATE employer SET name=$1, degree=$2,  salary=$3,  job_id=$4
       WHERE id=$5  RETURNING *  
      `,
      [
        name ? name : oldEmployer.rows[0].name,
        degree ? degree : oldEmployer.rows[0].degree,
        salary ? salary : oldEmployer.rows[0].salary,
        job_id ? job_id : oldEmployer.rows[0].job_id,
        id,
      ],
    )
    res.status(201).json(updatedEmployer.rows[0])
  } catch ({ message }) {
    res.status(500).json({ msg: message })
  }
})

//Delete Employer
emlpoyRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await pool.query(`DELETE FROM employer WHERE id=$1`, [id])
    res.status(200).json({ msg: 'Deleted employer' })
  } catch ({ message }) {
    res.status(500).json({ msg: message })
  }
})

//get employer by id
emlpoyRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const employer = await pool.query(
      `
         SELECT * FROM employer LEFT JOIN job ON job.id = employer.job_id WHERE employer.id = $1
       `,
      [req.params.id],
    )
    res.status(200).json(employer.rows[0])
  } catch ({ message }) {
    res.status(500).json({ msg: message })
  }
})

export default emlpoyRouter
