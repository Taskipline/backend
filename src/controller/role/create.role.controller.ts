import { Request, Response } from "express";
import { RoleInterface } from "../../interface/role.interface";
import RoleModel from "../../model/role.model";
import InternalServerError from "../../errors/internalServer.error";
import { ErrorCode } from "../../errors/custom.error";
import { findRoleByName } from "../../services/role.services";
import asyncHandler from "express-async-handler";

// Create a new role
export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const { name, permissions }: { name: RoleInterface; permissions: string[] } =
    req.body;

  // Check if the role already exists
  const existingRole = await findRoleByName(name);
  if (existingRole) {
    res.status(400).json({ message: "Role already exists", success: false });
    return;
  }

  // Create the role
  const newRole = new RoleModel({ name, permissions });
  await newRole.save();

  res.status(201).json({ message: "Role created successfully", success: true });
});
