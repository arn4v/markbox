/**
 * @typedef {import("firebase").default.firestore.Timestamp} Timestamp
 */

/**
 * @typedef {("bookmarks" | "folders" | "tags")} Schema
 */

/**
 * @typedef {("add" | "delete" | "update")} DatabaseAction
 */

/**
 * @typedef {Object} Task
 * @property {DatabaseAction} type
 * @property {Schema} schema
 * @property {Object} data
 */

/**
 * @typedef {Object} Bookmark
 * @property {string} id
 * @property {string} title
 * @property {string} url
 * @property {Object} tags
 * @property {Date} [created]
 * @property {Date} [updated]
 */

/**
 * @typedef {Object} Folder
 * @property {string} id
 * @property {string} title
 * @property {Date} [created]
 * @property {Date} [updated]
 */

/**
 * @typedef {Object} Tag
 * @property {string} id
 * @property {string} title
 * @property {string} color
 * @property {Date} [created]
 * @property {Date} [updated]
 */
