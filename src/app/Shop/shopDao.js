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



module.exports = {
    selectMenuItems,
    selectFilteredFurniture,
    selectFilteredFabric,
    selectFilteredLight,
    selectFilteredAppliance,
    selectItems,
};
