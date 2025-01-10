const express=require('express');
const router=express.Router();
const userController=require('../controller/usercontroller');
const auth = require('../middleware/auth');
router.post("/createuser",userController.createUser);
router.put('/updateuser/:user_id',auth,userController.updateUser);
router.get('/getalluser',auth,userController.getUsers);
// router.get("/:id/getuserbyid",auth,userController.findUserById);
router.delete('/deleteuser/:user_id',auth, userController.deleteUser);

module.exports=router;