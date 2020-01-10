const mysql = require('mysql');
const COMPRASION_MAPPING = {
    'gte': '>=',
    'lte': '<=',
    'eq': '=',
    'lt': '<',
    'gt': '>'
};

function createSortQuery(value) {
    const [column, sortType] = value.split('.');
    return `ORDER BY ${column} ${sortType.toUpperCase()}`;
}

function createFilterQuery(values) {
    return Object.keys(values).reduce((acc, val) => {
        const valueFilters = values[val];
        if (!valueFilters) {
            return acc;
        }
        const result = Object.keys(valueFilters).map(v => `${val}${COMPRASION_MAPPING[v]}${mysql.escape(valueFilters[v])}`).join(' and ');
        return acc ?
            `${acc} and ${result}` :
            result;
    }, '');
}

function createInsertQuery(values) {
    const keys = Object.keys(values);
    const valuesByOrder = keys.map(key => mysql.escape(values[key]));
    return `(${keys.join(',')}) VALUES (${valuesByOrder.join(',')})`;
}

function createUpdateQuery(values) {
    const keys = Object.keys(values);
    return keys.reduce((acc, key, i) => {
        if (i === keys.length - 1) {
            return `${acc}${key} = ${mysql.escape(values[key])}`
        }
        return `${acc}${key} = ${mysql.escape(values[key])} , `
    }, '');
}

module.exports = {
    createFilterQuery,
    createSortQuery,
    createInsertQuery,
    createUpdateQuery,
};
