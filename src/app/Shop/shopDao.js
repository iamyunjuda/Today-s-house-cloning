async function selectAllItems(connection) {
    const selectAllItemsQuery = `

        select itemId, itemName, companyName, price, sale, 100-ceil(round(sale/price,3)*100)  as percenttage,
               reviewRate,
               (select count(reviewId) from Review where Review.itemId ) as numOfreview,
               (select photoUrl from ItemPicture where photoId =(select MAX(photoId) from ItemPicture)) as 'mainPhoto'


        from Item;



      
                `;
    const [itemsRows] = await connection.query(selectAllItemsQuery);
//
    return itemsRows;
}



//카테고리별로 아이템 불러오기
async function selectMenuItems(connection,menuId) {
    const selectItemsListQuery = `
      select itemId, companyName, itemName, sale, 100-ceil(round(sale/price,3)*100)  as percenttage, deliveryFee,
             (Select count(reviewId) from Review where itemid = I.itemid) as 'numOfReviews',
              reviewRate

      From (Item I left outer Join Review R on I.itemId = R.itemId)
      where I.menuId = ?;
                `;
    const [itemsRows] = await connection.query(selectItemsListQuery,menuId);
//
    return itemsRows;
}
async function selectFilteredFurniture(connection, params) {
    const selectItemsListQuery = `
        select itemId,
               (select photoUrl from ItemPicture
                where photoId = (select max(photoId) from ItemPicture where itemId= Item.itemId)) as mainPic,
               companyName as companyName,
               itemName as itemName,
               sale as salePrice,
               price as originalPrice,
               (100-ceil(round(sale/price,3)*100)) as percenttage,
               deliveryFee as deliveryFee,
               (select AVG(reviewAvg) From ReviewRate where ReviewRate.itemId=Item.itemId) as reviewRate,
               ( select count(reviewId) from Review where itemId= Item.itemId) as numOfReview
        From Item
        where menuId=1 and numOfPeople Like ? and material Like ?   and used Like ?  and color Like  ?  ;
    `;
    const [itemsRows] = await connection.query(selectItemsListQuery,params);

    return itemsRows;
}
async function selectFilteredFabric(connection, params) {
    console.log(params);
    const selectItemsListQuery = `
        select itemId,
               (select photoUrl from ItemPicture
                where photoId = (select max(photoId) from ItemPicture where itemId= Item.itemId)) as mainPic,
               (companyName) as companyName,
               (itemName) as itemName,
               (sale) as salePrice,
               (price) as originalPrice,
               (100-ceil(round(sale/price,3)*100)) as percenttage,
               (deliveryFee) as deliveryFee,
               (select AVG(reviewAvg) From ReviewRate where ReviewRate.itemId=Item.itemId) as reviewRate,
               (select count(reviewId) from Review where itemId= Item.itemId) as numOfReview
        from  Item
        where menuId =2 and  color Like ? and season Like ? and pattern Like ?;


    `;
    const [itemsRows] = await connection.query(selectItemsListQuery,params);
    console.log(itemsRows);
    return itemsRows;
}
async function   selectFilteredLight(connection, params) {
    const selectItemsListQuery = `
        select itemId,
               (select photoUrl from ItemPicture
                where photoId = (select max(photoId) from ItemPicture where itemId= Item.itemId)) as mainPic,
               (companyName) as companyName,
               (itemName) as itemName,
               (sale) as salePrice,
               (price) as originalPrice,
               (100-ceil(round(sale/price,3)*100)) as percenttage,
               (deliveryFee) as deliveryFee,
                (select AVG(reviewAvg) From ReviewRate where ReviewRate.itemId=Item.itemId) as reviewRate,
               (select count(reviewId) from Review where itemId= Item.itemId) as numOfReview
        from Item
        where menuId=3 and color Like ? and material Like ? and type Like ? and design LIKE ?;
    `;
    const [itemsRows] = await connection.query(selectItemsListQuery,params);

    return itemsRows;
}
async function   selectFilteredAppliance(connection, params) {
    const selectItemsListQuery = `
        select itemId,
               (select photoUrl from ItemPicture
                where photoId = (select max(photoId) from ItemPicture where itemId= Item.itemId)) as mainPic,
               (companyName) as companyName,
               (itemName) as itemName,
               (sale) as salePrice,
               (price) as originalPrice,
               (100-ceil(round(sale/price,3)*100)) as percenttage,
               (deliveryFee) as deliveryFee,
               (select AVG(reviewAvg) From ReviewRate where ReviewRate.itemId=Item.itemId) as reviewRate,
               (select count(reviewId) from Review where itemId= Item.itemId) as numOfReview
        from Item
        where menuId=4 and brand Like ? and energyEfficiency Like ? and design Like ? ;
    `;
    const [itemsRows] = await connection.query(selectItemsListQuery,params);

    return itemsRows;
}

