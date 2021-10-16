const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const shopDao = require("./shopDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveMenuItemsList = async function (menuId) {

        const connection = await pool.getConnection(async (conn) => conn);
        const furnitureListResult = await shopDao.selectMenuItems(connection,menuId);
        connection.release();

        return furnitureListResult;

};

exports.retrieveFilteredFurnitureItemsList = async function (menuId, numOfPeople, material, used, color) {


        if(numOfPeople=="") numOfPeople = '%';
        if(material=="") material = '%';
        if(used=="") used = '%';
        if(color=="") color = '%';

        const params= [numOfPeople, material, used, color]
        const connection = await pool.getConnection(async (conn) => conn);
        const furnitureListResult = await shopDao.selectFilteredFurniture(connection,params);
        connection.release();
        return furnitureListResult;

};

exports.retrieveFilteredFabricItemsList = async function (menuId,  season, color,pattern) {

        if(season=="") season = '%';
        if(color=="") color = '%';
        if(pattern=="") pattern = '%';


        const params= [color,season, pattern]
        const connection = await pool.getConnection(async (conn) => conn);
        const furnitureListResult = await shopDao.selectFilteredFabric(connection,params);
        connection.release();
        return furnitureListResult;

};

exports.retrieveFilteredLightItemsList = async function (menuId, color, material,type,design) {

        if(color=="") color = '%';
        if(material=="") material = '%';
        if(type=="") type = '%';
        if(design=="") design = '%';

        const params= [color, material,type,design]
        const connection = await pool.getConnection(async (conn) => conn);
        const furnitureListResult = await shopDao.selectFilteredLight(connection,params);
        connection.release();
        return furnitureListResult;

};
exports.retrieveFilteredApplianceItemsList = async function (menuId,brand, energyEfficiency,design) {

        if(brand=="") brand = '%';
        if(energyEfficiency=="") energyEfficiency = '%';
        if(design=="") design = '%';


        const params= [brand, energyEfficiency,design]
        const connection = await pool.getConnection(async (conn) => conn);
        const furnitureListResult = await shopDao.selectFilteredAppliance(connection,params);
        connection.release();
        return furnitureListResult;

};

exports.retrieveItemsList = async function (itemName) {

        if(itemName=="") itemName = '%';



        const connection = await pool.getConnection(async (conn) => conn);
        const furnitureListResult = await shopDao.selectItems(connection,itemName);
        connection.release();
        return furnitureListResult;

};
