const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const shopDao = require("./shopDao");
const {errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

// Provider: Read 비즈니스 로직 처리
exports.retrieveAllItemsList = async function (menuId) {

    const connection = await pool.getConnection(async (conn) => conn);
    const furnitureListResult = await shopDao.selectAllItems(connection);
    connection.release();

    return furnitureListResult;

};
exports.retrieveMenuItemsList = async function (menuId) {

    const connection = await pool.getConnection(async (conn) => conn);
    const furnitureListResult = await shopDao.selectMenuItems(connection,menuId);
    connection.release();

    return furnitureListResult;

};

exports.retrieveFilteredFurnitureItemsList = async function (numOfPeople, material, used, color) {


    if(numOfPeople==null) numOfPeople = '%';

    if(material==null) material = '%';
    //console.log(material);
    if(used==null) used = '%';
    //console.log(used);
    if(color==null) color = '%';
    // console.log(color);
    const params= [numOfPeople, material, used, color]
    const connection = await pool.getConnection(async (conn) => conn);
    const furnitureListResult = await shopDao.selectFilteredFurniture(connection,params);
    connection.release();
    return furnitureListResult;

};

exports.retrieveFilteredFabricItemsList = async function (menuId,  season, color,pattern) {

    if(season==null) season = '%';
    if(color==null) color = '%';
    if(pattern==null) pattern = '%';


    const params= [color,season, pattern]
    const connection = await pool.getConnection(async (conn) => conn);
    const furnitureListResult = await shopDao.selectFilteredFabric(connection,params);
    connection.release();
    return furnitureListResult;

};

exports.retrieveFilteredLightItemsList = async function (menuId, color, material,type,design) {

    if(color==null) color = '%';
    if(material==null) material = '%';
    if(type==null) type = '%';
    if(design==null) design = '%';

    const params= [color, material,type,design];

    const connection = await pool.getConnection(async (conn) => conn);
    const furnitureListResult = await shopDao.selectFilteredLight(connection,params);
    connection.release();
    return furnitureListResult;

};
exports.retrieveFilteredApplianceItemsList = async function (menuId,brand, energyEfficiency,design) {

    if(brand==null) brand = '%';
    if(energyEfficiency==null) energyEfficiency = '%';
    if(design==null) design = '%';


    const params= [brand, energyEfficiency,design]
    const connection = await pool.getConnection(async (conn) => conn);
    const furnitureListResult = await shopDao.selectFilteredAppliance(connection,params);
    connection.release();
    return furnitureListResult;

};

exports.retrieveItemsList = async function (itemName) {

    if(itemName==null) itemName = '%';
    else newItemName='%'+itemName+'%';


    const connection = await pool.getConnection(async (conn) => conn);
    const furnitureListResult = await shopDao.selectItems(connection,newItemName);
    connection.release();
    return furnitureListResult;

};

exports.retrieveDeliveryInfoList = async function (itemId) {


    const connection = await pool.getConnection(async (conn) => conn);
    const deliveryInfoListResult = await shopDao.selectDeliveryInfo(connection,itemId);
    connection.release();
    return deliveryInfoListResult;

};
exports.retrieveItemDetails = async function (itemId) {

    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const params =[itemId,itemId];
        await connection.beginTransaction();
        const result=[];


        const selectPhotoListResult = await shopDao.selectPhotoList(connection, itemId);
        var pre ={"photoImage" : selectPhotoListResult };
        result.push(pre);

        const selectContentListResult = await shopDao.selectContentList(connection, itemId);
        const pre1 ={"itemInfo" : selectContentListResult };
        result.push(pre1);

        const selectTotalReviewRateResult  = await shopDao.selectTotalReviewRate(connection, params);
        const pre2 ={"totalReivewRate" : selectTotalReviewRateResult };
        result.push(pre2);

        ;
        const selectTotalReviewNumResult  = await shopDao.selectTotalReviewNum(connection, itemId);
        const pre3 ={"totalReviewNum" : selectTotalReviewNumResult };
        result.push(pre3);
        //result.push(selectTotalReviewRateResult);

        const selectReviewListResult = await shopDao.selectReviewListRate(connection, itemId);
        const pre4 ={"reviewList" : selectReviewListResult };
        result.push(pre4);

        //result.push(selectReviewListResult);
        await connection.commit();
        connection.release();
        return result;
    }
    catch (err){


    }
};

exports.retrieveUserIdExist = async function (userId) {

    const connection = await pool.getConnection(async (conn) => conn);

    await connection.beginTransaction();


    const selectUserIdNum = await shopDao.selectUserIdNum(connection, userId);
    await connection.commit();
    connection.release();
    return selectUserIdNum;

};
exports.retrieveUserIdStatus = async function (userId) {

    const connection = await pool.getConnection(async (conn) => conn);

    await connection.beginTransaction();


    const selectUserIdStatus = await shopDao.selectUserIdStatus(connection, userId);
    await connection.commit();
    connection.release();
    return selectUserIdStatus;

};
exports.retrieveCheckResponsibility = async function (userId,itemId) {

    const connection = await pool.getConnection(async (conn) => conn);

    await connection.beginTransaction();
    const para = [userId, itemId];

    const selectBoughtHistory = await shopDao.selectBoughtHistory(connection, para);

    await connection.commit();
    connection.release();
    //console.log(selectBoughtHistory[0]=='0');
    return selectBoughtHistory;


};


exports.retrieveCheckReviewExist = async function (userId,itemId) {

    const connection = await pool.getConnection(async (conn) => conn);

    await connection.beginTransaction();
    const para = [userId, itemId];

    const selectReviewExist = await shopDao.selectReviewExist(connection, para);
    await connection.commit();
    connection.release();
    return selectReviewExist;

};
exports.retrieveGetMyReview = async function (userId) {

    const connection = await pool.getConnection(async (conn) => conn);

    await connection.beginTransaction();


    const selectMyReviews = await shopDao.selectMyReviews(connection, userId);
    await connection.commit();
    connection.release();
    return selectMyReviews;

};
exports.retrieveGetItemOptions = async function (itemId, firstOption) {

    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const para = [itemId, firstOption]

        await connection.beginTransaction();
        const ret = [];
        const ret2 = [];
        const final = [];
        //옵션 종류 가져오기

        const selectItemOption = await shopDao.selectItemOptionName(connection, itemId);

        ret.push("옵션 유형", selectItemOption[0]);
        ret2.push("옵션 유형", selectItemOption[1])
        //첫번째 옵션 목록 가져오기
        const selectFirstItemOption = await shopDao.selectFirstItemOption(connection, itemId);

        ret.push("옵션 목록", selectFirstItemOption);
        //두번째 옵션 목록 가져오기
        const selectSecondItemOption = await shopDao.selectSecondItemOption(connection, para);
        ret2.push("옵션 목록", selectSecondItemOption);

        final.push(ret);
        final.push(ret2);

        await connection.commit();
        connection.release();
        return final;
    }
    catch (err){
        await connection.rollback();
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    }
};