async function   selectItems(connection, itemName) {
    console.log(itemName);
    const selectItemsListQuery = `
        select itemId, itemName, companyName, price, sale, 100-ceil(round(sale/price,3)*100)  as percenttage,
               reviewRate,
               (select count(reviewId) from Review where Review.itemId=I.itemId ) as numOfreview,
               (select photoUrl from ItemPicture where photoId =(select MAX(photoId) from ItemPicture)) as 'mainPhoto'


        from Item I where itemName Like '?';
    `;
    const [itemsRows] = await connection.query(selectItemsListQuery,itemName);

    return itemsRows;
}

async function   selectDeliveryInfo(connection, itemId) {
    const selectDeliveryInfoQuery = `

        select itemId, deliveryWay, deliveryFee, paymentWay,
               case
                   when freeDeliveryCondition!='' then concat(FORMAT(freeDeliveryCondition,0),'원 이상 구매시 무료배송')
                   END as freeDeliveryCondition,
               case
                   when extraDeliveryFee != 0 then concat(format(extraDeliveryFee,0),'원') END as 'extraDeliveryFee',

                impossiblePlace, concat(FORMAT(returnPrice,0),'원') as returnDeliveryPrice , concat(format(returnPrice*2,0),'원') as returnTurnaroundDeliveryPrice,
               returnAddress, returnInfo, companyName, master, companyAddress, phoneNumber,email,number
        from DeliveryInfo where itemId= ?;


    `;
    const [itemsRows] = await connection.query(selectDeliveryInfoQuery,itemId);

    return itemsRows;
}

async function   selectPhotoList(connection, itemId) {
    const selectDeliveryInfoQuery = `

        SELECT itemId, photoUrl From ItemPicture where itemId = ?;

    `;
    const [itemsRows] = await connection.query(selectDeliveryInfoQuery,itemId);

    return itemsRows;
}
async function   selectContentList(connection, itemId) {
    const selectContentLisQuery = `
        select I.itemId, I.companyName, I.itemName,I.reviewRate, I.price, I.sale,  (100-ceil(round(I.sale/I.price,3)*100)) as percenttage,
               concat(ceil(I.sale*0.003),'P 적립 (WELCOME 0.3% 적용)') as profit,
               case when I.sale > 50000
                        then concat('월 ',format(ceil(I.sale/7),0),'원 (7개월) 무이자활부')END as 'monthlyPay',

                case when I.deliveryFee='Y' && I.menuId=1 THEN concat(D.deliveryFee)
                     when  I.deliveryFee='N' Then  concat(D.deliveryFee)  END  as deliveryFee,
               case when I.deliveryFee='Y' && I.menuId=1 THEN concat(D.paymentWay) END as paymentMethod,
               case when D.freeDeliveryCondition!='' then concat(Format(D.freeDeliveryCondition,0),'원') END as freeDeliveryFeeCondition,
               (D.deliveryWay) ,
               case when  D.impossiblePlace!='배송불가지역이 없습니다.' then  D.impossiblePlace END as impossiblePlace,
               case when  D.impossiblePlace!='배송불가지역이 없습니다.' then  D.extraDeliveryFee END as extraDeliveryFee,
               I.companyName,  I.detailedImage
        from (Item I inner Join DeliveryInfo D on I.itemId= D.itemID)
        where  I.itemId=?;


    `;
    const [itemsRows] = await connection.query(selectContentLisQuery,itemId);

    return itemsRows;
}

async function   selectTotalReviewRate(connection, params) {
    const selectContentLisQuery = `
        select ItemId,
            case  when itemId=? Then  AVG(reviewAvg) END as avgRate
        from ReviewRate where itemId=?;


    `;
    const [itemsRows] = await connection.query(selectContentLisQuery,params);

    return itemsRows;
}
async function   selectTotalReviewNum(connection, itemId) {
    const selectTotalReviewNumQuery = `
        select itemId, count(reviewId)as reviewNum from Review where itemId=?
    `;
    const [itemsRows] = await connection.query(selectTotalReviewNumQuery,itemId);

    return itemsRows;
}


async function   selectReviewListRate(connection, itemId) {
    const selectReviewListQuery = `
        select R.itemId,
               R.reviewId,
               (select U.userNickName from User Where userId=R.userId) as userName,
               (select B.reviewAvg from ReviewRate where userId= R.userId) as reviewAvg,
               concat(R.createdAt, '오늘의집 구매'),
               R.photo, R.context,
               (select count(helpedId) from ReviewHelped where reviewId = R.reviewId ) as helpedNum
        From ((Review R inner join User U on R.userId= U.userId )
                 inner join ReviewRate B on R.userId=B.userId)where R.itemId=?

    `;
    const [itemsRows] = await connection.query(selectReviewListQuery,itemId);

    return itemsRows;
}

