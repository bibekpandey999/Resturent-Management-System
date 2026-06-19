// lib/types/supplier.types.ts

export interface TSupplier {
  _id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateSupplier {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address?: string;
  isActive: boolean;
}

export interface TUpdateSupplier {
  name?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
}