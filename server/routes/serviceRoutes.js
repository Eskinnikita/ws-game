const express = require('express')
const router = express.Router()

router.get('/healthcheck', async (req, res) => {
  try {
    res.status(200).json({message: 'OK'})
  } catch (e) {
    res.status(500).send({'message': e.message})
  }
})

module.exports = router