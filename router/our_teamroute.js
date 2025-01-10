const express=require('express');
const router=express.Router();
const our_teamcontroller=require('../controller/our_teamcontroller');
const auth = require('../middleware/auth');

router.post('/our_team', our_teamcontroller.createTeamMember); // Create a new album
router.put('/our_team/:our_team_id', our_teamcontroller.updateTeamMember);
router.get('/our_team', our_teamcontroller.listTeamMembers);
router.delete('/our_team/:our_team_id', our_teamcontroller.softDeleteTeamMember);

module.exports=router;