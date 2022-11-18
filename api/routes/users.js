const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { authCtrl } = require("../controllers/authControll");
const { userCtrl } = require("../controllers/userControll");
const router = express.Router();

router.post("/", authCtrl.signUp)
router.post("/login", authCtrl.login)
router.get("/verify/:userId/:uniqueString",authCtrl.verifyUser)
router.get("/verified",authCtrl.verifiedUser)
router.get("/myInfo", auth, userCtrl.myInfo)
router.delete("/:delId", auth, userCtrl.deleteUser)
router.patch("/changeRole/:editId", authAdmin, userCtrl.editUser)
router.get("/usersList", authAdmin, userCtrl.userList)
module.exports = router;
