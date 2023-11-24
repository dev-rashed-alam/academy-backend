const express = require('express')
const {findAllCounts, purchaseReportByWeek, purchaseReportByYear} = require('../controllers/dashboardController')

const router = express.Router()

router.get('/all-counts', findAllCounts)
router.get('/purchase/report/this-week', purchaseReportByWeek)
router.get('/purchase/report/this-year', purchaseReportByYear)

module.exports = router