"use strict";

const constants = require("../../utils/constants");
const COMMODITY_MYSQL_DB_TABLE_NAME = constants.COMMODITY_MYSQL_DB_TABLE_NAME;
const COMMODITY_MYSQL_DB_CONTENT_TO_COMMODITY_MAP_TABLE_NAME =
  constants.COMMODITY_MYSQL_DB_CONTENT_TO_COMMODITY_MAP_TABLE_NAME;

const connPool = require("../db_configs/commodity_sql_config");

/* Commodity object definition. */
var Commodity = function(commodity) {
  this.id = commodity.id;
  this.name = commodity.name;
  this.createdTime = commodity.createdTime;
  this.brand = commodity.brand;
  this.type = commodity.type;
  this.shoppingUrl = commodity.shoppingUrl;
  this.priceRank = commodity.priceRank;
  this.likedRank = commodity.likedRank
}

const dbPoolPromise = connPool.promise();

Commodity.create = async function(newCommodity) {
   const query = `INSERT INTO ${COMMODITY_MYSQL_DB_TABLE_NAME} SET ? `;
   try {
     const rawData = await dbPoolPromise.query(query, newCommodity);
     const response = rawData[0];
     return response;
   } catch(err) {
     throw err;
   }
};

Commodity.findById = async function(id) {
  const query = `SELECT * FROM ${COMMODITY_MYSQL_DB_TABLE_NAME} WHERE id=${id}`;
  try {
    const rawData = await dbPoolPromise.query(query);
    const commodityList = rawData[0];
    return commodityList;
  } catch(err) {
    throw err;
  }
};

Commodity.findByContentId = async function(contentId) {
  const query = `SELECT ${COMMODITY_MYSQL_DB_TABLE_NAME}.* FROM \
                 ${COMMODITY_MYSQL_DB_CONTENT_TO_COMMODITY_MAP_TABLE_NAME} INNER JOIN \
                 ${COMMODITY_MYSQL_DB_TABLE_NAME} ON \
                 ${COMMODITY_MYSQL_DB_CONTENT_TO_COMMODITY_MAP_TABLE_NAME}.commodityId=${COMMODITY_MYSQL_DB_TABLE_NAME}.id \
                 WHERE ${COMMODITY_MYSQL_DB_CONTENT_TO_COMMODITY_MAP_TABLE_NAME}.contentId=${contentId}`;
  try {
    const rawData = await dbPoolPromise.query(query);
    const commodityList = rawData[0];
    return commodityList;
  } catch(err) {
    throw err;
  }
};

Commodity.update = async function(id, commodityFields) {
  const query = `UPDATE ${COMMODITY_MYSQL_DB_TABLE_NAME} SET ? WHERE id=${id}`;
  try {
    const rawData = await dbPoolPromise.query(query, commodityFields);
    const response = rawData[0];
    return response;
  } catch(err) {
    throw err;
  }
};

Commodity.delete = async function(id) {
  const query = `DELETE FROM ${COMMODITY_MYSQL_DB_TABLE_NAME} WHERE id=${id}`;
  try {
    const rawData = await dbPoolPromise.query(query);
    const response = rawData[0];
    return response;
  } catch(err) {
    throw err;
  }
}

module.exports = Commodity;
