//const { response } = require('express');
const express=require('express');
const router=express.Router()
//const adminAuth=require('../authorization/auth')
const itemControlles=require('../controller/lostAndFoundItem')


router.post("/lostItem",itemControlles.addLostItems)
router.post("/foundItem",itemControlles.addFoundItems)
router.patch("/lostClaim/:uIdentifer",itemControlles.claimLostOrFoundItems)
