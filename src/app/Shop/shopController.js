const jwtMiddleware = require("../../../config/jwtMiddleware");
const shopProvider = require("../../app/Shop/shopProvider");
const shopService = require("../../app/Shop/shopService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const url =require('url');
const querystring = require('querystring');


const regexEmail = require("regex-email");
const {emit} = require("nodemon");



/**
 * API No. 5
 * API Name : 가구 카테고리 아이템 조회
 * [get] /app/shops/items
 * Query String: menuId
 */


exports.getMenuItems = async function (req, res) {

    const menuId = req.query.menuId;
    // 빈 값 체크
    if (!menuId)
        return res.send(response(baseResponse.SHOP_MENUID_EMPTY));

    console.log(menuId);
    const getFurnitureResponse = await shopProvider.retrieveMenuItemsList(menuId);

    return res.send(response(baseResponse.SUCCESS,(getFurnitureResponse)));
};
/**
 * API No. 6
 * API Name : 아이템 필터걸어서 불러오기
 * [get] /app/shops/items/filters
 * body: {menuId,모든 가구의 필터 }
 * 가구 : numofpepole merterial , used ,color
 * 패브릭 :  season, color pattern
 * 가전 : brand, energyEfiiciency, design
 * 조명 : olor, meterial,type,design
 */


exports.getFilteredItems = async function (req, res) {
    const _url = req.url;
    const menuId = req.params.menuId;
    const parsedData = url.parse(_url,true).query;




    // 빈 값 체크
    if (!menuId)
        return res.send(response(baseResponse.SHOP_MENUID_EMPTY));
    if(menuId==1) {//가구 페이지 필터 사용
        const getFilteredFurnitureResponse = await shopProvider.retrieveFilteredFurnitureItemsList(parsedData.numOfPeople, parsedData.material, parsedData.used, parsedData.color);
        return res.send(response(baseResponse.SUCCESS, (getFilteredFurnitureResponse)));
    }
    if(menuId==2) {//패브릭 페이지 필터 사용
        const getFilteredFabricResponse = await shopProvider.retrieveFilteredFabricItemsList(menuId, parsedData.season, parsedData.color,parsedData.pattern);
        return res.send(response(baseResponse.SUCCESS, (getFilteredFabricResponse)));
    }

    if(menuId==3) {//조명 페이지 필터 사용
        const getFilteredLightResponse = await shopProvider.retrieveFilteredLightItemsList(menuId,parsedData.color, parsedData.material,parsedData.type,parsedData.design);
        return res.send(response(baseResponse.SUCCESS,getFilteredLightResponse));
    }

    if(menuId==4) {//가구 페이지 필터 사용
       const getFilteredApplianceResponse = await shopProvider.retrieveFilteredApplianceItemsList(menuId,parsedData.brand, parsedData.energyEfficiency,parsedData.design);
        return res.send(response(baseResponse.SUCCESS,getFilteredApplianceResponse));
    }




};

/**
 * API No. 7
 * API Name : 아이템 검색어로 불러오기
 * [get] /app/shops
 * Query String: itemName
 *
 */

exports.getItems = async function (req, res) {

    const itemName = req.query.itemName;
    // 빈 값 체크
    if (!itemName)
        return res.send(response(baseResponse.SHOP_ITEMNAME_EMPTY));

    const getItemsResponse = await shopProvider.retrieveItemsList(itemName);
    return res.send(response(baseResponse.SUCCESS,getItemsResponse));




};
/**
 * API No. 8
 * API Name : 아이템 상세페이지
 * [get] /app/:itemId
 * pathVariable :  itemId
 *
 */

exports.getItemDetails = async function (req, res) {

    const itemId = req.params.itemId;

    // 빈 값 체크
    if (!itemId)
        return res.send(response(baseResponse.SHOP_ITEMID_EMPTY));

    const getItemDetailsResponse = await shopProvider.retrieveItemDetails(itemId);

    return res.send(response(baseResponse.SUCCESS,getItemDetailsResponse));




};



/**
 * API No. 9
 * API Name : 아이템 교환,환불
 * [get] /app/:itemId/delivery
 * pathVariable :  itemId
 *
 */

exports.getDeliveryInfo = async function (req, res) {

    const itemId = req.params.itemId;
    // 빈 값 체크
    if (!itemId)
        return res.send(response(baseResponse.SHOP_ITEMID_EMPTY));

    const getDeliveryInfoListResponse = await shopProvider.retrieveDeliveryInfoList(itemId);
    return res.send(response(baseResponse.SUCCESS,getDeliveryInfoListResponse));




};
/**
 * API No. 18
 * API Name : 리뷰글 작성하기
 * [get] /app/:userId/reviews
 * pathVariable : userId
 * Body : itemId, durability, design,price,delivery, photo,content
 *
 *
 */

exports.postReview = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {itemId, durability, design,price,delivery, photo,content} = req.body;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    // 빈 값 체크
    if (!userId)
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    const checkUserId = await shopProvider.retrieveUserIdExist(userId);
    //존재하는 유저인지 확인
    if(checkUserId==0)
        return res.send(response(baseResponse.USER_USERID_NOT_EXIST));

    //비활성화는 아닌지 확인
    const checkUserIdExist = await shopProvider.retrieveUserIdStatus(userId);

    if(checkUserIdExist[0].status=='UNACTIVED')
        return res.send(response(baseResponse.USER_STATUS_UNAVTIVED));
/* 벨리데이션


    //해당 상품을 구매했는지 확인
    const checkResponsibility   = await shopProvider.retrieveCheckResponsibility(userId,itemId);
    if( checkResponsibility ==0)
        return res.send(response(baseResponse.SHOP_ITEM_BOUGHTHISTORY_NOT_EXIST));

    //이미 작성한 리뷰가 있는 것은 아닌지
    const checkReviewExist  = await shopProvider.retrieveCheckReviewExist(userId,itemId);
    if(checkReviewExist>0)
        return res.send(response(baseResponse.SHOP_ITEM_REVIEW_EXIST));

*/
    const postReviewResponse = await shopService.retrievePostReview(userId,itemId, durability, design,price,delivery, photo,content);
    return res.send(response(postReviewResponse));




};

/**
 * API No. 19
 * API Name : 나의 모든 리뷰글 불러오기
 * [get] /app/:userId/reviews
 * pathVariable : userId
 *
 *
 *
 */

exports.getMyReview = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    const userId = req.params.userId;
    // 빈 값 체크
    if (!userId)
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    const checkUserId = await shopProvider.retrieveUserIdExist(userId);
    //존재하는 유저인지 확인
    if(checkUserId==0) return res.send(response(baseResponse.USER_USERID_NOT_EXIST));
    //비활성화는 아닌지 확인
    const checkUserIdExist = await shopProvider.retrieveUserIdStatus(userId);
    if(checkUserIdExist=='UNACTIVATED')return res.send(response(baseResponse.USER_STATUS_UNAVTIVED));


    const getReviewResponse = await shopProvider.retrieveGetMyReview(userId);
    return res.send(response(baseResponse.SUCCESS,getReviewResponse));




};