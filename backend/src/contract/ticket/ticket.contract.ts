import { initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  kitchenTicketSchema,
  getKitchenTicketByIdSchema,
  getAllKitchenTicketsSchema,
  updateKitchenTicketSchema,
} from "./ticket.schema";

import { successSchema, errorSchema } from "../commonSchema";

const c = initContract();

export const ticketContract = c.router({
  getLiveTickets: {
    method: "GET",
    path: "/ticket",
    summary: "Get all live kitchen tickets",
    query: z.object({
      search: z.string().optional(),
      status: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: z.array(kitchenTicketSchema),
      }),
      500: errorSchema,
    },
  },

  updateTicketDiscount: {
  method: "PUT",
  path: "/ticket/:ticketID/discount",
  summary: "Update ticket discount",
  pathParams: z.object({ ticketID: z.string() }),
  body: z.object({ discount: z.number().min(0) }),
  responses: { 200: successSchema, 404: errorSchema },
},

  getTicketByID: {
    method: "GET",
    path: "/ticket/:ticketID",
    summary: "Get kitchen ticket by ID",
    pathParams: z.object({
      ticketID: z.string(),
    }),
    responses: {
      200: getKitchenTicketByIdSchema,
      404: errorSchema,
    },
  },

  getTicketsByOrder: {
    method: "GET",
    path: "/ticket/order/:orderID",
    summary: "Get all kitchen tickets for a specific order",
    pathParams: z.object({
      orderID: z.string(),
    }),
    responses: {
      200: z.object({
        data: getAllKitchenTicketsSchema,
      }),
      404: errorSchema,
    },
  },

  updateTicketStatus: {
    method: "PUT",
    path: "/ticket/:ticketID",
    summary: "Update kitchen ticket status",
    pathParams: z.object({
      ticketID: z.string(),
    }),
    body: updateKitchenTicketSchema,
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },

  removeTicket: {
    method: "DELETE",
    path: "/ticket/:ticketID",
    summary: "Delete a kitchen ticket",
    pathParams: z.object({
      ticketID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});
