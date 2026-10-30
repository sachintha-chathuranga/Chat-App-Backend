import express from "express";
import { updateValidation } from "../middleware/validation";
import { deleteUser, getFriends, getRecentFriends, getUser, searhFriends, updateUser } from "../controllers/users";

const router = express.Router();

//if request comming to this end point these function will execute
router.route('/recentFriends').get(getRecentFriends);
router.route('/friends').get(getFriends);
router.route('/search').post(searhFriends);
router.route('/').put(updateValidation, updateUser).delete(deleteUser);
router.route('/:id').get(getUser);

export default router;
