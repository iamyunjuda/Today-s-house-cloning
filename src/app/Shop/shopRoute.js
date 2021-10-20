const shop = require("./shopController");
const jwtMiddleware = require("../../../config/jwtMiddleware");
module.exports = function(app){
    const shop = require('./shopController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const multer = require('multer');
    const upload = ({dest: 'public/images/'});

    // 1. 유저 생성 (회원가입) API
   // app.post('/app/users', user.postUsers);

    //5. 카테고리의 아이템 불러오기
    app.get('/app/items',shop.getMenuItems);

    //6. 아이템 필터 적용하기
    app.get('/app/:menuId/items',shop.getFilteredItems);
    //7. 아이템이름으로 불러오기
    app.get('/app/shops',shop.getItems);

    //8. 아에템 상세페이지
    app.get('/app/:itemId', shop.getItemDetails);
    //9. 교환/환불/배송 관련 페이지
    app.get('/app/:itemId/delivery', shop.getDeliveryInfo);

    //18. 리뷰글 작성하기
    app.post('/app/:userId/reviews',jwtMiddleware,shop.postReview);
    //19.나의 리뷰를 불러오기
    app.get('/app/:userId/reviews',jwtMiddleware,shop.getMyReview);


};


