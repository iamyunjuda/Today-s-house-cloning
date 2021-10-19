const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const shopProvider = require("./shopProvider");
const shopDao = require("./shopDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.retrievePostReview = async function (userId,itemId, durability, design,price,delivery, photo,content) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const para = [userId,itemId, content,photo];
        var avg= (durability+design+price+delivery)/4.0;
        const para2= [userId, itemId, durability, design,price,delivery,avg];

      await connection.beginTransaction();

        const postReview = await shopDao.postReview(connection, para);
        const postReviewRate = await shopDao.postReviewRate(connection, para2);

        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
