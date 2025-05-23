import { Document, Schema } from "mongoose";
import { field, schemaHooksWrapper } from "./utils";

export interface ITag {
  name: string;
  type: string;
  colorCode?: string;
  objectCount?: number;
  parentId?: string;
  workspace_id: string;
  created_by?: string;
}

export interface ITagDocument extends ITag, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  order?: string;
  relatedIds?: string[];
}

export const tagSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    workspace_id: field({ type: String, label: "Workspace ID", required: true, index: true }),
    name: field({ type: String, label: "Name" }),
    type: field({
      type: String,
      label: "Type",
      index: true
    }),
    colorCode: field({ type: String, label: "Color code" }),
    objectCount: field({ type: Number, label: "Object count" }),
    order: field({ type: String, label: "Order", index: true }),
    parentId: field({
      type: String,
      optional: true,
      index: true,
      label: "Parent"
    }),
    relatedIds: field({
      type: [String],
      optional: true,
      label: "Children tag ids"
    }),
    created_by: field({ type: String, label: "Created By", optional: true })
  }, { timestamps: true }),
  "erxes_tags"
);

// for tags query. increases search speed, avoids in-memory sorting
tagSchema.index({ type: 1, order: 1, name: 1 });
tagSchema.index({ workspace_id: 1, name: 1 }, { unique: true });
tagSchema.index({ updatedAt: 1 });
