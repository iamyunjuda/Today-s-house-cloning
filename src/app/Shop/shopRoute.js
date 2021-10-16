const shop = require("./shopController");
module.exports = function(app){
    const shop = require('./shopController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const multer = require('multer');
    const upload = ({dest: 'public/images/'});

    // 1. 유저 생성 (회원가입) API
   // app.post('/app/users', user.postUsers);

    //5. 카테고리의 아이템 불러오기
    app.get('/app/shops/menus',shop.getMenuItems);

    //6. 아이템 필터 적용하기
    app.get('/app/shops/filters',shop.getFilteredItems);
    //7. 아이템 불러오기
    app.get('/app/shops',shop.getItems);

    //8. 아에템 상세페이지


};


