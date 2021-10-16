const jwtMiddleware = require("../../../config/jwtMiddleware");
const shopProvider = require("../../app/Shop/shopProvider");
const shopService = require("../../app/Shop/shopService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const userService = require("../../app/User/userService");


/**
 * API No. 5
 * API Name : 가구 카테고리 아이템 조회
 * [get] /app/shops/items
 * body: {categoryId}
 */


exports.getMenuItems = async function (req, res) {

    const {menuId} = req.body;
    // 빈 값 체크
    if (!menuId)
        return res.send(response(baseResponse.SHOP_MENUID_EMPTY));

    console.log(menuId);
    const getFurnitureResponse = await shopProvider.retrieveMenuItemsList(menuId);

    return res.send(getFurnitureResponse);
};
/**
 * API No. 6
 * API Name : 아이템 필터걸어서 불러오기
 * [get] /app/shops/items/filters
 * body: {menuId,모든 가구의 필터 }
 * 가구 : numofpepole merterial , usered ,color
 * 패브릭 :  season, color pattern
 * 가전 : brand, energyEfiiciency, design
 * 조명 : olor, meterial,type,design
 */


exports.getFilteredItems = async function (req, res) {

    const {menuId, numOfPeople,material, used, color, season,pattern, brand, energyEfficiency, design, type} = req.body;
    // 빈 값 체크
    if (!menuId)
        return res.send(response(baseResponse.SHOP_MENUID_EMPTY));
    if(menuId==1) {//가구 페이지 필터 사용
        const getFilteredFurnitureResponse = await shopProvider.retrieveFilteredFurnitureItemsList(menuId,numOfPeople, material, used, color);
        return res.send(response(baseResponse.SUCCESS, (getFilteredFurnitureResponse)));
    }
    if(menuId==2) {//패브릭 페이지 필터 사용
        const getFilteredFabricResponse = await shopProvider.retrieveFilteredFabricItemsList(menuId, season, color,pattern);
        return res.send(response(baseResponse.SUCCESS, (getFilteredFabricResponse)));
    }

    if(menuId==3) {//조명 페이지 필터 사용
        const getFilteredLightResponse = await shopProvider.retrieveFilteredLightItemsList(menuId,color, material,type,design);
        return res.send(response(baseResponse.SUCCESS,getFilteredLightResponse));
    }

    if(menuId==4) {//가구 페이지 필터 사용
        const getFilteredApplianceResponse = await shopProvider.retrieveFilteredApplianceItemsList(menuId,brand, energyEfficiency,design);
        return res.send(response(baseResponse.SUCCESS,getFilteredApplianceResponse));
    }




};

/**
 * API No. 7
 * API Name : 아이템 검색어로 불러오기
 * [get] /app/shops
 * body: { itemName }
 *
 */

exports.getItems = async function (req, res) {

    const {itemName} = req.body;
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
