/**
 * @typedef {import("firebase").default.firestore.Timestamp} Timestamp
 */

/**
 * @typedef {Object} Bookmark
 * @property {string} id
 * @property {string} title
 * @property {string} url
 * @property {Object} tags
 * @property {Timestamp} created
 * @property {Timestamp} updated
 */

/**
 * @typedef {Object} Folder
 * @property {string} id
 * @property {string} title
 * @property {Timestamp} created
 * @property {Timestamp} updated
 */

/**
 * @typedef {("bookmarks" | "tags")} Schema
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
 * @typedef {Object} Tag
 * @property {string} id
 * @property {string} title
 * @property {string} color
 * @property {Timestamp} created
 * @property {Timestamp} updated
 */
