import { AppRouteQueryImplementation } from "@ts-rest/express";
import kitchenTicketRepository from "../../repository/ticket.repository";
import { ticketContract } from "../../contract/ticket/ticket.contract";

const mapTicket = (ticket: any) => {
  const order = ticket.orderId;
  const table = ticket.tableId;

  return {
    // Ticket
    _id: ticket._id?.toString?.(),
    ticketNumber: ticket.ticketNumber,
    status: ticket.status,
    printed: ticket.printed,
    createdAt: ticket.createdAt,

    // Order (populated)
    orderId: order?._id?.toString?.() || ticket.orderId?.toString?.(),
    orderNumber: order?.orderNumber || null,
    customerName: order?.customerName || "Guest",

    waiter: {
      waiterId:
        order?.waiterId?._id?.toString?.() || order?.waiterId?.toString?.(),
      name: order?.waiterId?.name || null,
    },

    // Table (populated)
    table: {
      tableId: table?._id?.toString?.() || ticket.tableId?.toString?.(),
      tableName: table?.name || null,
      capacity: table?.capacity || null,
      status: table?.status || null,
    },

    // Items (kitchen view + finance usable)
    items: (ticket.items ?? []).map((i: any) => ({
      menuItemId: i.menuItemId?._id?.toString?.() || i.menuItemId?.toString?.(),
      name: i.name,
      quantity: i.quantity,
    })),
  };
};

export const getTicketById: AppRouteQueryImplementation<
  typeof ticketContract.getTicketByID
> = async ({ req }) => {
  try {
    const { ticketID } = req.params;

    const ticket = await kitchenTicketRepository.getByID(ticketID);

    if (!ticket) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Ticket not found",
        },
      };
    }

    return {
      status: 200,
      body: mapTicket(ticket),
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch ticket",
      },
    };
  }
};

export const getLiveTickets: AppRouteQueryImplementation<
  typeof ticketContract.getLiveTickets
> = async (req) => {
  try {
    const search = req.query.search as string | undefined;
    const tickets = await kitchenTicketRepository.getAll({
      skip: 0,
      limit: 100,
      status: "pending",
      search,
    });

    return {
      status: 200,
      body: {
        data: tickets.data.map(mapTicket),
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch tickets",
      },
    };
  }
};

export const getTicketsByOrder: AppRouteQueryImplementation<
  typeof ticketContract.getTicketsByOrder
> = async ({ req }) => {
  try {
    const { orderID } = req.params;

    const tickets = await kitchenTicketRepository.getByOrderID(orderID);

    if (!tickets || tickets.length === 0) {
      return {
        status: 404,
        body: {
          success: false,
          error: "No tickets found for this order",
        },
      };
    }

    return {
      status: 200,
      body: {
        data: tickets.map(mapTicket),
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch tickets",
      },
    };
  }
};

export const ticketQueryHandler = {
  getTicketById,
  getLiveTickets,
  getTicketsByOrder,
};
