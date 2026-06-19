import { AppRouteMutationImplementation } from "@ts-rest/express";
import supplierRepository from "../../repository/supplier.repository";
import { supplierContract } from "../../contract/supplier/supplier.contract";

export const createSupplier: AppRouteMutationImplementation<
  typeof supplierContract.createSupplier
> = async ({ req }) => {
  try {
    const existing = await supplierRepository.getAll({
      skip: 0,
      limit: 1,
      search: req.body.email,
    });

    const emailExists = existing.data.find(
      (s) => s.email === req.body.email,
    );

    if (emailExists) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Supplier already exists",
        },
      };
    }

    await supplierRepository.create(req.body);

    return {
      status: 201,
      body: {
        success: true,
        message: "Supplier created successfully",
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

export const updateSupplier: AppRouteMutationImplementation<
  typeof supplierContract.updateSupplier
> = async ({ req }) => {
  try {
    const { supplierId } = req.params;

    const supplier = await supplierRepository.getByID(supplierId);

    if (!supplier) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Supplier not found",
        },
      };
    }

    await supplierRepository.update(supplierId, req.body);

    return {
      status: 200,
      body: {
        success: true,
        message: "Supplier updated successfully",
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

export const deleteSupplier: AppRouteMutationImplementation<
  typeof supplierContract.deleteSupplier
> = async ({ req }) => {
  try {
    const { supplierId } = req.params;

    const supplier = await supplierRepository.getByID(supplierId);

    if (!supplier) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Supplier not found",
        },
      };
    }

    await supplierRepository.delete(supplierId);

    return {
      status: 200,
      body: {
        success: true,
        message: "Supplier deleted successfully",
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


export const supplierMutationHandler = {
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
