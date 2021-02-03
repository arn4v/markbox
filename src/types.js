/**
 * @typedef {Object} Bookmark
 * @property {string} id
 * @property {string} title
 * @property {string} url
 * @property {Object} tags
 * @property {string} created
 * @property {string} updated
 */

/**
 * @typedef {("bookmarks" | "tags")} Schema
 */

/**
 * @typedef {Object} Task
 * @property {("add" | "delete")} type
 * @property {Schema} schema
 * @property {Object} data
 */

/**
 * @typedef {Object} Tag
 * @property {string} id
 * @property {string} title
 * @property {string} color
 */