async function   selectUserIdNum(connection, userId) {
    const selectUserIdNumQuery = `
        select count(userId) from User where userId=?;

    `;
    const [itemsRows] = await connection.query(selectUserIdNumQuery,userId);

    return itemsRows;
}
async function   selectUserIdStatus(connection, userId) {
    const selectUserIdNumQuery = `
        select status from User where userId=?;

    `;
    const [itemsRows] = await connection.query(selectUserIdNumQuery,userId);

    return itemsRows;
}

async function   selectBoughtHistory(connection, para) {
    const selectBoughtHistoryQuery = `
        select count(userId) as cnt from BoughtHistory where userId=? and itemId=?;

    `;
    const [itemsRows] = await connection.query(selectBoughtHistoryQuery,para);

    return itemsRows[0].cnt;
}
async function   selectReviewExist(connection, para) {
    const selectReviewExistQuery = `
        select  count(userId) as cnt from Review where userId=? and itemId=? ;

    `;
    const [itemsRows] = await connection.query(selectReviewExistQuery,para);
    console.log(itemsRows[0].cnt,"asdf");
    return itemsRows[0].cnt;
}


async function postReview(connection, para) {
    const postReviewsQuery = `
        INSERT INTO Review(userId,itemId, context,photo)VALUES (?,?,?,?);

    `;
    const [itemsRows] = await connection.query(postReviewsQuery,para);

    return;
}


async function postReviewRate(connection, para) {
    const postReviewsQuery = `
        INSERT INTO Review(userId,itemId,durability, design,price,delivery ,reviewAvg)VALUES (?,?,?,?,?,?,?);

    `;
    const [itemsRows] = await connection.query(postReviewsQuery,para);

    return itemsRows;
}

async function selectMyReviews(connection, userId) {
    const postReviewsQuery = `
        select R.createdAt,
               R.reviewId,
               (select itemName from Item where itemId=R.itemId) as itemName,
               (select companyName from Item where itemId=R.itemId) as companyName,
               (select boughtPrice from BoughtHistory where userId=B.userId and itemId=B.itemId) as boughtPrice,
               (select num from BoughtHistory where  userId=B.userId and itemId=B.itemId) as num,
               (select confirmed from BoughtHistory where userId=B.userId and itemId=B.itemId) as confirmed,
               (select photoUrl from ItemPicture where photoId=(select max(photoId) from ItemPicture where ItemId)) as photoUrl

        from((Review R inner Join Item I on R.itemId =I.itemId)
                inner Join BoughtHistory B on R.itemId =B.itemId)
        where R.userId =?;


    `;
    const [itemsRows] = await connection.query(postReviewsQuery,userId);

    return itemsRows;
}

async function selectItemOptionName(connection, itemId) {
    const selectItemOptionQuery = `select optionCategoryName from ItemOptionCategory where itemId = ?; `;
    const [itemsRows] = await connection.query(selectItemOptionQuery ,itemId);

    return itemsRows;
}
async function selectFirstItemOption(connection, itemId) {
    const selectItemOptionQuery = `
        select optionName,
               case
                   when (minPrice!=maxPrice) then concat((format(minprice,0)),'원 ~ ',format(maxPrice,0),'원')
                   when (minPrice=maxPrice) then concat(format(minprice,0),'원')
                   END as price
        from ItemOption where
                optionCategoryId =(select Min(optionCategoryId) from ItemOptionCategory
                                   where itemId=?)


    `;
    const [itemsRows] = await connection.query(selectItemOptionQuery ,itemId);

    return itemsRows;
}

async function selectSecondItemOption(connection, para) {
    const selectItemOptionQuery = `
        select optionName, price from FinalItemOption where optionId =(
            (select optionId from ItemOption where optionId = (select min(optionId) from ItemOption where optionCategoryId=
                                                                                                          (select Min(optionCategoryId) from ItemOptionCategory
                                                                                                           where itemId=?))+?));


    `;
    const [itemsRows] = await connection.query(selectItemOptionQuery ,para);

    return itemsRows;
}

module.exports = {
    selectMenuItems,
    selectFilteredFurniture,
    selectFilteredFabric,
    selectFilteredLight,
    selectFilteredAppliance,
    selectItems,
    selectDeliveryInfo,
    selectPhotoList,
    selectContentList,selectTotalReviewRate,selectReviewListRate,
    selectTotalReviewNum,
    selectUserIdNum,
    selectUserIdStatus,
    selectBoughtHistory,
    selectReviewExist,
    postReview,
    postReviewRate,
    selectMyReviews,
    selectItemOptionName,
    selectFirstItemOption,
    selectSecondItemOption,
    selectAllItems,

};
