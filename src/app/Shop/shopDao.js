//카테고리별로 아이템 불러오기
async function selectMenuItems(connection,menuId) {
  const selectItemsListQuery = `
      select companyName, itemName, sale, 100-ceil(round(sale/price,3)*100)  as percenttage, deliveryFee,
             (Select count(reviewId) from Review where itemid = I.itemid) as 'numOfReviews',
              reviewRate

      From (Item I left outer Join Review R on I.itemId = R.itemId)
      where I.menuId = ?;
                `;
  const [itemsRows] = await connection.query(selectItemsListQuery,menuId);

  return itemsRows;
}
async function selectFilteredFurniture(connection, params) {
    const selectItemsListQuery = `
        select F.itemId,
               (select photoUrl from FurniturePicture
                where photoId = (select max(photoId) from FurniturePicture where itemId= F.itemId)) as mainPic,
               (select I.companyName) as companyName,
               (select I.itemName) as itemName,
               (select I.sale) as salePrice,
               (select I.price) as originalPrie,
               (100-ceil(round(I.sale/I.price,3)*100)) as percenttage,
               (select I.deliveryFee) as deliveryFee,
               (select count(reviewId) from Review where itemId= I.itemId) as numOfReview
        from (Furniture F inner join  Item I on F.itemId =I.itemId)
        where numPeople Like ? and material Like  ?  and used Like ? and color Like  ? ;

    `;
    const [itemsRows] = await connection.query(selectItemsListQuery,params);

    return itemsRows;
}
async function selectFilteredFabric(connection, params) {
    console.log(params);
    const selectItemsListQuery = `
        select F.itemId,
               (select photoUrl from FabricPicture
                where photoId = (select max(photoId) from FabricPicture where itemId= F.itemId)) as mainPic,
               (select I.companyName) as companyName,
               (select I.itemName) as itemName,
               (select I.sale) as salePrice,
               (select I.price) as originalPrie,
               (100-ceil(round(I.sale/I.price,3)*100)) as percenttage,
               (select I.deliveryFee) as deliveryFee,
               (select count(reviewId) from Review where itemId= I.itemId) as numOfReview
        from (Fabric F inner join  Item I on F.itemId =I.itemId)
        where color Like ? and season Like ? and pattern Like ?;


    `;
    const [itemsRows] = await connection.query(selectItemsListQuery,params);
    console.log(itemsRows);
    return itemsRows;
}
async function   selectFilteredLight(connection, params) {
    const selectItemsListQuery = `
        select L.itemId,
               (select photoUrl from FabricPicture
                where photoId = (select max(photoId) from FurniturePicture where itemId= L.itemId)) as mainPic,
               (select I.companyName) as companyName,
               (select I.itemName) as itemName,
               (select I.sale) as salePrice,
               (select I.price) as originalPrie,
               (100-ceil(round(I.sale/I.price,3)*100)) as percenttage,
               (select I.deliveryFee) as deliveryFee,
               (select count(reviewId) from Review where itemId= I.itemId) as numOfReview
        from (Light L inner join  Item I on L.itemId =I.itemId)

        where color Like ? and material Like ? and type Like ? and design LIKE ?;
    `;
    const [itemsRows] = await connection.query(selectItemsListQuery,params);

    return itemsRows;
}
async function   selectFilteredAppliance(connection, params) {
    const selectItemsListQuery = `
        select H.itemId,
               (select photoUrl from FabricPicture
                where photoId = (select max(photoId) from FurniturePicture where itemId= H.itemId)) as mainPic,
               (select I.companyName) as companyName,
               (select I.itemName) as itemName,
               (select I.sale) as salePrice,
               (select I.price) as originalPrie,
               (100-ceil(round(I.sale/I.price,3)*100)) as percenttage,
               (select I.deliveryFee) as deliveryFee,
               (select count(reviewId) from Review where itemId= I.itemId) as numOfReview
        from (Homeappliance H inner join  Item I on H.itemId =I.itemId)

        where brand Like ? and energyEfficiency Like ? and design Like ? ;
    `;
    const [itemsRows] = await connection.query(selectItemsListQuery,params);

    return itemsRows;
}

async function   selectItems(connection, itemName) {
    const selectItemsListQuery = `
        select itemName, companyName, price, sale, 100-ceil(round(sale/price,3)*100)  as percenttage, reviewRate,
               (select count(reviewId) from Review where Review.itemId=I.itemId ) as numOfreview,
               (select photoUrl from ItemPicture where (select MAX(photoId) from ItemPicture)) as 'mainPhoto'

        from Item I where itemName Like'%';
    `;
    const [itemsRows] = await connection.query(selectItemsListQuery,itemName);

    return itemsRows;
}

async function   selectDeliveryInfo(connection, itemId) {
    const selectDeliveryInfoQuery = `

        select deliveryWay, deliveryFee, paymentWay,
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

        SELECT photoUrl From ItemPicture where itemId = ?;

    `;
    const [itemsRows] = await connection.query(selectDeliveryInfoQuery,itemId);

    return itemsRows;
}
async function   selectContentList(connection, itemId) {
    const selectContentLisQuery = `
        select I.companyName, I.itemName,I.reviewRate, I.price, I.sale,  (100-ceil(round(I.sale/I.price,3)*100)) as percenttage,
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
        select
            case  when itemId=? Then  AVG(reviewAvg) END as avgRate
        from ReviewRate where itemId=?;


    `;
    const [itemsRows] = await connection.query(selectContentLisQuery,params);

    return itemsRows;
}
async function   selectTotalReviewNum(connection, itemId) {
    const selectTotalReviewNumQuery = `
        select count(reviewId)as reviewNum from Review where itemId=?
    `;
    const [itemsRows] = await connection.query(selectTotalReviewNumQuery,itemId);

    return itemsRows;
}


async function   selectReviewListRate(connection, itemId) {
    const selectReviewListQuery = `
        select R.reviewId,
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



};
