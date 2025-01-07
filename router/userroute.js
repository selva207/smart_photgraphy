const express=require('express');
const router=express.Router();
const userController=require('../controller/usercontroller');
const auth = require('../middleware/auth');
router.post("/createuser",userController.createUser);
// router.put('/updateuser',userCont    roller.updateUser);
// router.get('/getalluser',auth,userController.listUsers);
// router.get("/:id/getuserbyid",auth,userController.findUserById);
// router.delete('/:id/deleteuser',auth, userController.deleteUser);

module.exports=router;