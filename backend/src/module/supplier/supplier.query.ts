import { AppRouteQueryImplementation } from "@ts-rest/express";
import { supplierContract } from "../../contract/supplier/supplier.contract";
import supplierRepository from "../../repository/supplier.repository";

export const getAllSuppliers: AppRouteQueryImplementation<
  typeof supplierContract.getAllSuppliers
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { data, total } = await supplierRepository.getAll({
      skip: (page - 1) * limit,
      limit,
      search: req.query.search as string,
      isActive: req.query.isActive as string,
    });

    const formatted = data.map((s: any) => ({
      _id: s._id.toString(),
      name: s.name,
      contactPerson: s.contactPerson,
      phone: s.phone,
      email: s.email,
      address: s.address,
      isActive: s.isActive,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    return {
      status: 200,
      body: {
        data: formatted,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch suppliers",
      },
    };
  }
};

export const getSupplierByID: AppRouteQueryImplementation<
  typeof supplierContract.getSupplierByID
> = async ({ req }) => {
  try {
    const supplier = await supplierRepository.getByID(req.params.supplierId);

    if (!supplier) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Supplier not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        _id: supplier._id.toString(),
        name: supplier.name,
        contactPerson: supplier.contactPerson,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
        isActive: supplier.isActive,
        createdAt: supplier.createdAt,
        updatedAt: supplier.updatedAt,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const supplierQueryHandler = {
  getAllSuppliers,
  getSupplierByID,
};
